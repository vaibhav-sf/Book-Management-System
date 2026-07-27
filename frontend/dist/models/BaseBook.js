"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseBook = void 0;
class BaseBook {
    constructor(title, author, isbn, publicationDate, genre, source, price = (Math.floor(Math.random() * 10) + 1) * 100) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.publicationDate = publicationDate;
        this.genre = genre;
        this.source = source;
        this.price = price;
    }
    getBookAge() {
        const age = new Date().getFullYear() - new Date(this.publicationDate).getFullYear();
        return Math.max(0, age);
    }
    getCategory() {
        return this.source;
    }
}
exports.BaseBook = BaseBook;
