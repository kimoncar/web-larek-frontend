import { IApi, IOrder, IOrderResult, IProduct } from "../../types";
import { ApiListResponse } from "../base/api";

export class AppApi {
    private _baseApi: IApi;
    readonly cdn: string;

	constructor(cdn:string, baseApi: IApi) {
		this._baseApi = baseApi;
        this.cdn = cdn;
	}

    getProducts(): Promise<IProduct[]> {
        return this._baseApi.get<ApiListResponse<IProduct>>('/product').then((data:ApiListResponse<IProduct>) => 
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image,
              }))
        );
    }
    
    postOrder(data: IOrder): Promise<IOrderResult> {
        return this._baseApi.post<IOrder>(`/order`, data, 'POST').then((res: IOrderResult) => res);
    }

}