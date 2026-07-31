import { BookManager } from "./managers/BookManager.js";
import { PrintedBook } from "./models/PrintedBook.js";
import { EBook } from "./models/EBook.js";
import { ApiService } from "./services/ApiService.js";
import { DOMHelper } from "./utils/DOMHelper.js";
import { GENRES, ApiPost } from "./types/BookTypes.js";

const manager = new BookManager();
manager.applyFilters();

const serverRequest = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => (Math.random() < 0.05 ? reject(new Error("Server Error")) : resolve()), 1000);
  });
};
const form = document.getElementById("bookForm") as HTMLFormElement;

if (form) {
  const submitBtn = form.querySelector("button[type='submit']") as HTMLButtonElement;

  form.addEventListener("submit", async (e: Event) => {
    e.preventDefault(); // This stops the page reload
    const title = DOMHelper.getValue("title");
    const author = DOMHelper.getValue("author");
    const isbn = DOMHelper.getValue("isbn");
    const publicationDate = DOMHelper.getValue("publicationDate");
    const genre = DOMHelper.getValue("genre");

    DOMHelper.clearErrors();
    let valid = true;
    const FIELDS = [["title", "Title"], ["author", "Author"], ["isbn", "ISBN"],
    ["publicationDate", "Publication Date"], ["genre", "Genre"]] as const;

    for (const [id, label] of FIELDS) {
      if (!DOMHelper.getValue(id)) { DOMHelper.showError(id, `${label} is required`); valid = false; }
    }
    if (!valid) return;

    if (isNaN(Number(isbn))) {
      DOMHelper.showError("isbn", "ISBN must be a number");
      return;
    }
    if (isbn.length !== 10) {
      DOMHelper.showError("isbn", "ISBN must be 10 digits long");
      return;
    }

    const age = new Date().getFullYear() - new Date(publicationDate).getFullYear();
    if (age < 0) {
      DOMHelper.showError("publicationDate", "Publication Date cannot be in the future");
      return;
    }

    if (manager.findBook(title, author, manager.getEditIndex())) {
      DOMHelper.showError("title", "Book already exists");
      return;
    }

    if (manager.bookExists(isbn, manager.getEditIndex())) {
      DOMHelper.showError("isbn", "Book with this ISBN already exists");
      return;
    }
    try {
      await serverRequest();

      if (manager.isEditing()) {
        const existingBook = manager.getBook(manager.getEditIndex());
        const Model = existingBook instanceof EBook ? EBook : PrintedBook;
        const book = new Model(title, author, isbn, publicationDate, genre, existingBook?.price ?? null);

        manager.updateBook(manager.getEditIndex(), book);
        manager.clearEditIndex();
        DOMHelper.showSuccess("Book updated successfully!");
      } else {
        const book = new PrintedBook(title, author, isbn, publicationDate, genre);
        manager.addBook(book);
        DOMHelper.showSuccess("Book added successfully!");
      }
    } catch (error) {
      DOMHelper.showToastError("Error processing book: " + error);
    }

    form.reset();
    if (submitBtn) submitBtn.textContent = "Register Book";
    DOMHelper.clearErrors();
  });
}

document.getElementById("fetchBooksBtn")?.addEventListener("click", () =>
  manager.applyFilters());
document.getElementById("genreFilter")?.addEventListener("change", () =>
  manager.applyFilters());
document.getElementById("sortBooks")?.addEventListener("change", () =>
  manager.applyFilters());
document.getElementById("searchBook")?.addEventListener("input", () =>
  manager.applyFilters());

const renderApiBook = (book: ApiPost): void => {
  const apiResultList = document.getElementById("apiResultList");
  if (!apiResultList) return;

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
    if (error) error.textContent = "";
  });
});

const fetchSingleBook = async (): Promise<void> => {
  const idInput = document.getElementById("apiBookSearch") as HTMLInputElement;
  const id = idInput ? idInput.value : "";
  const apiResultList = document.getElementById("apiResultList");
  if (!apiResultList) return;

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
    const data = await ApiService.fetchPost(id);
    apiResultList.replaceChildren();
    renderApiBook(data);
  } catch (error) {
    apiResultList.replaceChildren();
    const para = document.createElement("p");
    para.textContent = "Failed to load book.";
    para.className = "text-red-500 text-center p-5";
    apiResultList.appendChild(para);
  }
};

document.getElementById("fetchApiBooks")?.addEventListener("click", fetchSingleBook);

function getRandomGenre(): string {
  return GENRES[Math.floor(Math.random() * GENRES.length)];
}

const authorsList: string[] = [
  "John Smith",
  "William Brown",
  "Emily Davis",
  "James Wilson",
  "Sophia Clark",
  "Olivia White",
  "Noah Thomas",
  "Lucas Walker",
];

function getRandomAuthor(): string {
  return authorsList[Math.floor(Math.random() * authorsList.length)];
}

function getRandomDate(): string {
  const year = new Date().getFullYear() - Math.floor(Math.random() * 11);
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const addApiBook = async (id: number): Promise<void> => {
  const apiResultList = document.getElementById("apiResultList");
  try {
    const data = await ApiService.fetchPost(id);
    const alreadyExists = manager.bookExistsByTitle(data.title);

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
    const apiBook = new EBook(
      data.title,
      getRandomAuthor(),
      isbn,
      publicationDate,
      randomGenre
    );

    manager.addBook(apiBook);
    if (apiResultList) apiResultList.textContent = "";
    const apiBookSearch = document.getElementById("apiBookSearch") as HTMLInputElement;
    if (apiBookSearch) apiBookSearch.value = "";
  } catch (error) {
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