const form = document.getElementById("bookForm");
const tableBody = document.querySelector("#bookTable tbody");
const submitBtn = form.querySelector("button[type='submit']");
const books = [];
let displayedBooks = [];
let editIndex = -1;

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

const getCategory = (genre) => {
  return genreMapping[genre] ?? "General";
};

const getValue = (id) => {
  return document.getElementById(id).value.trim();
};

const renderBooks = () => {
  tableBody.innerHTML = "";
  if (displayedBooks.length === 0) {
    tableBody.innerHTML = `
    <tr>
        <td colspan="8">
            📚 No books available
        </td>
    </tr>
    `;
    return;
  }
  displayedBooks.forEach((book, index) => {
    const row = document.createElement("tr");
    row.className =
      "border-b border-slate-200 even:bg-slate-50 hover:bg-slate-50";
    row.innerHTML = `
        <td class="p-4 border-r border-slate-200 text-left font-medium">${book.title}</td>
        <td class="p-4 border-r border-slate-200">${book.author}</td>
        <td class="p-4 border-r border-slate-200">${book.isbn}</td>
        <td class="p-4 border-r border-slate-200">${book.publicationDate}</td>
        <td class="p-4 border-r border-slate-200">${book.genre}</td>
        <td class="p-4 border-r border-slate-200">${book.age}</td>
        <td class="p-4 border-r border-slate-200"><span class="px-2.5 py-1 bg-slate-200 text-slate-800 rounded-full text-xs font-semibold">${book.category}</span></td>
        <td class="p-4 ">
            <div class="flex justify-center gap-2">
                <button class="deleteBtn px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded transition-colors cursor-pointer">Delete</button>
                <button class="editBtn px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded transition-colors cursor-pointer">Edit</button>
            </div>
        </td>
        `;
        const deleteBtn = row.querySelector(".deleteBtn");
        deleteBtn.addEventListener("click", () => {
          deleteBook(books.indexOf(book));
        });
        const editBtn = row.querySelector(".editBtn");
        editBtn.addEventListener("click", () => {
          editBook(books.indexOf(book));
        })
    tableBody.appendChild(row);
  });
};

const updateDashboard = () => {
  document.getElementById("totalBooks").textContent = books.length;
  const authors = [...new Set(books.map((book) => book.author))];

  document.getElementById("totalAuthors").textContent = authors.length;
  const genres = [...new Set(books.map((book) => book.genre))];

  document.getElementById("totalGenres").textContent = genres.length;
  const apiBooks = books.filter((book) => book.source === "API");
  document.getElementById("apiBooks").textContent = apiBooks.length;
};
const clearErrors = () => {
  document.querySelectorAll(".error").forEach((error) => {
    error.textContent = "";
  });

  document.querySelectorAll("input, select").forEach((input) => {
    input.classList.remove("border-red-500", "ring-2", "ring-red-500");
  });
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

  const currentYear = new Date().getFullYear();
  const publicationYear = new Date(publicationDate).getFullYear();
  const age = currentYear - publicationYear;

  if (age < 0) {
    showError(
      "publicationDate",
      "publicationDateError",
      "Publication Date cannot be in the future",
    );
    return;
  }

  if (editIndex !== -1) {
    const exists = books.some((book, index) =>
      index !== editIndex &&
      book.title.toLowerCase() === title.toLowerCase() &&
      book.author.toLowerCase() === author.toLowerCase()
    );

    if (exists) {
        showError("title", "titleError", "Book already exists");
        return;
    }
    try{
      await serverRequest();
      books[editIndex] = 
      {...books[editIndex], 
        title,
        author,
        isbn,
        publicationDate,
        genre,
        age,
      };
      editIndex = -1;
    }
    catch(error){
      console.error("Error updating book:", error);
    }
    updateDashboard();
    applyFilters();
  } else {
    const exists = books.some(
      (b, index) =>
        index !== editIndex &&
        b.title.toLowerCase() === title.toLowerCase() &&
        b.author.toLowerCase() === author.toLowerCase(),
    );

    if (exists) {
      showError("title", "titleError", "Book already exists");
      return;
    }
    try{
      await serverRequest();
      const book = {
        title,
        author,
        isbn,
        publicationDate,
        genre,
        age,
        category: "Manual Entry",
        source: "Manual Entry",
      };
      books.push(book);
      console.log("Books:", books);
    }
    catch(error){
      console.error("Error adding book:", error);
    }
    updateDashboard();
    applyFilters();
  }
    
  form.reset();
  submitBtn.textContent = "Register Book";
  clearErrors();
});

const deleteBook = (index) => {
  if (confirm("Delete this book?")) {
    books.splice(index, 1);
    updateDashboard();
    applyFilters();
  }
};

const editBook = (index) => {
  const book = books[index];
  document.getElementById("title").value = book.title;
  document.getElementById("author").value = book.author;
  document.getElementById("isbn").value = book.isbn;
  document.getElementById("publicationDate").value = book.publicationDate;
  document.getElementById("genre").value = book.genre;

  editIndex = index;
  submitBtn.textContent = "Update Book";
};

document
  .getElementById("fetchBooksBtn")
  .addEventListener("click", applyFilters);
document.getElementById("genreFilter").addEventListener("change", applyFilters);
document.getElementById("sortBooks").addEventListener("change", applyFilters);

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
    const alreadyExists = books.some(
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
    const age =
      new Date().getFullYear() - new Date(publicationDate).getFullYear();

    books.push({
      title: data.title,
      author: getRandomAuthor(),
      isbn: isbn,
      publicationDate: publicationDate,
      genre: randomGenre,
      age: age,
      category: "API",
      source: "API",
    });

    updateDashboard();
    applyFilters();
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

function applyFilters() {
  let filtered = [...books];

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
  displayedBooks = filtered;
  renderBooks();
}
