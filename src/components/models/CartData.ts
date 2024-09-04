import { ICartData, TProductCart } from "../../types";
import { IEvents } from "../base/events";

export class CartData implements ICartData {
    _items: TProductCart[];
    events: IEvents;

    constructor (events: IEvents) {
        this.events = events;
        this._items = [];
        this.events.emit('cart:change', this._items);
    }

    addProduct(item: TProductCart): void {
        this._items.push(item);
        this.events.emit('cart:change', this._items);
    }

    removeProduct(item: TProductCart): void {
        const index = this._items.indexOf(item);
        if (index >= 0) {
            this._items.splice(index, 1);
        }
        this.events.emit('cart:change', this._items);
    }

    getTotal(): number {
        return this._items.length;
    }

    getSumm(): number {
        const totalSumm = this._items.reduce((summ, item) => {
            return summ += item.price;
        }, 0);
        return totalSumm;
    }

    clearCart() {
        this._items = [];
        this.events.emit('cart:change', this._items);
    }

    get items() {
        return this._items;
    }
}