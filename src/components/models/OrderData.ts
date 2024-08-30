import { TFormContacts, TFormOrder, IOrder, IOrderData, TFormErrors } from "../../types";
import { IEvents } from "../base/events";

export class OrderData implements IOrderData {
    protected events: IEvents;
    protected order: IOrder = {
        payment: 'online',
        address: '',
        email: '',
        phone: '',
        total: 0,
        items: []
    };
    protected formErrors: TFormErrors;

    constructor(events: IEvents) {
        this.events = events;
    }

    setFormOrder(data: Record<keyof TFormOrder, string>): void {
        this.order.payment = data.payment;
        this.order.address = data.address;
        if (this.checkValidationFormOrder()) {
            this.events.emit('formError:done', this.order);
        }
    }

    setFormContacts(data: TFormContacts): void {
        this.order.email = data.email;
        this.order.phone = data.phone;
        if (this.checkValidationFormContacts()) {
            this.events.emit('formError:done', this.order);
        }
    }

    checkValidationFormOrder(): boolean {
        this.formErrors = {};
        if (!this.order.address) {
            this.formErrors.address = "Укажите ваш адрес";
        }
        this.events.emit('formError:changed', this.formErrors);
        return Object.keys(this.formErrors).length === 0;
    }

    checkValidationFormContacts(): boolean {
        this.formErrors = {};
        if (!this.order.email) {
            this.formErrors.email = "Укажите ваш email";
        }
        if (!this.order.phone) {
            this.formErrors.email = "Укажите ваш телефон";
        }
        this.events.emit('formError:changed', this.formErrors);
        return Object.keys(this.formErrors).length === 0;
    }

    clearOrder(): void {
        this.order = {
            payment: 'online',
            address: '',
            email: '',
            phone: '',
            total: 0,
            items: []
        }
    }

    
}