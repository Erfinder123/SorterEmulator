export class Element {
    constructor(id) {
        this.id = id;
    }

    predecessor = null;
    descendant = null;
    sort = false;
}