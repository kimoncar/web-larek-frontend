import { IProduct, IProductsData } from "../../types";
import { IEvents } from "../base/events";


export class ProductsData implements IProductsData {
    protected _items: IProduct[];
    protected _preview: string;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    get items() {
        return this._items;
    }

    set items(items: IProduct[]) {
        this._items = items;
        this.events.emit('products:changed');
    }

    getProduct(id: string) {
        return this._items.find((item) => item.id === id);
    }

    set preview(id: string) {
        this._preview = id;
        this.events.emit('modalProduct:open', this.getProduct(id))
    }

    get preview() {
        return this._preview;
    }
}