import { IBook } from "../interfaces/IBook.js";
import { LogExecution } from "../decorators/Logger.js";
import { DashboardRenderer } from "../utils/DashboardRenderer.js";
import { IBookRenderer } from "../interfaces/IBookRenderer.js";
import { IFilterService } from "../interfaces/IFilterService.js";
import { IValidator } from "../interfaces/IValidator.js";
import { IRepository } from "../interfaces/IRepository.js";
import { ISearchFilter } from "../interfaces/ISearchFilter.js";

export class BookManager {
  private displayedBooks: IBook[] = [];
  private editIndex: number = -1;
  constructor(
    private repository: IRepository<IBook>,
    private renderer: IBookRenderer,
    private filterService: IFilterService,
    private validator: IValidator
  ) { }

  updateDashboard(): void {
    DashboardRenderer.update(this.repository.getAll());
  }
  private refresh(filter?: ISearchFilter): void {
    this.updateDashboard();
    this.applyFilters(filter ?? { keyword: "", genre: "", sort: "" });
  }

  deleteBook(index: number, filter: ISearchFilter): void {
    if (confirm("Delete this book?")) {
      const book = this.repository.get(index);
      if (book) this.repository.remove(book);
      this.clearEditIndex();
      this.refresh(filter);
    }
  }

  editBook(index: number): void {
    const book = this.repository.get(index);
    if (!book) return;
    (document.getElementById("title") as HTMLInputElement).value = book.title;
    (document.getElementById("author") as HTMLInputElement).value = book.author;
    (document.getElementById("isbn") as HTMLInputElement).value = book.isbn;
    (document.getElementById("publicationDate") as HTMLInputElement).value = book.publicationDate;
    (document.getElementById("genre") as HTMLSelectElement).value = book.genre;

    this.setEditIndex(index);
    const submitBtn = document.querySelector("#bookForm button[type='submit']") as HTMLButtonElement;
    if (submitBtn) submitBtn.textContent = "Update Book";
  }
  validateBook(
    title: string,
    author: string,
    isbn: string,
    publicationDate: string,
    genre: string
  ): Record<string, string> {
    return this.validator.validate(title, author, isbn, publicationDate, genre);
  }

  @LogExecution
  applyFilters(filter: ISearchFilter = { keyword: "", genre: "", sort: "" }): void {
    this.displayedBooks = this.filterService.filterBooks(
      this.repository.getAll(),
      filter.keyword, filter.genre, filter.sort
    );
    this.renderer.render(
      this.displayedBooks,
      (book) => {
        const index = this.repository.getAll().indexOf(book);
        if (index !== -1) {
          this.deleteBook(index, filter);
        }
      },
      (book) => {
        const index = this.repository.getAll().indexOf(book);
        if (index !== -1) {
          this.editBook(index);
        }
      }
    );
  }

  addBook(book: IBook, filter?: ISearchFilter): boolean {
    if (this.bookExists(book.isbn)) {
      return false;
    }
    this.repository.add(book);
    this.refresh(filter);
    return true;
  }

  updateBook(index: number, updatedBook: IBook, filter?: ISearchFilter): void {
    const oldBook = this.repository.get(index);
    if (oldBook) this.repository.update(oldBook, updatedBook);
    this.refresh(filter);
  }

  findBook(title: string, author: string, ignoreIndex: number = -1): boolean {
    return this.repository.getAll().some((book, index) =>
      index !== ignoreIndex &&
      book.title.toLowerCase() === title.toLowerCase() &&
      book.author.toLowerCase() === author.toLowerCase()
    );
  }

  bookExists(isbn: string, ignoreIndex: number = -1): boolean {
    return this.repository.getAll().some(
      (book, index) => index !== ignoreIndex && book.isbn === isbn
    );
  }

  bookExistsByTitle(title: string): boolean {
    return this.repository.getAll().some(
      (book) => book.title.toLowerCase() === title.toLowerCase()
    );
  }

  isEditing(): boolean {
    return this.editIndex !== -1;
  }

  getEditIndex(): number {
    return this.editIndex;
  }

  setEditIndex(index: number): void {
    this.editIndex = index;
  }

  clearEditIndex(): void {
    this.editIndex = -1;
  }

  getBook(index: number): IBook | undefined {
    return this.repository.get(index);
  }
}