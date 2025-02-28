import { IOrderData } from '../../types';
import { createElement, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

/**
 * Класс для отображения корзины покупок.
 * Обрабатывает отображение элементов корзины, общей суммы и активность кнопки.
 */
export class Basket extends Component<IOrderData> {
    productListElement: HTMLElement;
    totalElement: HTMLElement | null;
    basketButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.productListElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalElement = container.querySelector('.basket__price');
        this.basketButton = container.querySelector(
            '.basket__button'
        ) as HTMLButtonElement;

        if (this.basketButton) {
            this.basketButton.addEventListener('click', () => {
                events.emit('basket:toOrder');
            });
        } else {
            console.warn('Basket basketButton not found.');
        }
    }

    set list(productListElement: HTMLElement[]) {
        if (productListElement.length) {
            this.productListElement.replaceChildren(...productListElement);
            this.basketButton.removeAttribute('disabled');
        } else {
            this.productListElement.replaceChildren(
                createElement<HTMLElement>('p', { textContent: 'Корзина пуста' })
            );
            this.basketButton.setAttribute('disabled', 'disabled');
        }
    }

    set total(value: number) {
        this.setText(this.totalElement, `${value} синапсов`);
    }
}
