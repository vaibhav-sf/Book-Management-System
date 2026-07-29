import {IBook} from "../interfaces/IBook.js"

export class BookRenderer{
    render(
        books: IBook[],
        onDelete: (book: IBook) => void,
        onEdit: (book: IBook) => void
    ): void {
        const tableBody = document.querySelector("#bookTable tbody") as HTMLTableSectionElement;
        if (!tableBody) return;
    
        tableBody.replaceChildren();
        const booksToDisplay = books;

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
          appendCell(book.getSource());
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
            // const allBooks = this.repository.getAll();
            // const originalIndex = allBooks.indexOf(book);
            // if (originalIndex !== -1) this.deleteBook(originalIndex);
            onDelete(book);
          });

          editBtn.addEventListener("click", () => {
            // const allBooks = this.repository.getAll();
            // const originalIndex = allBooks.indexOf(book);
            // if (originalIndex !== -1) this.editBook(originalIndex);
            onEdit(book);
          });

          buttonContainer.appendChild(deleteBtn);
          buttonContainer.appendChild(editBtn);
          actionCell.appendChild(buttonContainer);
          row.appendChild(actionCell);
          tableBody.appendChild(row);
        });
        }
}
