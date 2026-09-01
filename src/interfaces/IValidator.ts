export interface IValidator {
    validate(title: string, author: string, isbn: string, publicationDate: string, genre: string): Record<string, string>;
}