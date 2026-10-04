export class Container{

    static #elements = new Map()

    addElement(element)
    {
        if(!Container.#elements.has(element.id)) {
            Container.#elements.set(element.id, element)
            return true
        }
        return false
    }

    getElements(offset = 0, limit = 20) {
        return this.getAllElements().filter(element => element.position === null)
            .sort((a, b) => a.id - b.id)
            .slice(offset, offset + limit);
    }

    getAllElements() {
        return Array.from(Container.#elements.values());
    }

    moveElement(id) {
        if(Container.#elements.has(id)) {
            return Container.#elements.get(id)
        }
        return null
    }
}