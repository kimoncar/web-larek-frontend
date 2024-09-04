import { TFormContacts } from "../../types";
import { IEvents } from "../base/events";
import { Form } from "./common/Form";

export class ContactsForm extends Form<TFormContacts> {
    protected events: IEvents;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.events = events;
    }
}