import { IEvents } from "../base/events";
import { Component } from "./Component";

interface IPage {
    _catalog: HTMLElement[];
    wrapper: HTMLElement;
    cartButton: HTMLButtonElement;
    _cartCounter: HTMLElement;
}

export class Page extends Component<IPage> {
    protected _catalog: HTMLElement;
    protected wrapper: HTMLElement;
    protected cartButton: HTMLButtonElement;
    protected _cartCounter: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this._catalog = this.container.querySelector('.gallery');
        this.wrapper = this.container.querySelector('.page__wrapper');
        this.cartButton = this.container.querySelector('.header__basket');
        this._cartCounter = this.container.querySelector('.header__basket-counter');

        this.cartButton.addEventListener('click', () => {
            events.emit('modalCart:open');
        })
    }

    set locked(value: boolean) {
        if (value) {
            this.wrapper.classList.add('page__wrapper_locked');
        } else {
            this.wrapper.classList.remove('page__wrapper_locked');
        }
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set cartCounter(value: number) {
        this.setText(this._cartCounter, value);
    }
}