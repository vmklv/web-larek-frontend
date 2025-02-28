// Импортируем необходимые модули и компоненты
import './scss/styles.scss';

import { ApiService } from './components/ApiService';
import { AppState } from './components/models/AppState';
import { Page } from './components/Page';

import { Card, CardInfo, CardOnPage, ICardAction } from './components/view/Card';
import { Contacts } from './components/view/ContactsForm';
import { Order } from './components/view/OrderForm';
import { Modal } from './components/view/Modal';
import { Basket } from './components/view/Basket';
import { ISucces, Success } from './components/view/Success';

import { EventEmitter } from './components/base/events';

import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

import { CategoryType, IOrderResponse, IProduct, IUser } from './types';

// Инициализация событий и API
const events = new EventEmitter();
const api = new ApiService(API_URL, CDN_URL);

// Получение шаблонов
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Инициализация моделей и компонентов
const appModel = new AppState({}, events);
const appModelPage = new Page(document.body, events);
const appModalPage = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {
  onClick: () => appModalPage.close(),
});

// Функция для создания карточки
function createCard(item: IProduct, template: HTMLTemplateElement, onClick: () => void): HTMLElement {
  const card = new CardOnPage(cloneTemplate(template), {
    onClick,
    price: item.price,
    title: item.title,
  });
  return card.render({
    id: item.id,
    title: item.title,
    price: item.price,
    category: item.category as CategoryType,
    image: item.image,
  });
}

// Загрузка товаров
async function fetchProducts() {
  try {
    const data = await api.getProducts();
    if (!data) throw new Error('Данные не были получены');
    appModel.getProducts(data);
  } catch (err) {
    console.error('Ошибка при загрузке продуктов:', err);
  }
}

fetchProducts();

// Обработчики событий

// Изменение каталога товаров
events.on('items:changed', () => {
  appModelPage.catalog = appModel.getItems().map((item) =>
    createCard(item, cardCatalogTemplate, () => events.emit('card:selected', item))
  );
});

// Блокировка страницы при открытии модального окна
events.on('modal:open', () => {
  appModelPage.locked = true;
});

// Разблокировка страницы при закрытии модального окна
events.on('modal:close', () => {
  appModelPage.locked = false;
});

// Открытие предпросмотра карточки
events.on('card:selected', (item: IProduct) => {
  appModel.setPreview(item);
});

// Отображение предпросмотра карточки
events.on('preview:change', (item: IProduct) => {
  const productInBasket = appModel.hasProductInBasket(item.id);
  const cardPreview = new CardInfo(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      if (productInBasket) {
        events.emit('basket:remove', item);
      } else {
        events.emit('basket:add', item);
      }
      appModalPage.close();
    },
    price: item.price,
    title: item.title,
  } as ICardAction);

  appModalPage.render({
    content: cardPreview.render({
      id: item.id,
      title: item.title,
      price: item.price,
      category: item.category as CategoryType,
      image: item.image,
      description: item.description,
      button: productInBasket ? 'Удалить из корзины' : 'В корзину',
    }),
  });
});

// Обновление корзины
events.on('basket:change', () => {
  appModelPage.counter = appModel.getCountBasket();
  basket.total = appModel.getTotalBasketPrice();
  basket.list = appModel.getBasket().map((item, index) => {
    const card = new Card(cloneTemplate(cardBasketTemplate), {
      price: item.price,
      title: item.title,
      onClick: () => events.emit('basket:remove', item),
    });
    return card.render({
      price: item.price,
      title: item.title,
      index: index + 1,
    });
  });
});

// Добавление товара в корзину
events.on('basket:add', (item: IProduct) => {
  appModel.addInBasket(item.id);
  events.emit('basket:change');
});

// Удаление товара из корзины
events.on('basket:remove', (item: IProduct) => {
  appModel.deleteFromBasket(item.id);
  events.emit('basket:change');
});

// Открытие корзины
events.on('basket:open', () => {
  appModalPage.render({
    content: basket.render({}),
  });
});

// Открытие формы заказа
events.on('basket:toOrder', () => {
  order.clear();
  contacts.clear();
  appModel.clearOrderData();

  appModalPage.render({
    content: order.render({
      valid: false,
      errors: [],
      address: '',
      payment: null,
    }),
  });
});

// Обработка ошибок ввода
events.on('input:error', (errors: Partial<IUser>) => {
  const { payment, address, email, phone } = errors;
  order.valid = !payment && !address;
  contacts.valid = !email && !phone;
  order.errors = Object.values({ address, payment })
    .filter((i) => !!i)
    .join('; ');
  contacts.errors = Object.values({ phone, email })
    .filter((i) => !!i)
    .join('; ');
  order.payment = appModel.getPayment();
});

// Обработка изменения данных формы
events.on('orderInput:change', (data: { field: keyof IUser; value: string }) => {
  appModel.addOrderField(data.field, data.value);
});

// Обработка отправки формы заказа
events.on('order:submit', () => {
  appModalPage.render({
    content: contacts.render({
      valid: false,
      errors: [],
    }),
  });
});

// Отправка данных контактов
events.on('contacts:submit', () => {
  const orderData = appModel.getUserData();
  orderData.total = appModel.getTotalBasketPrice();

  const payload: IOrderResponse = {
    payment: orderData.payment,
    address: orderData.address,
    email: orderData.email,
    phone: orderData.phone,
    total: orderData.total,
    items: appModel.getBasketId(),
  };

  api
    .postOrder(payload)
    .then((result) => {
      events.emit('order:success', result);
      appModel.clearBasket();
      appModelPage.counter = appModel.getCountBasket();
    })
    .catch((error) => {
      console.error('Ошибка отправки заказа:', error);
    });
});

// Обработка успешного оформления заказа
events.on('order:success', (result: ISucces) => {
  appModalPage.render({
    content: success.render({
      total: result.total,
    }),
  });
  order.clear();
  contacts.clear();
  appModel.clearOrderData();
  appModel.clearBasket();
});