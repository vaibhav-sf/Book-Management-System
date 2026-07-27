"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRenderer = void 0;
class DashboardRenderer {
    static update(books) {
        const totalBooks = document.getElementById("totalBooks");
        const totalAuthors = document.getElementById("totalAuthors");
        const totalGenres = document.getElementById("totalGenres");
        const apiBook = document.getElementById("apiBooks");
        if (totalBooks)
            totalBooks.textContent = books.length.toString();
        const authors = [...new Set(books.map((book) => book.author))];
        if (totalAuthors)
            totalAuthors.textContent = authors.length.toString();
        const genres = [...new Set(books.map((book) => book.genre))];
        if (totalGenres)
            totalGenres.textContent = genres.length.toString();
        const apiBooks = books.filter((book) => book.source === "API");
        if (apiBook)
            apiBook.textContent = apiBooks.length.toString();
    }
}
exports.DashboardRenderer = DashboardRenderer;
