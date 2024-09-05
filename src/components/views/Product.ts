import { IActions, IProduct } from "../../types";
import { IEvents } from "../base/events";
import { Component } from "./common/Component";

export class Product extends Component<IProduct> {
    protected events: IEvents;
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _price: HTMLElement;
    protected _category?: HTMLElement;
    protected _description?: HTMLElement;
    protected button?: HTMLButtonElement;
    protected _index?: HTMLElement;
    protected actions?: IActions;

    protected classesCategory = <Record<string, string>>{
        "дополнительное": "card__category_additional",
        "другое": "card__category_other",
        "кнопка": "card__category_button",
        "софт-скил": "card__category_soft",
        "хард-скил": "card__category_hard"        
      }

    constructor(container: HTMLElement, events: IEvents, actions?: IActions) {
        super(container);
        this.events = events;

        this._title = this.container.querySelector('.card__title');
        this._image = this.container.querySelector('.card__image');
        this._price = this.container.querySelector('.card__price');
        this._category = this.container.querySelector('.card__category');
        this._description = this.container.querySelector('.card__text');
        this.button = this.container.querySelector('.card__button');
        this._index = this.container.querySelector('.basket__item-index');

        if (actions.onClick) {
            if (this.button) {
                this.button.addEventListener('click', actions.onClick);
            } else {
                this.container.addEventListener('click', actions.onClick);
            }
        }
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set image(src: string) {
        if (this._image) {
            this.setImage(this._image, src);
        }
    }

    set price(value: number | null) {
        this.setText(this._price, value ? `${value.toString()} синапсов` : 'Бесценно');
        this.disabledButton(value);
    }

    disabledButton(value: number | null): void {
        if (!value && this.button) {
            this.button.disabled = true;
        }
    }

    set category(value: string) {
        if (this._category) {
            this.setText(this._category, value);
            this._category.classList.add(this.classesCategory[value]);
        }
    }

    set description(value: string) {
        if (this._description) {
            this.setText(this._description, value);
        }
    }

    set index(value: string) {
        this.setText(this._index, value);
    }

    setButtonText(value: string) {
        if (this.button) {
            this.setText(this.button, value);
        }
    }
}