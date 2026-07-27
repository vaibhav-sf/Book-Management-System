import { BaseBook } from "./BaseBook.js";

export class PrintedBook extends BaseBook {
  constructor(title: string, author: string, isbn: string, publicationDate: string, genre: string, price: number | null = null) {
    super(title, author, isbn, publicationDate, genre, "Manual Entry", price ?? undefined);
  }

  getDiscountPrice(): number {
    return Math.round(this.price * 0.9);
  }
}