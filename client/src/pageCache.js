const PAGE_SIZE = 20;

export class PageCache {
    #pages = new Map();

    #key(params) {
        return JSON.stringify([
            params.startId ?? null,
            params.afterId ?? null,
            params.beforeId ?? null,
            params.limit ?? PAGE_SIZE,
        ]);
    }

    get(params) {
        return this.#pages.get(this.#key(params));
    }

    save(params, page, previousPage, direction) {
        this.#pages.set(this.#key(params), page);
        if (page.firstId === null) return;

        this.#pages.set(this.#key({ startId: page.firstId }), page);
        if (!page.hasPrevious) this.#pages.set(this.#key({}), page);

        if (direction === 'next' && previousPage.firstId != null &&
            (previousPage.items.length === PAGE_SIZE || !previousPage.hasPrevious)) {
            this.#pages.set(this.#key({ beforeId: page.firstId }), previousPage);
        }
        if (direction === 'previous' && previousPage.firstId != null &&
            (previousPage.items.length === PAGE_SIZE || !previousPage.hasNext)) {
            this.#pages.set(this.#key({ afterId: page.lastId }), previousPage);
        }
    }

    clear() {
        this.#pages.clear();
    }
}
