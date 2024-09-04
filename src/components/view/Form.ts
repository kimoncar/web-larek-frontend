import { IEvents } from "../base/events";
import { Component } from "./Component";

export interface IForm {
    valid: boolean;
    errors: string[];
}

export class Form<T> extends Component<IForm> {
    protected _buttonSubmit: HTMLButtonElement;
    protected _errors: HTMLElement;
    protected events: IEvents;

    constructor(protected container: HTMLFormElement, events: IEvents) {
        super(container);

        this._buttonSubmit = this.container.querySelector('button[type=submit]');
        this._errors = this.container.querySelector('.form__errors');

        this.container.addEventListener('input', (evt: Event) => {
            const target = evt.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value, this.container.name);
        });

        this.container.addEventListener('submit', (evt: Event) => {
            evt.preventDefault();
            this.events.emit(`${this.container.name}Form:submit`);
        });
    }

    onInputChange(field: keyof T, value: string, formName: string) {
        this.events.emit(`${formName}Form:change`, {
            field,
            value
        });
    }

    set valid(value: boolean) {
        this._buttonSubmit.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }
}