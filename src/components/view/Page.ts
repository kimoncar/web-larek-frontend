import { Component } from "./Component";

interface IPage {
    catalog: HTMLElement[];
}

export class Page extends Component<IPage> {
    protected _catalog: HTMLElement;
    protected container: HTMLElement

    constructor(container: HTMLElement) {
        super(container);
        this.container = container;
    }

    set catalog(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }
}