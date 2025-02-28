import { Api, ApiListResponse } from './base/api';
import { IProduct, IOrderResponse } from '../types';

export class ApiService extends Api {
    readonly cdn: string;

    constructor(baseUrl: string, cdn: string, options: RequestInit = {}) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    /**
     * Получает список продуктов с сервера.
     */
    getProducts(): Promise<IProduct[]> {
        return this.getData<ApiListResponse<IProduct>>('/product')
            .then((data) => {
                console.log('Данные получены:', data);
                return this.transformProductImages(data.items);
            });
    }

    /**
     * Отправляет заказ на сервер.
     */
    postOrder(order: IOrderResponse): Promise<IOrderResponse> {
        return this.postData<IOrderResponse>('/order', order)
            .then((data) => {
                console.log('Заказ успешно отправлен:', data);
                return data;
            });
    }

    /**
     * Преобразует URL изображений продуктов, добавляя CDN.
     */
    private transformProductImages(items: IProduct[]): IProduct[] {
        return items.map((item) => ({
            ...item,
            image: this.cdn + item.image,
        }));
    }

    /**
     * Обрабатывает ошибки, возникающие при запросах.
     */
    private handleError(err: Error, context: string): never {
        console.error(`Ошибка в ${context}:`, err);
        throw new Error(`${context}: ${err.message}`);
    }

    /**
     * Выполняет GET-запрос к API.
     */
    private getData<T>(endpoint: string): Promise<T> {
        return this.get(endpoint)
            .then((data: object) => data as T) // Приведение типа
            .catch((err) => this.handleError(err, `getData(${endpoint})`));
    }

    /**
     * Выполняет POST-запрос к API.
     */
    private postData<T>(endpoint: string, data: any): Promise<T> {
        return this.post(endpoint, data)
            .then((response: object) => response as T) // Приведение типа
            .catch((err) => this.handleError(err, `postData(${endpoint})`));
    }
}