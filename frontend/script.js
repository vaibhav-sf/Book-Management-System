const form = document.getElementById("bookForm");
const tableBody = document.querySelector("#bookTable tbody");
const submitBtn = form.querySelector("button[type='submit']");
class BaseBook{
  constructor(title, author, isbn, publicationDate, genre, source){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.publicationDate = publicationDate;
    this.genre = genre;
    this.source = source;
  }

  getBookAge(){
      const age = new Date().getFullYear() - new Date(this.publicationDate).getFullYear();
      return age;
    }
  getCategory(){
      return this.source;
    } 
}
class PrintedBook extends BaseBook{
  constructor(title, author, isbn, publicationDate, genre){
    super(title, author, isbn, publicationDate, genre, "Manual Entry");
    this.price = (Math.floor(Math.random() * 10) +1) * 100;
  }


  getDiscountPrice(){
    return this.price * 0.9;
  }
}
class EBook extends BaseBook{
  constructor(title, author, isbn, publicationDate, genre){
    super(title, author, isbn, publicationDate, genre, "API");
    this.price = (Math.floor(Math.random() * 10) +1) * 100;
  }
  getDiscountPrice(){
    return this.price * 0.8;
  }
}

const genreMapping = {
  Religious: "Religious",
  Historical: "Historical",
  Action: "Action",
  Adventure: "Adventure",
  Comedy: "Comedy",
  Mystery: "Mystery",
  Romance: "Romance",
  Thriller: "Thriller",
};


