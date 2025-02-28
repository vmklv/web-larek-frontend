import { IProduct, IUser, FormErrors } from '../../types';
import { IEvents } from '../base/events';
import { Model } from '../base/Model';

export class AppState extends Model<IProduct> {
	protected items: IProduct[] = [];
	protected basket: IProduct[] = [];
	protected userData: IUser = {};
	protected formErrors: FormErrors = {};
	protected preview: string;
	// protected events = new EventTarget();

	constructor(data: Partial<IProduct>, events: IEvents) {
		super(data, events);
		this.userData = {
			payment: '',
			address: '',
			email: '',
			phone: '',
		};
	}

	//метод для получения данных о пользователе
	getUserData() {
		return this.userData;
	}

	//метод для получения списка карточек
	getProducts(cards: IProduct[]) {
		this.items = cards;
		this.events.emit('items:changed', { items: this.items });
	}

	//метод предпросмотра
	setPreview(card: IProduct) {
		this.preview = card.id;
		this.events.emit('preview:change', card);
	}

	// метод получения списка ID товаров в корзине
	getBasketId() {
		return this.basket.map((item) => item.id);
	}

	//метод получения элемента по ID
	getItemById(id: string): IProduct {
		return this.items.find((item) => item.id === id);
	}

	//метод добавления в корзину
	addInBasket(id: string): void {
		this.basket.push(this.getItemById(id));
		this.events.emit('basket:change', this.basket);
	}

	//метод удаления из корзины
	deleteFromBasket(id: string): void {
		this.basket = this.basket.filter((item) => item.id !== id);
		this.events.emit('basket:change', this.basket);
	}

	//  Очистка корзины
	clearBasket() {
		this.basket = [];
		this.events.emit('basket:change', this.basket);
	}

	//метод получения списка
	setItems(items: IProduct[]): void {
		this.items = items;
	}

	//возвращает массив товаров в корзине
	getBasket(): IProduct[] {
		return this.basket;
	}

	//получает список товаров
	getItems(): IProduct[] {
		return this.items;
	}

	//получение общей стоимости корзины
	getTotalBasketPrice() {
		return this.basket.reduce((acc, item) => acc + item.price, 0);
	}

	//возвращает общее количество товаров в корзине
	getCountBasket() {
		return this.basket.length;
	}

	//проверяет корректность контактных данных
	validateContact(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this.userData.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.userData.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		if (!this.userData.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.userData.phone) {
			errors.phone = 'Необходимо указать номер телефона';
		}
		this.formErrors = errors;
		this.events.emit('input:error', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	//очищает данные заказа
	clearOrder() {
		this.userData = {
			payment: '',
			address: '',
			email: '',
			phone: '',
		};
		this.events.emit('input:error', this.formErrors);
	}

	//получение ошибок формы
	getFormErrors() {
		return this.formErrors;
	}

	//получение полей
	getPayment() {
		return this.userData.payment;
	}

	//Метод для заполнения полей email, phone, address, payment
	addOrderField(field: keyof IUser, value: string) {
		this.userData[field] = value;
		this.validateContact();
	}

	//проверяет наличие товара в корзине
	hasProductInBasket(id: string): boolean {
		return this.basket.some((item) => item.id === id);
	}

	// Очистка данных о заказе
	clearOrderData() {
		this.userData = {
			payment: '',
			address: '',
			email: '',
			phone: '',
		};

		this.formErrors = {};
		this.events.emit('input:error', this.formErrors);
	}
}
