export interface IBook {
  title: string;
  author: string;
  isbn: string;
  publicationDate: string;
  genre: string;
  source: string;
  price: number;
  getBookAge(): number;
  getSource(): string;
  getDiscountPrice(): number;
}