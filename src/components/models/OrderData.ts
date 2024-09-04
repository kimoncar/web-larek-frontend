import { TFormContacts, TFormOrder, IOrder, IOrderData, TFormErrors, TFormInputsData, IFormsData } from "../../types";
import { IEvents } from "../base/events";

export class OrderData implements IOrderData {
    protected events: IEvents;
    protected _formsData: IFormsData = {
        payment: 'online',
        address: '',
        email: '',
        phone: '',
    };
    protected formErrors: TFormErrors;

    constructor(events: IEvents) {
        this.events = events;
    }

    setFormOrder(field: keyof IFormsData, value: string): void {
        this._formsData[field] = value;
        if (this.checkValidationFormOrder()) {
            this.events.emit('formError:done', this._formsData);
        }
    }

    setFormContacts(field: keyof IFormsData, value: string): void {
        this._formsData[field] = value;
        if (this.checkValidationFormContacts()) {
            this.events.emit('formError:done', this._formsData);
        }
    }

    checkValidationFormOrder(): boolean {
        this.formErrors = {};
        if (!this._formsData.address) {
            this.formErrors.address = "Укажите ваш адрес";
        }
        this.events.emit('formError:change', this.formErrors);
        return Object.keys(this.formErrors).length === 0;
    }

    checkValidationFormContacts(): boolean {
        this.formErrors = {};
        if (!this._formsData.email) {
            this.formErrors.email = "Укажите ваш email";
        }
        if (!this._formsData.phone) {
            this.formErrors.email = "Укажите ваш телефон";
        }
        this.events.emit('formError:change', this.formErrors);
        return Object.keys(this.formErrors).length === 0;
    }

    clearFormsData(): void {
        this._formsData = {
            payment: 'online',
            address: '',
            email: '',
            phone: ''
        }
    }

    get formsData() {
        return this._formsData;
    }
    
}