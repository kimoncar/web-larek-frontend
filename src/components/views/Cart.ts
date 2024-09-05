import { ICartView } from "../../types";
import { createElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "./common/Component";

export class Cart extends Component<ICartView> {
    protected cartList: HTMLElement;
    protected _items: HTMLElement[];
    protected _totalSumm: HTMLElement;
    protected button: HTMLButtonElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this.cartList = this.container.querySelector('.basket__list');
        this._totalSumm = this.container.querySelector('.basket__price');
        this.button = this.container.querySelector('.basket__button');

        if(this.button) {
            this.button.addEventListener('click', () => {
                events.emit('orderForm:open')
            });
        }

        this.disabledButton(true);
        this.emptyCart();
    }

    set totalSumm(total: number) {
        this.setText(this._totalSumm, `${total.toString()} синапсов`);
    }

    set items(items: HTMLElement[]) {
        this._items = items;
        if (items.length) {
            this.cartList.replaceChildren(...items);
        } else {
            this.emptyCart();
        }
    }

    get items(): HTMLElement[]{
        return this._items;
    }

    disabledButton(value: boolean): void {
        this.button.disabled = value;
    }

    emptyCart(): void {
        this.cartList.replaceChildren(createElement<HTMLParagraphElement>('p', {
            textContent: 'Добавьте товары в корзину'
        }));
    }
}