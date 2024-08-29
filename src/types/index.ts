export interface IProduct {
    id: string;
    title: string;
    category: string;
    description?: string;
    image: string;
    price: number | null;
}

export interface IOrder {
    payment: string;
    address: string;
    email: string;
    phone: string;
    total: number;
    items: string[];
}

export interface IOrderResult {
    id: string;
    total: number;
}

export type TProductCart = Pick<IProduct, 'id' | 'title' | 'price'>;
export type TFormOrder = Pick<IOrder, 'address' | 'payment'>;
export type TFormContacts = Pick<IOrder, 'email' | 'phone'>;
export type TFormInputsData = Pick<IOrder, 'address' | 'email' | 'phone'>;

export type TFormErrors = Partial<Record<keyof TFormInputsData, string>>;

export interface IProductsData {
    items: IProduct[];
    preview: string | null;
    getProduct(id: string): IProduct;
}

export interface IOrderData{
    setFormOrder(data: Record<keyof TFormOrder, string>): void;
    setFormContacts(data: Record<keyof TFormContacts, string>): void;
    checkValidationFormOrder(): boolean;
    checkValidationFormContacts(): boolean;
    clearOrder(): void;
}

export interface ICartData {
    items: TProductCart[];
    addProduct(item: TProductCart): void;
    removeProduct(item: TProductCart): void;
    getTotal(): number;
    getSumm(): number;
    clearCart(): void;
}