import { AppApi } from './components/AppApis';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { CartData } from './components/models/CartData';
import { ProductsData } from './components/models/ProductsData';
import { Modal } from './components/view/Modal';
import { Page } from './components/view/Page';
import { Product } from './components/view/Product';
import './scss/styles.scss';
import { IApi, IProduct, TProductCart } from './types';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { cloneTemplate } from './utils/utils';

const events = new EventEmitter();

const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(CDN_URL, baseApi);
const productsData = new ProductsData(events);
const cartData = new CartData(events);

const productCatalogTemplate: HTMLTemplateElement = document.querySelector('#card-catalog');
const productPreviewTemplate: HTMLTemplateElement = document.querySelector('#card-preview');
const cartTemplate: HTMLTemplateElement = document.querySelector('#basket');

const productContainer = new Page(document.querySelector('.gallery'));
const modalContainer = new Modal(document.querySelector('#modal-container'), events);

// Получаем товары с сервера
api.getProducts()
  .then(function (data: IProduct[]) {
    productsData.items = data;
    events.emit('initialData:loaded');
  })
  .catch(error => console.log(error));

// Заполнение каталога товаров
events.on('initialData:loaded', () => {
  const productsArray = productsData.items.map((item) => {
    const productInstant = new Product(
      cloneTemplate(productCatalogTemplate),
      events,
      {onClick: () => events.emit('product:select', item)}
    );
    return productInstant.render(item);
  });
  
  productContainer.render({ catalog: productsArray });
});

events.on('product:select', (productItem: IProduct) => {
  productsData.preview = productItem.id;
});

events.on('modalProduct:open', (productItem: IProduct) => {
  const productItemCart: TProductCart = {
    id: productItem.id,
    title: productItem.title,
    price: productItem.price,
  }
  const productPreview = new Product(
    cloneTemplate(productPreviewTemplate), 
    events,
    {onClick: () => events.emit('cartItem:add', productItemCart)} 
  );
  modalContainer.content = productPreview.render(productItem);
  modalContainer.render();
});

events.on('cartItem:add', (productItemCart: TProductCart) => {
  cartData.addProduct(productItemCart);
  modalContainer.close();
});

