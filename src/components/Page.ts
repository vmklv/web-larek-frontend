import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

interface IPage {
    catalog: HTMLElement[];
}

export class Page extends Component<IPage> {
    protected basketCounter: HTMLElement;
    protected gallery: HTMLElement;
    protected wrapper: HTMLElement;
    protected basket: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.init();
    }

    protected init() {
        this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
        this.gallery = ensureElement<HTMLElement>('.gallery');
        this.wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this.basket = ensureElement<HTMLElement>('.header__basket');

        if (this.basket) {
            this.basket.addEventListener('click', () => {
                this.events.emit('basket:open');
            });
        }
    }

    /**
     * Устанавливает значение счетчика в хедере.
     */
    set counter(value: number) {
        if (this.basketCounter) {
            this.setText(this.basketCounter, String(value));
        }
    }

    /**
     * Устанавливает содержимое каталога в элементе gallery.
     */
    set catalog(items: HTMLElement[]) {
        if (items.length === 0) {
            this.gallery.innerHTML = '';
        } else {
            this.gallery.replaceChildren(...items);
        }
    }

    /**
     * Устанавливает состояние блокировки страницы.
     */
    set locked(value: boolean) {
        this.wrapper.classList.toggle('page__wrapper_locked', value);
    }
}