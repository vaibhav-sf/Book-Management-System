import { IBook } from "../interfaces/IBook.js";
import { PrintedBook } from "../models/PrintedBook.js";
import { EBook } from "../models/EBook.js";

export class BookFactory {

    static createManualBook(
        title: string,
        author: string,
        isbn: string,
        publicationDate: string,
        genre: string,
        price?: number
    ): IBook {

        return new PrintedBook(
            title,
            author,
            isbn,
            publicationDate,
            genre,
            price
        );

    }

    static createApiBook(
        title: string,
        author: string,
        isbn: string,
        publicationDate: string,
        genre: string,
        price?: number
    ): IBook {

        return new EBook(
            title,
            author,
            isbn,
            publicationDate,
            genre,
            price
        );

    }

}