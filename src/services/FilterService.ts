import { IBook } from "../interfaces/IBook.js";

export class FilterService {
  filterBooks(books: IBook[], keyword: string, genre: string, sort: string): IBook[] {
    let filtered = [...books];
    if (keyword !== "") {
      filtered = filtered.filter((book) =>
        book.title.toLowerCase().includes(keyword),
      );
    }
    if (genre !== "") {
      filtered = filtered.filter((book) => book.genre === genre);
    }
    switch (sort) {
      case "az":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "za":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.publicationDate).getTime() - new Date(b.publicationDate).getTime());
        break;
    }
    return filtered;
  }
}