import { Api } from './components/base/api';
import { AppApi } from './components/base/AppApis';
import { EventEmitter } from './components/base/events';
import { CartData } from './components/models/CartData';
import { OrderData } from './components/models/OrderData';
import { ProductsData } from './components/models/ProductsData';
import { Cart } from './components/view/Cart';
import { Modal } from './components/view/common/Modal';
import { ContactsForm } from './components/view/ContactsForm';
import { OrderForm } from './components/view/OrderForm';
import { Page } from './components/view/Page';
import { Product } from './components/view/Product';
import { Success } from './components/view/Success';
import './scss/styles.scss';
import { IApi, IOrder, IOrderResult, IProduct, TFormErrors, TProductCart } from './types';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { cloneTemplate } from './utils/utils';

const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(CDN_URL, baseApi);

const events = new EventEmitter();

const productsData = new ProductsData(events);
const cartData = new CartData(events);
const orderData = new OrderData(events);

const productCatalogTemplate: HTMLTemplateElement = document.querySelector('#card-catalog');
const productPreviewTemplate: HTMLTemplateElement = document.querySelector('#card-preview');
const productCartTemplate: HTMLTemplateElement = document.querySelector('#card-basket');
const cartTemplate: HTMLTemplateElement = document.querySelector('#basket');
const orderFormTemplate: HTMLTemplateElement = document.querySelector('#order');
const contactsFormTemplate: HTMLTemplateElement = document.querySelector('#contacts');
const successTemplate: HTMLTemplateElement = document.querySelector('#success');

const page = new Page(document.body, events);
const modalContainer = new Modal(document.querySelector('#modal-container'), events);
const cart = new Cart(cloneTemplate(cartTemplate), events);
const orderForm = new OrderForm(
    cloneTemplate(orderFormTemplate),
    events,
    { onClick: (evt: Event) => events.emit('payment:change', evt.target) }
);
const contactsForm = new ContactsForm(cloneTemplate(contactsFormTemplate), events);
const success = new Success(
    cloneTemplate(successTemplate),
    { onClick: () => modalContainer.close() }
);

// Получить товары с сервера
api.getProducts()
    .then(function (data: IProduct[]) {
        productsData.items = data;
        events.emit('initialData:loaded');
    })
    .catch(error => console.log(error));

// Заполненить каталог товаров на странице
events.on('initialData:loaded', () => {
    const productsArray = productsData.items.map((item) => {
        const productInstant = new Product(
            cloneTemplate(productCatalogTemplate),
            events,
            { onClick: () => events.emit('product:select', item) }
        );
        return productInstant.render(item);
    });

    page.catalog = productsArray;
});

// Открыть модалку с описанием товара
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
        { onClick: () => events.emit('cartItem:add', productItemCart) }
    );

    if (cartData.items.find((item) => item.id === productItem.id)) {
        productPreview.disabledButton(null);
        productPreview.setButtonText('Уже в корзине');
    }

    modalContainer.content = productPreview.render(productItem);
    modalContainer.render();
});

// Добавить товар в корзину
events.on('cartItem:add', (productItemCart: TProductCart) => {
    cartData.addProduct(productItemCart);
    modalContainer.close();
});

// Удалить товар из корзины
events.on('cartItem:remove', (productItemCart: TProductCart) => {
    cartData.removeProduct(productItemCart);
});

// Обновить список товаров в корзине, общую сумму и счетчик в шапке
events.on('cart:change', (items: TProductCart[]) => {
    cart.items = items.map((item, index) => {
        const productCartInstant = new Product(
            cloneTemplate(productCartTemplate),
            events,
            { onClick: () => events.emit('cartItem:remove', item) }
        );
        return productCartInstant.render({
            ...item,
            index: (index + 1).toString()
        });
    });

    const totalSummCart = cartData.getSumm();
    cart.totalSumm = totalSummCart;
    cart.toggleButton(totalSummCart === 0);
    page.cartCounter = cartData.getTotal();
});

// Открыть модалку корзины
events.on('modalCart:open', () => {
    modalContainer.content = cart.render();
    modalContainer.render();
});

// Открыть модалку оформления заказа
events.on('orderForm:open', () => {
    modalContainer.content = orderForm.render({
        address: '',
        valid: false,
        errors: []
    });
    modalContainer.render();
});

// Открыть модалку оформления контактов
events.on('orderForm:submit', () => {
    modalContainer.content = contactsForm.render({
        email: '',
        phone: '',
        valid: false,
        errors: []
    });
    modalContainer.render();
});

// Переключить способ оплаты
events.on('payment:change', (button: HTMLButtonElement) => {
    orderForm.togglePaymentButton(button.name);
    orderData.setFormOrder('payment', button.name);
});

// Изменить значение адреса
events.on('orderForm:change', (data: { field: keyof TFormErrors, value: string }) => {
    orderData.setFormOrder(data.field, data.value);
});

// Изменить значения email и телефона
events.on('contactsForm:change', (data: { field: keyof TFormErrors, value: string }) => {
    orderData.setFormContacts(data.field, data.value);
});

// Проверить валидацию форм
events.on('formError:change', (errors: TFormErrors) => {
    const { address, email, phone } = errors;
    orderForm.valid = !address;
    contactsForm.valid = !email && !phone;
    orderForm.errors = Object.values({ address }).filter(i => !!i).join('; ');
    contactsForm.errors = Object.values({ phone, email }).filter(i => !!i).join('; ');
});

// Отправить заказ
events.on('contactsForm:submit', () => {
    const formsData = orderData.formsData;
    const order = {
        payment: formsData.payment,
        address: formsData.address,
        email: formsData.email,
        phone: formsData.phone,
        items: cartData.items.map((item) => { return item.id }),
        total: cartData.getSumm()
    };

    api.postOrder(order)
        .then(function (data: IOrderResult) {
            cartData.clearCart();
            orderData.clearFormsData();
            events.emit('order:success', data);
        })
        .catch(error => console.log(error));
});

// Очистить формы заказа
events.on('formData:clear', () => {
    orderForm.togglePaymentButton('online');
    orderForm.clearForm();
    contactsForm.clearForm();
});

// Открыть модалку с результатом заказа
events.on('order:success', (data: IOrderResult) => {
    success.description = data.total;
    modalContainer.content = success.render();
    modalContainer.render();
})

// Заблокировать скрол страницы при открытии модалки
events.on('modal:open', () => {
    page.locked = true;
});

// Раблокировать скролл страницы при открытии модалки
events.on('modal:close', () => {
    page.locked = false;
});