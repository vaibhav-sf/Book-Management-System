import { IBook } from "./IBook.js";

export interface IBookRenderer {
    render(books: IBook[],
        onDelete: (book: IBook) => void,
        onEdit: (book: IBook) => void): void;
}