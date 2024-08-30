import { AppApi } from './components/AppApis';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { ProductsData } from './components/models/ProductsData';
import { Page } from './components/view/Page';
import { Product } from './components/view/Product';
import './scss/styles.scss';
import { IApi, IProduct } from './types';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { cloneTemplate } from './utils/utils';

const events = new EventEmitter();

const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(CDN_URL, baseApi);
const productsData = new ProductsData(events);

const productTemplate: HTMLTemplateElement = document.querySelector('#card-catalog');
const productContainer = new Page(document.querySelector('.gallery'));

// Получаем товары с сервера
api.getProducts()
  .then(function (data: IProduct[]) {
    productsData.items = data;
    events.emit('initialData:loaded');
  })
  .catch(error => console.log(error));

// Обновляем каталог товаров
events.on('initialData:loaded', () => {
  const productsArray = productsData.items.map((item) => {
    const productInstant = new Product(cloneTemplate(productTemplate), events);
    return productInstant.render(item);
  });
  
  productContainer.render({ catalog: productsArray });
})