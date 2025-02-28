import { IEvents } from "../base/events";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";


// Класс Modal представляет собой модальное окно, которое можно открывать и закрывать. Он наследуется от класса Component и имеет тип параметра IModal.
interface IModal {
  content: HTMLElement
}

export class Modal extends Component<IModal> {
protected closeModal: HTMLButtonElement
protected _modalContent: HTMLElement

  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container)
    this.closeModal = ensureElement<HTMLButtonElement>('.modal__close', container)
    this._modalContent = ensureElement<HTMLElement>('.modal__content', container)
    this.closeModal.addEventListener('click', this.close.bind(this))
    this.container.addEventListener('click', this.close.bind(this))
    this._modalContent.addEventListener('click', (event) => event.stopPropagation())
  }

  set content(value: HTMLElement) {
    this._modalContent.replaceChildren(value)
  }

  open() {
    this.container.classList.add('modal_active')
    this.events.emit('modal:open')
  }

  close() {
    this.container.classList.remove('modal_active')
    this.content = null
    this.events.emit('modal:close')
  }

  render(data: IModal): HTMLElement {
    super.render(data)
    this.open()
    return this.container
  }
}


