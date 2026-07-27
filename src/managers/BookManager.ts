import { IBook } from "../interfaces/IBook.js";
import { Repository } from "../generics/Repository.js";
import { LogExecution } from "../decorators/Logger.js";
import { DashboardRenderer } from "../utils/DashboardRenderer.js";

export class BookManager {
  private repository = new Repository<IBook>();
  private displayedBooks: IBook[] = [];
  private editIndex: number = -1;

  updateDashboard(): void {
    DashboardRenderer.update(this.repository.getAll());
  }

  renderBooks(): void {
    const tableBody = document.querySelector("#bookTable tbody") as HTMLTableSectionElement;
    if (!tableBody) return;
    
    tableBody.replaceChildren();
    const booksToDisplay = this.displayedBooks;

    if (booksToDisplay.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 9;
      cell.className = "p-8 text-center text-slate-500 py-12";
      cell.textContent = "📚 No books found.";
      row.appendChild(cell);
      tableBody.appendChild(row);
      return;
    }

    booksToDisplay.forEach((book) => {
      const row = document.createElement("tr");
      row.className = "border-b border-slate-200 even:bg-slate-50 hover:bg-slate-50";

      const appendCell = (content: string, className: string = "p-4 border-r border-slate-200") => {
        const td = document.createElement("td");
        td.className = className;
        td.textContent = content;
        row.appendChild(td);
      };

      appendCell(book.title, "p-4 border-r border-slate-200 text-left font-medium");
      appendCell(book.author);
      appendCell(book.isbn);
      appendCell(book.publicationDate);
      appendCell(book.genre);
      appendCell(book.getBookAge().toString());
      appendCell(book.getCategory());
      appendCell(`₹${book.getDiscountPrice().toFixed(0)}`, "p-4 border-r border-slate-200 font-bold text-emerald-600");

      const actionCell = document.createElement("td");
      actionCell.className = "p-4";
      const buttonContainer = document.createElement("div");
      buttonContainer.className = "flex justify-center gap-2";

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded transition-colors duration-200 cursor-pointer";
      
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.className = "px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded transition-colors duration-200 cursor-pointer";

      deleteBtn.addEventListener("click", () => {
        const allBooks = this.repository.getAll();
        const originalIndex = allBooks.indexOf(book);
        if (originalIndex !== -1) this.deleteBook(originalIndex);
      });

      editBtn.addEventListener("click", () => {
        const allBooks = this.repository.getAll();
        const originalIndex = allBooks.indexOf(book);
        if (originalIndex !== -1) this.editBook(originalIndex);
      });

      buttonContainer.appendChild(deleteBtn);
      buttonContainer.appendChild(editBtn);
      actionCell.appendChild(buttonContainer);
      row.appendChild(actionCell);
      tableBody.appendChild(row);
    });
  }

  deleteBook(index: number): void {
    if (confirm("Delete this book?")) {
      this.repository.remove(index);
      this.updateDashboard();
      this.applyFilters();
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
    let filtered = this.repository.getAll();

    const searchInput = document.getElementById("searchBook") as HTMLInputElement;
    const keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";

    if (keyword !== "") {
      filtered = filtered.filter((book) =>
        book.title.toLowerCase().includes(keyword),
      );
    }

    const genreFilter = document.getElementById("genreFilter") as HTMLSelectElement;
    const genre = genreFilter ? genreFilter.value : "";

    if (genre !== "") {
      filtered = filtered.filter((book) => book.genre === genre);
    }

    const sortBooks = document.getElementById("sortBooks") as HTMLSelectElement;
    const sort = sortBooks ? sortBooks.value : "";

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
    this.displayedBooks = filtered;
    this.renderBooks();
  }

  addBook(book: IBook): void {
    this.repository.add(book);
    this.updateDashboard();
    this.applyFilters();
  }

  updateBook(index: number, updatedBook: IBook): void {
    this.repository.update(index, updatedBook);
    this.updateDashboard();
    this.applyFilters();
  }

  findBook(title: string, author: string, ignoreIndex: number = -1): boolean {
    return this.repository.getAll().some((book, index) =>
      index !== ignoreIndex &&
      book.title.toLowerCase() === title.toLowerCase() &&
      book.author.toLowerCase() === author.toLowerCase()
    );
  }

  bookExists(title: string): boolean {
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