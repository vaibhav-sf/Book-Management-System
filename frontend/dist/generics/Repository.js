"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = void 0;
class Repository {
    constructor() {
        this.items = [];
    }
    add(item) {
        this.items.push(item);
    }
    remove(index) {
        this.items.splice(index, 1);
    }
    update(index, item) {
        this.items[index] = item;
    }
    getAll() {
        return [...this.items];
    }
    get(index) {
        return this.items[index];
    }
    count() {
        return this.items.length;
    }
}
exports.Repository = Repository;
