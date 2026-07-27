"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookManager = void 0;
const Repository_js_1 = require("../generics/Repository.js");
const Logger_js_1 = require("../decorators/Logger.js");
const DashboardRenderer_js_1 = require("../utils/DashboardRenderer.js");
class BookManager {
    constructor() {
        this.repository = new Repository_js_1.Repository();
        this.displayedBooks = [];
        this.editIndex = -1;
    }
    updateDashboard() {
        DashboardRenderer_js_1.DashboardRenderer.update(this.repository.getAll());
    }
    renderBooks() {
        const tableBody = document.querySelector("#bookTable tbody");
        if (!tableBody)
            return;
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
            const appendCell = (content, className = "p-4 border-r border-slate-200") => {
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
                if (originalIndex !== -1)
                    this.deleteBook(originalIndex);
            });
            editBtn.addEventListener("click", () => {
                const allBooks = this.repository.getAll();
                const originalIndex = allBooks.indexOf(book);
                if (originalIndex !== -1)
                    this.editBook(originalIndex);
            });
            buttonContainer.appendChild(deleteBtn);
            buttonContainer.appendChild(editBtn);
            actionCell.appendChild(buttonContainer);
            row.appendChild(actionCell);
            tableBody.appendChild(row);
        });
    }
    deleteBook(index) {
        if (confirm("Delete this book?")) {
            this.repository.remove(index);
            this.updateDashboard();
            this.applyFilters();
        }
    }
    editBook(index) {
        const book = this.repository.get(index);
        document.getElementById("title").value = book.title;
        document.getElementById("author").value = book.author;
        document.getElementById("isbn").value = book.isbn;
        document.getElementById("publicationDate").value = book.publicationDate;
        document.getElementById("genre").value = book.genre;
        this.setEditIndex(index);
        const submitBtn = document.querySelector("#bookForm button[type='submit']");
        if (submitBtn)
            submitBtn.textContent = "Update Book";
    }
    applyFilters() {
        let filtered = this.repository.getAll();
        const searchInput = document.getElementById("searchBook");
        const keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
        if (keyword !== "") {
            filtered = filtered.filter((book) => book.title.toLowerCase().includes(keyword));
        }
        const genreFilter = document.getElementById("genreFilter");
        const genre = genreFilter ? genreFilter.value : "";
        if (genre !== "") {
            filtered = filtered.filter((book) => book.genre === genre);
        }
        const sortBooks = document.getElementById("sortBooks");
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
    addBook(book) {
        this.repository.add(book);
        this.updateDashboard();
        this.applyFilters();
    }
    updateBook(index, updatedBook) {
        this.repository.update(index, updatedBook);
        this.updateDashboard();
        this.applyFilters();
    }
    findBook(title, author, ignoreIndex = -1) {
        return this.repository.getAll().some((book, index) => index !== ignoreIndex &&
            book.title.toLowerCase() === title.toLowerCase() &&
            book.author.toLowerCase() === author.toLowerCase());
    }
    bookExists(title) {
        return this.repository.getAll().some((book) => book.title.toLowerCase() === title.toLowerCase());
    }
    isEditing() {
        return this.editIndex !== -1;
    }
    getEditIndex() {
        return this.editIndex;
    }
    setEditIndex(index) {
        this.editIndex = index;
    }
    clearEditIndex() {
        this.editIndex = -1;
    }
    getBook(index) {
        return this.repository.get(index);
    }
}
exports.BookManager = BookManager;
__decorate([
    Logger_js_1.LogExecution,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BookManager.prototype, "applyFilters", null);
