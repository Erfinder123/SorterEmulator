import { Container } from "./container.js";

export class SorterContainer extends Container {

    maxPosition = 0

    getElements(offset = 0, limit = 20) {
        return this.getAllElements().filter(element => element.position !== null)
            .sort((a, b) => a.position - b.position)
            .slice(offset, offset + limit);
    }

    moveElement(id)
    {
        const element = super.moveElement(id);
        if (element) {
            element.position = null
        }
        return element;
    }

    addElement(element) {
        element.position = this.maxPosition++;
        return element;
    }
}