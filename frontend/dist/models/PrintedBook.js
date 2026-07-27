"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintedBook = void 0;
const BaseBook_js_1 = require("./BaseBook.js");
class PrintedBook extends BaseBook_js_1.BaseBook {
    constructor(title, author, isbn, publicationDate, genre, price = null) {
        super(title, author, isbn, publicationDate, genre, "Manual Entry", price !== null && price !== void 0 ? price : undefined);
    }
    getDiscountPrice() {
        return Math.round(this.price * 0.9);
    }
}
exports.PrintedBook = PrintedBook;
