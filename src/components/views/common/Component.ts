export abstract class Component<T> {
    constructor(protected readonly container: HTMLElement) {}

    setText(element: HTMLElement, value: unknown):void {
        if (element) {
            element.textContent = String(value);
        }
    }

    setImage(element: HTMLImageElement, src: string):void {
        if (element) {
            element.src = src;
        }
    }

    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}