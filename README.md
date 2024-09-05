# Проектная работа "Веб-ларек"

#### Стек: HTML, SCSS, TS, Webpack

#### Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом
- src/components/models — папка с классами моделей
- src/components/views — папка с классами отображения

#### Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении
Интерфейс для типизации карточки товара

```
export interface IProduct {
    _id: string;
    title: string;
    category: string;
    description?: string;
    image: string;
    price: number | null;
}
```

Интерфейс для типизации форм с данными пользователя

```
export interface IForm {
    payment: string;
    address: string;
    email: string;
    phone: string;
}
```

Интерфейс для типизации заказа

```
export interface IOrder extends IForm {
    total: number;
    items: string[];
}
```

Данные, вводимые пользователем в формах модальных окон

```
export type IFormInputsData = Pick<IOrder, 'address' | 'email' | 'phone'>;
```

Интерфейс для ответа сервера

```
export interface IOrderResult {
    id: string;
    total: number;
}
```

Интерфейс для типизации списка товаров

```
export interface IProductsData {
    items: IProduct[];
    preview: string;
    getProduct(id: string): IProduct;
}
```

Интерфейс для типизации класса заказа

```
export interface IOrderData {
    setOrder(orderData: IOrder): void;
    checkValidation(data: Record<keyof IFormInputsData, string>): boolean;
}
```

Интерфейс для типизации класса корзины

```
export interface ICartData {
    items: Map<string, number>;
    addProduct(id: string): void;
    removeProduct(id: string): void;
    getTotal(): number;
    getSumm(): number;
}
```

## Архитектура приложения
Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код
#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие   

### Слой данных
#### Класс ProductsData
Класс реализует интерфейс IProductsData и отвечает за хранение и логику работы с данными карточек товаров.\
Конструктор класса принимает инстант брокера событий.\
В полях класса хранятся следующие данные:
- `_items: IProduct[]` - массив объектов карточек с товарами
- `_preview: string` - id товара, выбранного для полного просмотра
- `event: IEvents` - экземпляр класса EventEmmiter для инициализации событий при изменении данных

Также класс предоставляет следующие методы для работы с данными:
- `getProduct(id: string): IProduct` - получить товар по id
- сеттер и геттер для сохранения и получения данных из полей класса

### Класс OrderData
Класс реализует интерфейс IOrderData и отвечает за хранение и логику работы с данными заказа.\
Конструктор класса принимает инстант брокера событий.\
В полях класса хранятся следующие данные:
- `event: IEvents` - экземпляр класса EventEmmiter для инициализации событий при изменении данных

Также класс предоставляет следующие методы для работы с данными:
- `setOrder(orderData: IOrder): void` - сохраняет данные заказа
- `checkOrderValidation(data: Record<keyof IFormInputsData, string>): boolean` - проверяет введенные данные

### Класс CartData
Класс реализует интерфейс ICartData и отвечает за хранение и логику работы с товарами корзины.\
Конструктор класса принимает инстант брокера событий.\
В полях класса хранятся следующие данные:
- `items: Map<string, number>` - массив товаров
- `event: IEvents` - экземпляр класса EventEmmiter для инициализации событий при изменении данных

Также класс предоставляет следующие методы для работы с данными:
- `addProduct(id: string): void` - добавляет товар в корзину
- `removeProduct(id: string): void` - удаляет товар из корзины
- `getTotal(): number` - возвращает количество товаров в корзине
- `getSumm(): number` - возвращает сумму товаров корзины

### Слой представления
Все классы представления отвечают за отображение передаваемых в них данных в контейнере (DOM-элемент).

#### Класс Component
Абстрактный класс предназначен для отображения и предоставляет методы для управления DOM-элементами. Является базовым классом отображения.\
Конструктор принимает контейнер элемента:

```
constructor(container: HTMLElement)
```

Также класс предоставляет следующие методы:
- `setText(element: HTMLElement, value: string): void` - устанавливает текстовое содержимое элемента;
- `render(): HTMLElement` - возвращает обновленный корневой DOM-элемент компонента. Принимает необязательный параметр `data`, который можно использовать для обновления свойств компонента.

