import { IFormsData } from "../../types";
import { IEvents } from "../base/events";
import { Form } from "./common/Form";

export class ContactsForm extends Form<IFormsData> {
    protected events: IEvents;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.events = events;
    }
}