import { Container } from './container.js';

export class SorterContainer extends Container {
    constructor() {
        super(true);
    }

    sortElements(currentId, lastOneId) {
        const elements = this.getAllElements();
        const current = elements.get(currentId);
        const target = elements.get(lastOneId);
        if (!current?.sort || !target?.sort) return false;
        if (current === target || current.descendant === target) return true;
        this.detachElement(currentId);
        this.insertBefore(current, target);
        return true;
    }
}