class BookManager {
  constructor() {
    this.books = [];
    this.displayedBooks = [];
    this.editIndex = -1;
  }
  updateDashboard(){
  document.getElementById("totalBooks").textContent = this.books.length;
  const authors = [...new Set(this.books.map((book) => book.author))];

  document.getElementById("totalAuthors").textContent = authors.length;
  const genres = [...new Set(this.books.map((book) => book.genre))];

  document.getElementById("totalGenres").textContent = genres.length;
  const apiBooks = this.books.filter((book) => book.source === "API");
  document.getElementById("apiBooks").textContent = apiBooks.length;
};
  renderBooks() {
    tableBody.innerHTML = "";

    if (this.displayedBooks.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" class="p-8 text-center text-slate-500 py-12">
            📚 No books available
          </td>
        </tr>`;
      return;
    }

    this.displayedBooks.forEach((book) => {
      const discountPrice = book.getDiscountPrice();
      const row = document.createElement("tr");
      row.className = "border-b border-slate-200 even:bg-slate-50 hover:bg-slate-50";

      row.innerHTML = `
        <td class="p-4 border-r border-slate-200 text-left font-medium">${book.title}</td>
        <td class="p-4 border-r border-slate-200">${book.author}</td>
        <td class="p-4 border-r border-slate-200">${book.isbn}</td>
        <td class="p-4 border-r border-slate-200">${book.publicationDate}</td>
        <td class="p-4 border-r border-slate-200">${book.genre}</td>
        <td class="p-4 border-r border-slate-200">${book.getBookAge()} years</td>
        <td class="p-4 border-r border-slate-200">
          <span class="px-2.5 py-1 bg-slate-200 text-slate-800 rounded-full text-xs font-semibold">
            ${book.getCategory()}
          </span>
        </td>
        <td class="p-4 border-r border-slate-200 font-bold text-emerald-600">
          ₹${Number(discountPrice).toFixed(0)}
        </td>
        <td class="p-4">
          <div class="flex justify-center gap-2">
            <button class="deleteBtn px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded transition-colors cursor-pointer">Delete</button>
            <button class="editBtn px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded transition-colors cursor-pointer">Edit</button>
          </div>
        </td>
      `;

      row.querySelector(".deleteBtn").addEventListener("click", () => {
        this.deleteBook(this.books.indexOf(book));
      });

      row.querySelector(".editBtn").addEventListener("click", () => {
        this.editBook(this.books.indexOf(book));
      });

      tableBody.appendChild(row);
    });
  }

 deleteBook(index){
  if (confirm("Delete this book?")) {
    this.books.splice(index, 1);
    this.updateDashboard();
    this.applyFilters();
  }
};
 editBook(index){
  const book = this.books[index];
  document.getElementById("title").value = book.title;
  document.getElementById("author").value = book.author;
  document.getElementById("isbn").value = book.isbn;
  document.getElementById("publicationDate").value = book.publicationDate;
  document.getElementById("genre").value = book.genre;

  this.editIndex = index;
  submitBtn.textContent = "Update Book";
};
  applyFilters() {
  let filtered = [...this.books];

  const keyword = document
    .getElementById("searchBook")
    .value.trim()
    .toLowerCase();

  if (keyword !== "") {
    filtered = filtered.filter((book) =>
      book.title.toLowerCase().includes(keyword),
    );
  }

  const genre = document.getElementById("genreFilter").value;

  if (genre !== "") {
    filtered = filtered.filter((book) => book.genre === genre);
  }

  const sort = document.getElementById("sortBooks").value;

  switch (sort) {
    case "az":
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;

    case "za":
      filtered.sort((a, b) => b.title.localeCompare(a.title));
      break;

    case "newest":
      filtered.sort(
        (a, b) => new Date(b.publicationDate) - new Date(a.publicationDate),
      );
      break;

    case "oldest":
      filtered.sort(
        (a, b) => new Date(a.publicationDate) - new Date(b.publicationDate),
      );
      break;
  }
  this.displayedBooks = filtered;
  this.renderBooks();
}
 addBook(book){
  this.books.push(book);
  this.updateDashboard();
  this.applyFilters();
 }
 updateBook(index, updatedBook){
  this.books[index] = updatedBook;
  this.updateDashboard();
  this.applyFilters();
 }
 findBook(title, author, ignoreIndex = -1){
  return this.books.some((book, index) =>
  index !== ignoreIndex && book.title.toLowerCase() === title.toLowerCase() 
  && book.author.toLowerCase() === author.toLowerCase()
  );
 }
}
const manager = new BookManager();
manager.applyFilters();
const getValue = (id) => {
  return document.getElementById(id).value.trim();
};

const clearErrors = () => {
  document.querySelectorAll(".error").forEach((error) => {
    error.textContent = "";
  });

  document.querySelectorAll("input, select").forEach((input) => {
    input.classList.remove("border-red-500", "ring-2", "ring-red-500");
  });
};

const showSuccess = (message) => {
  const toast = document.createElement("div");
  toast.className = "fixed bottom-5 right-5 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 z-50";
  toast.innerHTML = `✅ ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2800);
};

const showError = (inputId, errorId, message) => {
  document.getElementById(errorId).textContent = message;
  document.getElementById(inputId).classList.add("border-red-500", "ring-2", "ring-red-500");
};
const serverRequest = () => {
    return new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = getValue("title");
  const author = getValue("author");
  const isbn = getValue("isbn");
  const publicationDate = getValue("publicationDate");
  const genre = getValue("genre");

  clearErrors();
  let valid = true;

  if (!title) {
    showError("title", "titleError", "Title is required");
    valid = false;
  }
  if (!author) {
    showError("author", "authorError", "Author is required");
    valid = false;
  }
  if (!isbn) {
    showError("isbn", "isbnError", "ISBN is required");
    valid = false;
  }

  if (!publicationDate) {
    showError(
      "publicationDate",
      "publicationDateError",
      "Publication Date is required",
    );
    valid = false;
  }

  if (!genre) {
    showError("genre", "genreError", "Genre is required");
    valid = false;
  }
  if (!valid) {
    return;
  }

  if (isNaN(isbn)) {
    showError("isbn", "isbnError", "ISBN must be a number");
    return;
  }
  if (isbn.length !== 10) {
    showError("isbn", "isbnError", "ISBN must be 10 digits long");
    return;
  }

  const age = new Date().getFullYear() - new Date(publicationDate).getFullYear();
  
  if (age < 0) {
    showError(
      "publicationDate",
      "publicationDateError",
      "Publication Date cannot be in the future",
    );
    return;
  }

  if (manager.editIndex !== -1) {
    if(manager.findBook(title, author, manager.editIndex)){
      showError("title", "titleError", "Book already exists");
      return;
    }
    try{
      await serverRequest();
      const existingBook = manager.books[manager.editIndex];

      const updatedBook =
      existingBook instanceof EBook
    ? new EBook(
        title,
        author,
        isbn,
        publicationDate,
        genre
      )
    : new PrintedBook(
        title,
        author,
        isbn,
        publicationDate,
        genre
      );
      manager.updateBook(manager.editIndex, updatedBook);
      showSuccess("Book updated successfully!");
      manager.editIndex = -1;
    }
    catch(error){
      console.error("Error updating book:", error);
    }
    
  } else {
    if (manager.findBook(title, author, manager.editIndex)){
        showError("title", "titleError", "Book already exists");
        return;
    }
    try{
      await serverRequest();
      const book = new PrintedBook(
        title,
        author,
        isbn,
        publicationDate,
        genre,
      );
      manager.addBook(book);
      showSuccess("Book added successfully!");
      console.log("Books:", manager.books);
    }
    catch(error){
      console.error("Error adding book:", error);
    }
  }
    
  form.reset();
  submitBtn.textContent = "Register Book";
  clearErrors();
});

