import { IUser } from '../../types';
import { IEvents } from '../base/events';
import { Form } from '../view/Form';
import { ensureElement } from '../../utils/utils';

export class Order extends Form<IUser> {
  protected btnCash: HTMLButtonElement;
  protected btnCard: HTMLButtonElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container, events);
    this.btnCash = ensureElement<HTMLButtonElement>(
      '.button_alt[name=cash]',
      container
    );
    this.btnCard = ensureElement<HTMLButtonElement>(
      '.button_alt[name=card]',
      container
    );

    this.btnCash.addEventListener('click', () => {
      this.changesInForm('payment', 'cash');
    });
    this.btnCard.addEventListener('click', () => {
      this.changesInForm('payment', 'card');
    });
  }

  set payment(value: string) {
    this.btnCash.classList.toggle('button_alt-active', value === 'cash');
    this.btnCard.classList.toggle('button_alt-active', value === 'card');
  }

  disableButtons() {
    this.btnCard.classList.remove('button_alt-active');
    this.btnCash.classList.remove('button_alt-active');
  }

  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value =
      value;
    this.changesInForm('address', value);
  }

  clear() {
    this.payment = '';
    this.address = '';
  }
}
