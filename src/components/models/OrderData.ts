import { TFormContacts, TFormOrder, IOrder, IOrderData, TFormErrors, TFormInputsData } from "../../types";
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

    setFormOrder(field: keyof TFormInputsData, value: string): void {
        this.order[field] = value;
        if (this.checkValidationFormOrder()) {
            this.events.emit('formError:done', this.order);
        }
    }

    setFormContacts(field: keyof TFormInputsData, value: string): void {
        this.order[field] = value;
        if (this.checkValidationFormContacts()) {
            this.events.emit('formError:done', this.order);
        }
    }

    checkValidationFormOrder(): boolean {
        this.formErrors = {};
        if (!this.order.address) {
            this.formErrors.address = "Укажите ваш адрес";
        }
        this.events.emit('formError:change', this.formErrors);
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
        this.events.emit('formError:change', this.formErrors);
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