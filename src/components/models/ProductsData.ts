import { IProduct, IProductsData } from "../../types";
import { IEvents } from "../base/events";


export class ProductsData implements IProductsData {
    protected _items: IProduct[];
    protected _preview: string | null;
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

    set preview(id: string | null) {
        if (!id) {
            this._preview = null;
            return;
        }
        
        const selectedProduct = this.getProduct(id);
        if (selectedProduct) {
            this._preview = id;
            this.events.emit('products:preview');
        }
    }

    get preview() {
        return this._preview;
    }
}