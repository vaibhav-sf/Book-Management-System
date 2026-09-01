import { IValidator } from "../interfaces/IValidator.js";

export class BookValidator implements IValidator {
    validate(
        title: string,
        author: string,
        isbn: string,
        publicationDate: string,
        genre: string
    ): Record<string, string> {
        return BookValidator.validate(title, author, isbn, publicationDate, genre);
    }

    static validate(
        title: string,
        author: string,
        isbn: string,
        publicationDate: string,
        genre: string
    ): Record<string, string> {

        const errors: Record<string, string> = {};

        if (!title.trim()) {
            errors.title = "Title is required";
        }
        if (!author.trim()) {
            errors.author = "Author is required";
        }
        if (!isbn.trim()) {
            errors.isbn = "ISBN is required";
        } else if (!/^\d{10}$/.test(isbn.trim())) {
            errors.isbn = "ISBN must be a number and exactly 10 digits";
        }
        if (!publicationDate) {
            errors.publicationDate = "Publication Date is required";
        } else {
            const age = new Date().getFullYear() - new Date(publicationDate).getFullYear();
            if (age < 0) {
                errors.publicationDate = "Publication Date cannot be in future";
            }
        }
        if (!genre) {
            errors.genre = "Genre is required";
        }
        return errors;
    }
}