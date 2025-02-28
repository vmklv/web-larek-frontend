// Интерфейс данных о пользователе
export interface IUser {
	payment?: string;
	address?: string;
	email?: string;
	phone?: string;
	total?: string | number;
}

// Интерфейс данных о товаре
export interface IProduct {
	id: string;
	title: string;
	category: string;
	description: string;
	image: string;
	price: number | null;
	button?: string;
	index?: number;
}

// Интерфейс формы заказа
export interface IOrderForm {
	email: string;
	phone: string;
	address: string;
}

//Интерфейс списка товаров
export interface IProductData {
	items: IProduct[];
	total: number;
}

// Интерфейс данных о заказе
export interface IOrderData {
	list: HTMLElement[];
	total: number;
}

// Интерфейс данных о заказе пользователя
export interface IOrderResponse extends IUser {
	items: string[];
}

// Интерфейс состояния приложения
export interface IAppState {
  productStore: IProduct[];
	getItems(): void;
	getTotalBasket(): number;
	getTotalBasketPrice(): number;
	setOrderField(field: keyof IUser, value: string): void;
	validateContact(): boolean;
	validateOrder(): boolean;
	hasProductInBasket(products: IProduct): boolean;
	clearOrder(): boolean;
	clearBasket(): void;
	deleteBasket(): void;
	addBasket(value: IProduct): void;
}

// Интерфейс для валидации форм
export interface IForm {
	valid: boolean; // Состояние валидации формы
	errors: string[]; // Сообщения об ошибках валидации
}

// Тип определения ошибки
export type FormErrors = Partial<Record<keyof IUser, string>>;

// Тип определения метода оплаты
export type PaymentMethod = 'cash' | 'online' | null;

// Тип категории товаров
export type CategoryType =
	| 'другое'
	| 'софт-скил'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

// Маппинг категорий
export type CategoryMap = {
	[Key in CategoryType]: string;
};