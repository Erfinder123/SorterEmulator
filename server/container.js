const PAGE_SIZE = 20;

export class Container {
    static #elements = new Map();
    #startId = null;
    #endId = null;

    constructor(sort = false) {
        this.sort = sort;
    }

    addElement(element) {
        if (Container.#elements.has(element.id)) return false;
        Container.#elements.set(element.id, element);
        this.pushElement(element);
        return true;
    }

    pushElement(element) {
        if (element.predecessor || element.descendant || this.#endId === element.id) return element;
        const end = this.#endId === null ? null : Container.#elements.get(this.#endId);
        if (end) end.descendant = element;
        element.predecessor = end;
        element.descendant = null;
        element.sort = this.sort;
        if (this.#startId === null) this.#startId = element.id;
        this.#endId = element.id;
        return element;
    }

    detachElement(id) {
        const element = Container.#elements.get(id);
        if (!element || element.sort !== this.sort) return null;
        const previous = element.predecessor;
        const next = element.descendant;
        if (previous) previous.descendant = next;
        if (next) next.predecessor = previous;
        if (this.#startId === id) this.#startId = next?.id ?? null;
        if (this.#endId === id) this.#endId = previous?.id ?? null;
        element.predecessor = null;
        element.descendant = null;
        return element;
    }

    insertBefore(element, target) {
        const previous = target.predecessor;
        element.predecessor = previous;
        element.descendant = target;
        element.sort = this.sort;
        if (previous) previous.descendant = element;
        else this.#startId = element.id;
        target.predecessor = element;
    }

    getElements({ startId, afterId, beforeId, filter = '', limit = PAGE_SIZE } = {}) {
        const cursors = [startId, afterId, beforeId].filter(id => id != null);
        if (typeof filter !== 'string' || cursors.length > 1 || !Number.isInteger(limit) || limit < 1 || limit > PAGE_SIZE) {
            throw Object.assign(new Error('Invalid page parameters!'), { status: 400 });
        }
        let element;
        if (cursors.length) {
            element = Container.#elements.get(cursors[0]);
            if (!element || element.sort !== this.sort) {
                throw Object.assign(new Error('Page cursor no longer exists in this container!'), { status: 409 });
            }
            if (afterId != null) element = element.descendant;
            if (beforeId != null) element = element.predecessor;
        } else element = Container.#elements.get(this.#startId);

        const items = [];
        while (element && items.length < limit) {
            if (String(element.id).includes(filter)) items.push(element);
            element = beforeId != null ? element.predecessor : element.descendant;
        }
        if (beforeId != null) items.reverse();
        const first = items[0];
        const last = items[items.length - 1];
        function hasMatch(element, link) {
            while (element) {
                if (String(element.id).includes(filter)) return true;
                element = element[link];
            }
            return false;
        }
        return {
            items: items.map(item => ({ id: item.id, sort: item.sort })),
            firstId: first?.id ?? null,
            lastId: last?.id ?? null,
            hasPrevious: hasMatch(first?.predecessor, 'predecessor'),
            hasNext: hasMatch(last?.descendant, 'descendant'),
        };
    }

    getAllElements() {
        return Container.#elements;
    }
}
