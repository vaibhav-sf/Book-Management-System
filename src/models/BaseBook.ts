import { IBook } from "../interfaces/IBook.js";

export abstract class BaseBook implements IBook {
  constructor(
    public title: string,
    public author: string,
    public isbn: string,
    public publicationDate: string,
    public genre: string,
    public source: string,
    public price: number = (Math.floor(Math.random() * 10) + 1) * 100
  ) { }

  getBookAge(): number {
    const age = new Date().getFullYear() - new Date(this.publicationDate).getFullYear();
    return Math.max(0, age);
  }

  getSource(): string {
    return this.source;
  }

  abstract getDiscountPrice(): number;
}