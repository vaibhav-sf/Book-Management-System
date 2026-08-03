import { IBook } from "../interfaces/IBook.js";
import { LogExecution } from "../decorators/Logger.js";
import { DashboardRenderer } from "../utils/DashboardRenderer.js";
import { BookRenderer } from "../renderers/BookRenderer.js";
import { FilterService } from "../services/FilterService.js";
import { BookValidator } from "../validators/BookValidator.js";
import { IRepository } from "../interfaces/IRepository.js";

export class BookManager {
  private displayedBooks: IBook[] = [];
  private editIndex: number = -1;
  constructor(
    private repository: IRepository<IBook>,
    private renderer: BookRenderer,
    private filterService: FilterService,
    _validator: BookValidator
  ) { }

  updateDashboard(): void {
    DashboardRenderer.update(this.repository.getAll());
  }
  private refresh(): void {
    this.updateDashboard();
    this.applyFilters();
  }

  deleteBook(index: number): void {
    if (confirm("Delete this book?")) {
      const book = this.repository.get(index);
      if (book) this.repository.remove(book);
      this.clearEditIndex();
      this.refresh();
    }
  }

  editBook(index: number): void {
    const book = this.repository.get(index);
    (document.getElementById("title") as HTMLInputElement).value = book.title;
    (document.getElementById("author") as HTMLInputElement).value = book.author;
    (document.getElementById("isbn") as HTMLInputElement).value = book.isbn;
    (document.getElementById("publicationDate") as HTMLInputElement).value = book.publicationDate;
    (document.getElementById("genre") as HTMLSelectElement).value = book.genre;

    this.setEditIndex(index);
    const submitBtn = document.querySelector("#bookForm button[type='submit']") as HTMLButtonElement;
    if (submitBtn) submitBtn.textContent = "Update Book";
  }

  @LogExecution
  applyFilters(): void {
    const searchInput = document.getElementById("searchBook") as HTMLInputElement;
    const genreFilter = document.getElementById("genreFilter") as HTMLSelectElement;
    const sortBooks = document.getElementById("sortBooks") as HTMLSelectElement;
    const keyword = searchInput?.value.trim() ?? "";
    const genre = genreFilter?.value ?? "";
    const sort = sortBooks?.value ?? "";
    this.displayedBooks = this.filterService.filterBooks(
      this.repository.getAll(),
      keyword, genre, sort);
    this.renderer.render(
      this.displayedBooks,
      (book) => {
        const index = this.repository.getAll().indexOf(book);
        if (index !== -1) {
          this.deleteBook(index);
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

  addBook(book: IBook): boolean {
    if (this.bookExists(book.isbn)) {
      return false;
    }
    this.repository.add(book);
    this.refresh();
    return true;
  }

  updateBook(index: number, updatedBook: IBook): void {
    const oldBook = this.repository.get(index);
    if (oldBook) this.repository.update(oldBook, updatedBook);
    this.refresh();
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

  getBook(index: number): IBook {
    return this.repository.get(index);
  }
}