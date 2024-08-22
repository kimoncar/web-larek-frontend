import { IEvents } from "../components/base/events";

export interface IProduct {
    id: string;
    title: string;
    category: string;
    description?: string;
    image: string;
    price: number | null;
}

export interface IForm {
    payment: string;
    address: string;
    email: string;
    phone: string;
}

export interface IOrder extends IForm {    
    total: number;
    items: string[];
}

export interface IOrderResult {
    id: string;
    total: number;
}

export type IFormInputsData = Pick<IOrder, 'address' | 'email' | 'phone'>;

export interface IProductsData {
    items: IProduct[];
    preview: string;
    event: IEvents;
    getProduct(id: string): IProduct;
}

export interface IOrderData {
    event: IEvents;
    setOrder(orderData: IOrder): void;
    checkOrderValidation(data: Record<keyof IFormInputsData, string>): boolean;
}

export interface ICartData {
    items: Map<string, number>;
    addProduct(id: string): void;
    removeProduct(id: string): void;
    getTotal(): number;
    getSumm(): number;
}