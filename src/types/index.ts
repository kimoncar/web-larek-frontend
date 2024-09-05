export interface IProduct {
    id: string;
    title: string;
    category: string;
    description?: string;
    image: string;
    price: number | null;
    index?: string;
}

export interface IFormsData {
    payment: string;
    address: string;
    email: string;
    phone: string;
}

export interface IOrder extends IFormsData {
    total: number;
    items: string[];
}

export type TProductCart = Pick<IProduct, 'id' | 'title' | 'price'>;
export type TFormOrder = Pick<IFormsData, 'address' | 'payment'>;
export type TFormContacts = Pick<IFormsData, 'email' | 'phone'>;
export type TFormInputsData = Pick<IFormsData, 'address' | 'email' | 'phone'>;

export type TFormErrors = Partial<Record<keyof TFormInputsData, string>>;

export interface IOrderResult {
    id?: string;
    total?: number;
    error?: string;
}

export interface IProductsData {
    items: IProduct[];
    preview: string;
    getProduct(id: string): IProduct;
}

export interface IOrderData{
    setFormOrder(field: keyof TFormInputsData, value: string): void;
    setFormContacts(field: keyof TFormInputsData, value: string): void;
    checkValidationFormOrder(): boolean;
    checkValidationFormContacts(): boolean;
    clearFormsData(): void;
}

export interface ICartData {
    items: TProductCart[];
    addProduct(item: TProductCart): void;
    removeProduct(item: TProductCart): void;
    getTotal(): number;
    getSumm(): number;
    clearCart(): void;
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IForm {
    valid: boolean;
    errors: string[];
}

export interface IModal {
    container: HTMLElement;
    content: HTMLElement;
}

export interface ICartView {
    cartList: HTMLElement;
    _items: HTMLElement[];
    _totalSumm: HTMLElement;
    button: HTMLButtonElement;
}

export interface IPage {
    _catalog: HTMLElement[];
    wrapper: HTMLElement;
    cartButton: HTMLButtonElement;
    _cartCounter: HTMLElement;
}

export interface IActions {
    onClick: (event: MouseEvent) => void;
}