export abstract class Component<T> {
	constructor(protected readonly container: HTMLElement) { }

	// Переключение класса
	toggleClass(element: HTMLElement, className: string, force?: boolean) {
		element.classList.toggle(className, force);
	}

	// Установить текстовое содержимое
	protected setText(element: HTMLElement | null, value: unknown) {
		if (element) {
			element.textContent = String(value);
		} else {
			console.warn("Attempted to set text on a null element");
		}
	}

	// Установить статус блокировки элемента
	setDisabled(element: HTMLElement, state: boolean) {
		if (element)
			if (state) {
				element.setAttribute('disabled', 'disabled');
			} else {
				element.removeAttribute('disabled');
			}
	}

	// Скрыть элемент
	protected hideElement(element: HTMLElement) {
		element.style.display = 'none';
	}

	// Показать элемент
	protected showElement(element: HTMLElement) {
		element.style.removeProperty('display');
	}

	// Установить изображение с альтернативным текстом
	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (src) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		} else {
			console.warn('Image source is empty!');
		}
	}

	// Возвращает контейнер с данными
	render(data: Partial<T>): HTMLElement {
		if (data) {
			const updatedData = { ...data };
			Object.assign(this, updatedData);
		}
		if (!(this.container instanceof HTMLElement)) {
			throw new Error('container is not an HTMLElement');
		}
		return this.container;
	}
}
