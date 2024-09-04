import { IOrderResult } from "../../types";
import { Component } from "./common/Component";
import { IActions } from "./Product";

export class Success extends Component<IOrderResult> {
    protected _description: HTMLElement;
    protected button: HTMLButtonElement;
    protected actions: IActions;

    constructor(container: HTMLElement, actions: IActions) {
        super(container);
        this._description = this.container.querySelector('.order-success__description');
        this.button = this.container.querySelector('.order-success__close');

        this.button.addEventListener('click', actions.onClick);
    }

    set description(value: number) {
        this.setText(this._description, `Списано ${value} синапсов`);
    }
}