#### Класс Page
Расширяет класс Component.\
Отвечает за отображение блока с карточками товаров и кнопки корзины на главной странице и предоставляет возможность управления содержимым.\
Конструктор принимает контейнер, в котором размещаются карточки, и объект событий:

```
constructor(container: HTMLElement, event: IEvents)
```

Также в конструкторе происходит поиск элемента каталога по его селектору.\

В полях класса хранятся следующие данные:
- `_container: HTMLElement` - элемент контейнера для карточек;
- `event: IEvents` - экземпляр класса EventEmmiter для инициализации событий при изменении данных.

Класс предоставляет методы для управления отображением:
- `set container(items: IProduct[])` - для заполнения карточками товаров;

#### Класс Modal
Расширяет класс Component.\
Реализует отображения модального окна и предоставляет возможность управления содержимым.\
Класс в конструкторе устанавливает слушатели на кнопку и клик в оверлей для закрытия модального окна.\
Конструктор принимает контейнер модального окна и объект событий:

```
constructor(container: HTMLElement, event: IEvents)
```

В полях класса хранятся следующие данные:
- `container: HTMLElement` - контейнер с разметкой модального окна;
- `_content: HTMLElement` - контент модального окна;
- `event: IEvents` - экземпляр класса EventEmmiter для инициализации событий при изменении данных.

Также класс предоставляет методы для управления отображением модального окна:
- `open(): void` - для открытия окна;
- `close(): void` - для закрытия окна;
- `set content(content: HTMLElement)` - для сохранения отображаемого контента;

#### Класс Product
Расширяет класс Component.\
Предназначен для отображения элемента с информации о товаре и выполнения действий при клике.\
Конструктор принимает шаблон карточки, объект событий и обработчик клика:

```
constructor(content: HTMLElement, event: IEvents, handler?: Function)
```

В полях класса хранятся следующие данные:
- `container: HTMLElement` - контейнер с разметкой элемента товара;
- `title: HTMLElement` - название товара;
- `image: HTMLImageElement` - изображение товара;
- `price: HTMLElement` - стоимость товара;
- `category: HTMLElement` - категория товара;
- `description?: HTMLElement` - описание товара;
- `button?: HTMLButtonElement` - кнопка добавления в корзину;
- `event: IEvents` - экземпляр класса EventEmmiter для инициализации событий при изменении данных.

Также класс предоставляет методы для управления отображением карточки товара:
- `lockSale(product: IProduct): string` - устанавливает атрибут disable и меняет надпись кнопке добавления в корзину; 

#### Класс Cart
Расширяет класс Component.\
Предназначен для отображения корзины со списком товаров, общей суммы и управления состоянием кнопки оформления заказа.\
Класс в конструкторе устанавливает слушатели на кнопки оформления и открытию корзины.\
Конструктор принимает шаблон корзины и объект событий:

```
constructor(container: HTMLElement, event: IEvents)
```

В полях класса хранятся следующие данные:
- `container: HTMLElement` - шаблон корзины;
- `cartList: HTMLElement` - контейнер списка товаров;
- `_cartItems: HTMLElement[]` - массив элементов товаров;
- `_totalSumm: HTMLElement` - общая сумма товаров;
- `button: HTMLButtonElement` - кнопка оформления заказа;
- `headerCartButton: HTMLButtonElement` - элемент кнопки корзины в шапке;
- `_headerCartCounter: HTMLElement` - значок с количеством товара в корзине в шапке;
- `event: IEvents` - экземпляр класса EventEmmiter для инициализации событий при изменении данных.

Также класс предоставляет методы для управления отображением корзины:
- `set cartItems(items: HTMLElement[]): void` - устанавливает элементы товаров, добавленных в корзину, в контейнер списка товаров. При отсутствии товаров блокирует кнопку оформления.
- `set totalSumm(total: number): void` - устанавливает сумму товаров в корзине;
- `set cartCounter(value: number)` - устанавливает значения счетчика товаров в корзине в шапке;

