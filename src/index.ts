import { AppApi } from './components/AppApis';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { CartData } from './components/models/CartData';
import { ProductsData } from './components/models/ProductsData';
import { Cart } from './components/view/Cart';
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
const productCartTemplate: HTMLTemplateElement = document.querySelector('#card-basket');
const cartTemplate: HTMLTemplateElement = document.querySelector('#basket');

const page = new Page(document.body, events);
const modalContainer = new Modal(document.querySelector('#modal-container'), events);
const cart = new Cart(cloneTemplate(cartTemplate), events);

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
  
  page.catalog = productsArray;
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

events.on('cartItem:remove', (productItemCart: TProductCart) => {
  cartData.removeProduct(productItemCart);
});

events.on('cart:change', (items: TProductCart[]) => {
  cart.items = items.map((item, index) => {
    const productCartInstant = new Product(
      cloneTemplate(productCartTemplate),
      events,
      {onClick: () => events.emit('cartItem:remove', item)}
    );
    return productCartInstant.render({...item, index: (index+1).toString()});
  });
  const totalSummCart = cartData.getSumm();
  cart.totalSumm = totalSummCart;
  cart.toggleButton(totalSummCart === 0);
  page.cartCounter = cartData.getTotal();
  //TODO: общую сумму и колличество передать в заказ!
});

events.on('modalCart:open', () => {
  modalContainer.content = cart.render();
  modalContainer.render();
});




// Модальное окно открыто
events.on('modal:open', () => {
  page.locked = true;
});

// Модальное окно закрыто
events.on('modal:close', () => {
  page.locked = false;
});