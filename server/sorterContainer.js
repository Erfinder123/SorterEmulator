import { Container } from "./container.js";

export class SorterContainer extends Container {

    #maxPosition = 0
    #step = 50
    #sortedElements = []

    getElements(offset = 0, limit = 20) {
        this.#sortedElements = Array.from(this.getAllElements().values()).filter(element => element.position !== null)
            .sort((a, b) => a.position - b.position)
        return this.#sortedElements.slice(offset, offset + limit);
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
        element.position = this.#maxPosition;
        this.#maxPosition += this.#step;
        return element;
    }

    sortElements(currentId, lastOneId) {
        const elements = this.getAllElements();

        const currentElement = elements.get(currentId);
        const replacementElement = elements.get(lastOneId);

        if (!currentElement || !replacementElement) return false;

        const index = this.#sortedElements.findIndex(i => i.id === lastOneId);
        const previousElement = index > 0 ? this.#sortedElements[index - 1] : null;

        currentElement.position =  previousElement
            ? previousElement.position + (replacementElement.position - previousElement.position) / 2
            : replacementElement.position - this.#step;
        if (currentElement.position === replacementElement.position || (previousElement !== null && currentElement.position === previousElement.position))
        {
            let position = 0;

            const currentIndex = this.#sortedElements.indexOf(currentElement);
            this.#sortedElements.splice(currentIndex, 1);
            const targetIndex = this.#sortedElements.indexOf(replacementElement);
            this.#sortedElements.splice(targetIndex, 0, currentElement);

            for (const element of this.#sortedElements) {
                element.position = position;
                position += this.#step;
            }
            this.#maxPosition = this.#sortedElements.length * this.#step;
        }
        return true;
    }
}