import { IEvents } from "../base/events";
import { Component } from "./Component";

export interface IModal {
    container: HTMLElement;
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected events: IEvents;
    protected closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, event: IEvents) {
        super(container);
        this.events = event;
        
        this.closeButton = this.container.querySelector('.modal__close');
        this._content = this.container.querySelector('.modal__content');

        this.closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('mousedown', (evt) => {
            if (evt.target === evt.currentTarget) {
                this.close();
            }
        });
    }

    open(): void {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.content = null;
        this.events.emit('modal:close');
    }

    set content(element: HTMLElement) {
        this._content.replaceChildren(element);
    }

    render(): HTMLElement {
        this.open();
        return this.container;
      }
}