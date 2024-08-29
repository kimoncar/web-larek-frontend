import { IApi, IOrder, IOrderResult, IProduct } from "../types";

export class AppApi {
    private _baseApi: IApi;

	constructor(baseApi: IApi) {
		this._baseApi = baseApi;
	}

    getProducts(): Promise<IProduct[]> {
        return this._baseApi.get<IProduct[]>('/product').then((products: IProduct[]) => products);
    }

    postOrder(data: IOrder): Promise<IOrderResult> {
        return this._baseApi.post<IOrder>(`/order`, data, 'POST').then((res: IOrderResult) => res);
    }

}