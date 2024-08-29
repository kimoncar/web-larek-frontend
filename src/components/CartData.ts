import { ICartData, TProductCart } from "../types";
import { IEvents } from "./base/events";

export class CartData implements ICartData {
    items: TProductCart[];
    events: IEvents;

    constructor (events: IEvents) {
        this.events = events;
        this.items = [];
    }

    addProduct(item: TProductCart): void {
        this.items.push(item);
    }

    removeProduct(item: TProductCart): void {
        const index = this.items.indexOf(item);
        if (index >= 0) {
            this.items.splice(index, 1);
        }
    }

    getTotal(): number {
        return this.items.length;
    }

    getSumm(): number {
        const totalSumm = this.items.reduce((summ, item) => {
            return summ += item.price;
        }, 0);
        return totalSumm;
    }

    clearCart() {
        this.items = [];
    }
}