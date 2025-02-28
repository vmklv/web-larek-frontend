// src/components/common/Success.ts
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface ISuccessAction {
    onClick: () => void;
}

export interface ISucces {
    total: number;
}

// Класс предназначен для отображения информации о успешном выполнении
export class Success extends Component<ISucces> {
    protected totalAmount: HTMLElement;
    protected dismissButton: HTMLButtonElement;

    /**
     * Конструктор класса Success.
     */
    constructor(
        protected container: HTMLElement,
        protected actions: ISuccessAction
    ) {
        super(container);

        // Проверка наличия элементов и привязка событий
        this.totalAmount = ensureElement<HTMLElement>(
            '.order-success__description',
            this.container
        );
        if (!this.totalAmount) {
            console.warn('Total amount element not found');
        }

        this.dismissButton = ensureElement<HTMLButtonElement>(
            '.order-success__close',
            this.container
        );
        if (!this.dismissButton) {
            console.warn('Close button element not found');
        }

        // Привязка события, если onClick существует
        if (this.actions?.onClick) {
            this.dismissButton.addEventListener('click', this.actions.onClick);
        }
    }

    /**
     * Сеттер для установки суммы в успешном сообщении.
     */
    set total(value: string) {
        this.setText(this.totalAmount, `Списано ${value} синапсов`);
    }
}
