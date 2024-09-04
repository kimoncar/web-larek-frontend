import { TFormOrder } from "../../types";
import { IEvents } from "../base/events";
import { Form } from "./Form";
import { IActions } from "./Product";

export class OrderForm extends Form<TFormOrder> {
    protected _buttonPaymentOnline: HTMLButtonElement;
    protected _buttonPaymentCash: HTMLButtonElement;
    protected events: IEvents;
    protected actions?: IActions;

    constructor(container: HTMLFormElement, events: IEvents, actions?: IActions) {
        super(container, events);
        this.events = events;

        this._buttonPaymentOnline = this.container.querySelector('button[name=online]');
        this._buttonPaymentCash = this.container.querySelector('button[name=cash]');       

        if(actions?.onClick) {
            this._buttonPaymentOnline.addEventListener('click', actions.onClick);
            this._buttonPaymentCash.addEventListener('click', actions.onClick);
        }

        this._buttonPaymentOnline.classList.add('button_alt-active');
    }

    togglePaymentButton(name:string):void {
        this._buttonPaymentCash.classList.toggle('button_alt-active', this._buttonPaymentCash.name === name);
        this._buttonPaymentOnline.classList.toggle('button_alt-active', this._buttonPaymentOnline.name === name);
    }
}