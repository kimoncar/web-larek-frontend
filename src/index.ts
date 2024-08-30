import { AppApi } from './components/AppApis';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { ProductsData } from './components/models/ProductsData';
import './scss/styles.scss';
import { IApi, IProduct } from './types';
import { API_URL, CDN_URL, settings } from './utils/constants';

const events = new EventEmitter();

const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(CDN_URL, baseApi);
const productsData = new ProductsData(events);

api.getProducts()
  .then(function (data: IProduct[]) {
    productsData.items = data;
    console.log(productsData.items);
    console.log(productsData.getProduct('412bcf81-7e75-4e70-bdb9-d3c73c9803b7'));
  })
  //.then(productsData.items(data))
  .catch(error => console.log(error))
