export class RequestQueue {
    #tasks = new Map();

    constructor(interval) {
        setInterval(() => this.#flush(), interval);
    }

    push(key, action) {
        const existing = key === null ? undefined : this.#tasks.get(key);
        if (existing) return existing.promise;

        let resolve;
        let reject;
        const promise = new Promise((resolvePromise, rejectPromise) => {
            resolve = resolvePromise;
            reject = rejectPromise;
        });

        this.#tasks.set(key ?? Symbol(), { action, promise, resolve, reject });
        return promise;
    }

    pushLatest(key, action) {
        const existing = key === null ? undefined : this.#tasks.get(key);
        if (existing) {
            this.#tasks.delete(key);
            existing.reject(Object.assign(new Error('Request replaced!'), {
                status: 409,
                code: 'REQUEST_REPLACED',
            }));
        }
        return this.push(key, action);
    }

    #flush() {
        const tasks = Array.from(this.#tasks.values());
        this.#tasks.clear();

        for (const task of tasks) {
            try {
                task.resolve(task.action());
            } catch (error) {
                task.reject(error);
            }
        }
    }
}
