import { IBook } from "./IBook.js";

export interface IFilterService {
    filterBooks(books: IBook[],
        keyword: string,
        genre: string,
        sort: string
    ): IBook[];
}