document.getElementById("fetchBooksBtn").addEventListener("click", () => manager.applyFilters());
document.getElementById("genreFilter").addEventListener("change", () =>  manager.applyFilters());
document.getElementById("sortBooks").addEventListener("change",  () => manager.applyFilters());
document.getElementById("searchBook").addEventListener("input", () => {manager.applyFilters();});

const renderApiBook = (book) => {
    document.getElementById("apiResultList").innerHTML=`
    <div class="flex justify-between items-center gap-4 p-3 border border-slate-200 rounded-xl bg-slate-50 transition-all duration-300 hover:translate-x-1 hover:shadow-md">
        <div class="flex gap-4 items-center flex-[5] min-w-0">
            <div class="w-9 h-9 min-w-9 rounded-full bg-blue-600 text-white flex justify-center items-center font-bold text-sm">
                ${book.id}
            </div>
            <div class="flex-1 text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-slate-800">
                ${book.title}
            </div>
        </div>                                                                                                                                                
        <button id="addBtn${book.id}" class="w-20 min-w-20 h-9 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-sm cursor-pointer border-none transition-colors">
        + Add
        </button>
    </div>
    `;
    document
    .getElementById(`addBtn${book.id}`)
    .addEventListener("click", () => {
        addApiBook(book.id);
    });
};

document.querySelectorAll("input, select").forEach((input) => {
  input.addEventListener("input", () => {
    input.classList.remove("border-red-500", "ring-2", "ring-red-500");
    const errorId = input.id + "Error";
    const error = document.getElementById(errorId);
    if (error) {
      error.textContent = "";
    }
  });
});

const fetchSingleBook = async () => {
  const id = document.getElementById("apiBookSearch").value;
  if (id === "") {
    document.getElementById("apiResultList").innerHTML = `
        <p class="text-red-500 text-center">
        Please enter Book ID
        </p>
        `;
    return;
  }
  document.getElementById("apiResultList").innerHTML = `
        <p class="text-red-500 text-center p-5">
            Loading book...
        </p>
    `;

  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
    );
    if (!response.ok) {
      throw new Error("Failed to load book.");
    }
    const data = await response.json();
    renderApiBook(data);
  } catch (error) {
    document.getElementById("apiResultList").innerHTML = `
        <p class="text-red-500 text-center">
            Failed to load book.
        </p>
    `;
  }
};

document
  .getElementById("fetchApiBooks")
  .addEventListener("click", fetchSingleBook);
const genres = Object.values(genreMapping);


function getRandomGenre() {
  return genres[Math.floor(Math.random() * genres.length)];
}

const authors = [
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
  return authors[Math.floor(Math.random() * authors.length)];
}

function getRandomDate() {
  const year = new Date().getFullYear() - Math.floor(Math.random() * 11);
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const addApiBook = async (id) => {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
    );
    if (!response.ok) {
      throw new Error("Failed to add book. Please try again.");
    }
    const data = await response.json();
    const alreadyExists = manager.books.some(
      (book) => book.title.toLowerCase() === data.title.toLowerCase(),
    );
    if (alreadyExists) {
      document.getElementById("apiResultList").innerHTML = `
        <p class="text-red-500 text-center">
            Book already exist.
        </p>`;
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
    document.getElementById("apiResultList").innerHTML = "";
    document.getElementById("apiBookSearch").value = "";
  } catch (error) {
    console.error(error);
    document.getElementById("apiResultList").innerHTML = `
        <p class="text-red-500 text-center">
            Failed to add book. Please try again.
        </p>
    `;
  }
};
