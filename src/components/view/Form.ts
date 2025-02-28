import { IEvents } from "../base/events";
import { IForm } from "../../types";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

/**
 * Класс для работы с формой.
 * Обрабатывает события изменения значений полей и отправки формы.
 */
export class Form<T> extends Component<IForm> {
    submitButton: HTMLButtonElement;
    errorsElements: HTMLElement;

    /**
     * Конструктор класса Form.
     * Инициализирует обработчики событий для ввода и отправки формы.
     */
    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        // Убедимся, что элементы существуют
        this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        if (!this.submitButton) {
            console.warn('Submit button not found in the form.');
        }

        this.errorsElements = ensureElement<HTMLElement>('.form__errors', this.container);
        if (!this.errorsElements) {
            console.warn('Errors element not found in the form.');
        }

        // Обработчик изменений в форме
        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (target instanceof HTMLInputElement) {
                const field = target.name as keyof T;
                const value = target.value;
                this.changesInForm(field, value);
            }
        });

        // Обработчик отправки формы
        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    /**
     * Уведомляет об изменении значения поля формы.
     */
    protected changesInForm(field: keyof T, value: string) {
        this.events.emit('orderInput:change', {
            field,
            value
        });
    }

    /**
     * Устанавливает активность кнопки отправки формы.
     */
    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    /**
     * Устанавливает текст ошибки.
     */
    set errors(value: string) {
        this.setText(this.errorsElements, value);
    }

    /**
     * Рендерит форму с заданным состоянием.
     */
    render(state: Partial<T> & IForm) {
        const { valid, errors, ...inputs } = state;
        super.render({ valid, errors });
        Object.assign(this, inputs);  // обновление оставшихся свойств
        return this.container;
    }
}