"use strict";
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
const BookManager_js_1 = require("./managers/BookManager.js");
const PrintedBook_js_1 = require("./models/PrintedBook.js");
const EBook_js_1 = require("./models/EBook.js");
const ApiService_js_1 = require("./services/ApiService.js");
const DOMHelper_js_1 = require("./utils/DOMHelper.js");
const manager = new BookManager_js_1.BookManager();
manager.applyFilters();
const serverRequest = () => {
    return new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });
};
const form = document.getElementById("bookForm");
if (form) {
    const submitBtn = form.querySelector("button[type='submit']");
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // This stops the page reload
        const title = DOMHelper_js_1.DOMHelper.getValue("title");
        const author = DOMHelper_js_1.DOMHelper.getValue("author");
        const isbn = DOMHelper_js_1.DOMHelper.getValue("isbn");
        const publicationDate = DOMHelper_js_1.DOMHelper.getValue("publicationDate");
        const genre = DOMHelper_js_1.DOMHelper.getValue("genre");
        DOMHelper_js_1.DOMHelper.clearErrors();
        let valid = true;
        if (!title) {
            DOMHelper_js_1.DOMHelper.showError("title", "titleError", "Title is required");
            valid = false;
        }
        if (!author) {
            DOMHelper_js_1.DOMHelper.showError("author", "authorError", "Author is required");
            valid = false;
        }
        if (!isbn) {
            DOMHelper_js_1.DOMHelper.showError("isbn", "isbnError", "ISBN is required");
            valid = false;
        }
        if (!publicationDate) {
            DOMHelper_js_1.DOMHelper.showError("publicationDate", "publicationDateError", "Publication Date is required");
            valid = false;
        }
        if (!genre) {
            DOMHelper_js_1.DOMHelper.showError("genre", "genreError", "Genre is required");
            valid = false;
        }
        if (!valid)
            return;
        if (isNaN(Number(isbn))) {
            DOMHelper_js_1.DOMHelper.showError("isbn", "isbnError", "ISBN must be a number");
            return;
        }
        if (isbn.length !== 10) {
            DOMHelper_js_1.DOMHelper.showError("isbn", "isbnError", "ISBN must be 10 digits long");
            return;
        }
        const age = new Date().getFullYear() - new Date(publicationDate).getFullYear();
        if (age < 0) {
            DOMHelper_js_1.DOMHelper.showError("publicationDate", "publicationDateError", "Publication Date cannot be in the future");
            return;
        }
        if (manager.isEditing()) {
            if (manager.findBook(title, author, manager.getEditIndex())) {
                DOMHelper_js_1.DOMHelper.showError("title", "titleError", "Book already exists");
                return;
            }
            try {
                await serverRequest();
                const existingBook = manager.getBook(manager.getEditIndex());
                const updatedBook = existingBook instanceof EBook_js_1.EBook
                    ? new EBook_js_1.EBook(title, author, isbn, publicationDate, genre, existingBook.price)
                    : new PrintedBook_js_1.PrintedBook(title, author, isbn, publicationDate, genre, existingBook.price);
                manager.updateBook(manager.getEditIndex(), updatedBook);
                DOMHelper_js_1.DOMHelper.showSuccess("Book updated successfully!");
                manager.clearEditIndex();
            }
            catch (error) {
                console.error("Error updating book:", error);
            }
        }
        else {
            if (manager.findBook(title, author, manager.getEditIndex())) {
                DOMHelper_js_1.DOMHelper.showError("title", "titleError", "Book already exists");
                return;
            }
            try {
                await serverRequest();
                const book = new PrintedBook_js_1.PrintedBook(title, author, isbn, publicationDate, genre);
                manager.addBook(book);
                DOMHelper_js_1.DOMHelper.showSuccess("Book added successfully!");
            }
            catch (error) {
                console.error("Error adding book:", error);
            }
        }
        form.reset();
        if (submitBtn)
            submitBtn.textContent = "Register Book";
        DOMHelper_js_1.DOMHelper.clearErrors();
    });
}
(_a = document.getElementById("fetchBooksBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => manager.applyFilters());
(_b = document.getElementById("genreFilter")) === null || _b === void 0 ? void 0 : _b.addEventListener("change", () => manager.applyFilters());
(_c = document.getElementById("sortBooks")) === null || _c === void 0 ? void 0 : _c.addEventListener("change", () => manager.applyFilters());
(_d = document.getElementById("searchBook")) === null || _d === void 0 ? void 0 : _d.addEventListener("input", () => manager.applyFilters());
const renderApiBook = (book) => {
    const apiResultList = document.getElementById("apiResultList");
    if (!apiResultList)
        return;
    const card = document.createElement("div");
    card.className = "flex justify-between items-center gap-4 p-3 border border-slate-200 rounded-xl bg-slate-50";
    const leftSection = document.createElement("div");
    leftSection.className = "flex items-center gap-4 flex-1";
    const idBadge = document.createElement("div");
    idBadge.className = "w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0";
    idBadge.textContent = book.id.toString();
    const title = document.createElement("div");
    title.textContent = book.title;
    title.className = "flex-1 text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-slate-800";
    const button = document.createElement("button");
    button.textContent = "+Add";
    button.className = "w-20 h-9 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-sm cursor-pointer";
    leftSection.appendChild(idBadge);
    leftSection.appendChild(title);
    card.appendChild(leftSection);
    card.appendChild(button);
    apiResultList.appendChild(card);
    button.addEventListener("click", () => {
        addApiBook(book.id);
    });
};
document.querySelectorAll("input, select").forEach((input) => {
    input.addEventListener("input", () => {
        input.classList.remove("border-red-500", "ring-2", "ring-red-500");
        const errorId = input.id + "Error";
        const error = document.getElementById(errorId);
        if (error)
            error.textContent = "";
    });
});
const fetchSingleBook = async () => {
    const idInput = document.getElementById("apiBookSearch");
    const id = idInput ? idInput.value : "";
    const apiResultList = document.getElementById("apiResultList");
    if (!apiResultList)
        return;
    apiResultList.replaceChildren();
    if (id === "") {
        const para = document.createElement("p");
        para.textContent = "Please Enter Book Id";
        para.className = "text-red-500 text-center p-5";
        apiResultList.appendChild(para);
        return;
    }
    const loading = document.createElement("p");
    loading.textContent = "Loading...";
    loading.className = "text-blue-500 text-center p-5";
    apiResultList.appendChild(loading);
    try {
        const data = await ApiService_js_1.ApiService.fetchPost(id);
        apiResultList.replaceChildren();
        renderApiBook(data);
    }
    catch (error) {
        apiResultList.replaceChildren();
        const para = document.createElement("p");
        para.textContent = "Failed to load book.";
        para.className = "text-red-500 text-center p-5";
        apiResultList.appendChild(para);
    }
};
(_e = document.getElementById("fetchApiBooks")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", fetchSingleBook);
const genresList = Object.values({
    Religious: "Religious",
    Historical: "Historical",
    Action: "Action",
    Adventure: "Adventure",
    Comedy: "Comedy",
    Mystery: "Mystery",
    Romance: "Romance",
    Thriller: "Thriller",
});
function getRandomGenre() {
    return genresList[Math.floor(Math.random() * genresList.length)];
}
const authorsList = [
    "John Smith",
    "William Brown",
    "Emily Davis",
    "James Wilson",
    "Sophia Clark",
    "Olivia White",
    "Noah Thomas",
    "Lucas Walker",
];
function getRandomAuthor() {
    return authorsList[Math.floor(Math.random() * authorsList.length)];
}
function getRandomDate() {
    const year = new Date().getFullYear() - Math.floor(Math.random() * 11);
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
const addApiBook = async (id) => {
    const apiResultList = document.getElementById("apiResultList");
    try {
        const data = await ApiService_js_1.ApiService.fetchPost(id);
        const alreadyExists = manager.bookExists(data.title);
        if (alreadyExists) {
            if (apiResultList) {
                apiResultList.replaceChildren();
                const para = document.createElement("p");
                para.textContent = "Book already exists.";
                para.className = "text-red-500 text-center p-5";
                apiResultList.appendChild(para);
            }
            return;
        }
        const isbn = String(Math.floor(1000000000 + Math.random() * 9000000000));
        const randomGenre = getRandomGenre();
        const publicationDate = getRandomDate();
        const apiBook = new EBook_js_1.EBook(data.title, getRandomAuthor(), isbn, publicationDate, randomGenre);
        manager.addBook(apiBook);
        if (apiResultList)
            apiResultList.textContent = "";
        const apiBookSearch = document.getElementById("apiBookSearch");
        if (apiBookSearch)
            apiBookSearch.value = "";
    }
    catch (error) {
        console.error(error);
        if (apiResultList) {
            apiResultList.replaceChildren();
            const para = document.createElement("p");
            para.textContent = "Failed to add book. Please try again.";
            para.className = "text-red-500 text-center";
            apiResultList.appendChild(para);
        }
    }
};