#### Класс Order
Расширяет класс Component.\
Предназначен для отображения формы оформления заказа: выбор способа оплаты и ввод адреса.\
Класс в конструкторе устанавливает слушатель на кнопки выбора метода оплаты, сабмит формы и ввод адреса.\
Конструктор принимает шаблон формы и объект событий:

```
constructor(container: HTMLElement, event: IEvents)
```

В полях класса хранятся следующие данные:
- `container: HTMLFormElement` - шаблон формы оформления заказа;
- `paymentOnline: HTMLButtonElement` - элемент кнопки оплаты онлайн;
- `paymentCash: HTMLButtonElement` - элемент кнопки оплаты при получении;
- `buttonSubmit: HTMLButtonElement` - кнопка сабмита формы;
- `event: IEvents` - экземпляр класса EventEmmiter для инициализации событий при изменении данных.

Также класс предоставляет следующие методы:
- `set selectedPayment(payment: string): void` - устанавливает стилизацию выбранному методу оплаты;
- `set valid(value: boolean): void` - блокирует/активирует кнопку сабмита формы;

#### Класс Contacts
Расширяет класс Component.\
Предназначен для отображения формы ввода контактов: ввод email и телефона.\
Класс в конструкторе устанавливает слушатель на кнопку сабмита формы, поля ввода email и телефона.\
Конструктор принимает шаблон формы и объект событий:

```
constructor(container: HTMLElement, event: IEvents)
```

В полях класса хранятся следующие данные:
- `container: HTMLFormElement` - шаблон формы оформления контактов;
- `inputs: HTMLInputElement[]` - массив полей ввода данных;
- `buttonSubmit: HTMLButtonElement` - кнопка сабмита формы;
- `event: IEvents` - экземпляр класса EventEmmiter для инициализации событий при изменении данных.

Также класс предоставляет следующие методы:
- `set valid(value: boolean): void` - блокирует/активирует кнопку перехода к следующей форме;

#### Класс OrderResult
Расширяет класс Component.\
Предназначен для отображения ответа сервера.\
Класс в конструкторе устанавливает слушатель на кнопку.\
Конструктор принимает шаблон разметки и объект событий:

```
constructor(container: HTMLElement, event: IEvents)
```

В полях класса хранятся следующие данные:
- `container: HTMLElement` - шаблон формы оформления контактов;
- `description: HTMLInputElement` - элемент для отображения результата оформленного заказа;
- `button: HTMLButtonElement` - кнопка закрытия окна;
- `event: IEvents` - экземпляр класса EventEmmiter для инициализации событий при изменении данных.

### Слой коммуникации
#### Класс AppApi
Принимает в конструкторе экземпляр класса Api и предоставляет методы, реализующие взаимодействие с бэкендом сервера.

### Взаимодействие компонентов
#### Презентер
Код, выполняющий роль презентера, находится в файле `index.ts`. Он описывает взаимодействие компонентов представления и данных.\
Взаимодействие осуществляется за счет событий, генерируемых брокером и обработчиком этих событий, описанных в файле `index.ts`.\
В файле `index.ts` сначала создаются экземляры необходимых классов, а затем настраивается обработка событий. 

#### Список событий, которые могут генерироваться в системе
##### События изменения данных (генерируются моделями данных)
- `products:changed` - изменение массива карточек с товарами;
- `product:preview` - изменение данных при открытии карточки товара;
- `cart:changed` - изменение данных корзины;
- `cartCounter:changed` - изменение счетчика корзины;
- `cartItems:changed` - изменение списка товаров корзины;
- `formAddress:changed` - изменение поля с адресом;
- `formError:address` - ошибка валидации поля с адресом;

##### События, возникающие при взаимодествии пользователя с интерфейсом (генерируются классами представления)
- `modal:open` - открытие модального окна;
- `modal:close` - закрытие модального окна;
- `cart:open` - открытие корзины;
- `cartItem:add` - добавление товара в корзину;
- `cartItem:remove` - удаление товара из корзины;
- `order:payment` - выбор способа оплаты;
- `order:changedAddress` - изменение поля с адресом;
- `contacts:input` - изменение поля с данными;
