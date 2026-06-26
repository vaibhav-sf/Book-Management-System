const form = document.getElementById("bookForm");
const tableBody = document.querySelector("#bookTable tbody");
const submitBtn = form.querySelector("button[type='submit']");
const books = [];
let displayedBooks = [];
let editIndex = -1;
let apiCount = 0;

const genreMapping = {
    Religious: "Spiritual",
    Historical: "History",
    Action: "Entertainment",
    Adventure: "Adventure",
    Comedy: "Comedy",
    Mystery: "Mystery",
    Romance: "Romance",
    Thriller: "Thriller",
    Other: "Other",
};

const getCategory = (genre) => {
    return genreMapping[genre] ?? "General";
};

const renderBooks = () => {
    tableBody.innerHTML="";
    if(displayedBooks.length===0){

    tableBody.innerHTML=`
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
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td>${book.publicationDate}</td>
        <td>${book.genre}</td>
        <td>${book.age}</td>
        <td>${book.category}</td>
        <td>
            <button class="deleteBtn" onClick="deleteBook(${books.indexOf(book)})">Delete</button>
            <button class="editBtn" onClick="editBook(${books.indexOf(book)})">Edit</button>
        </td>
        `;
        tableBody.appendChild(row);
    });
};

const updateDashboard = () => {
    document.getElementById("totalBooks").textContent = books.length;
    const authors = [
        ...new Set(books.map((book) => book.author))
    ];

    document.getElementById("totalAuthors").textContent = authors.length;
    const genres = [...new Set(
            books.map(book => book.genre)
        )
    ];

    document.getElementById("totalGenres").textContent = genres.length;
    const apiBooks = books.filter(book => book.source === "API");
    document.getElementById("apiBooks").textContent = apiBooks.length;
};
const clearErrors = () => {
    document.querySelectorAll(".error").forEach(error => {
        error.textContent = "";
    });

    document.querySelectorAll("input, select").forEach(input => {
        input.classList.remove("inputError");
    });
};

const showError = (inputId, errorId, message) => {
    document.getElementById(errorId).textContent = message;
    document.getElementById(inputId).classList.add("inputError");
};

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const isbn = document.getElementById("isbn").value.trim();
    const publicationDate = document.getElementById("publicationDate").value.trim();
    const genre = document.getElementById("genre").value.trim();

    clearErrors();
    let valid = true;

    if(title === ""){
        showError("title", "titleError", "Title is required");
        valid = false;
    }
    if(author === ""){
        showError("author", "authorError", "Author is required");
        valid = false;
    }
    if(isbn === ""){
        showError("isbn", "isbnError", "ISBN is required");
        valid = false;
    }    

    if(publicationDate === ""){
        showError("publicationDate", "publicationDateError", "Publication Date is required");
        valid = false;
    }

    if(genre === ""){
        showError("genre", "genreError", "Genre is required");
        valid = false;
    }
    if(!valid){
        return;
    }

    if (isNaN(isbn)){
    showError("isbn", "isbnError", "ISBN must be a number");
    return;
    }
    if (isbn.length !== 10){
        showError("isbn", "isbnError", "ISBN must be 10 digits long");
        return;
    }

    const currentYear = new Date().getFullYear();
    const publicationYear = new Date(publicationDate).getFullYear();
    const age = currentYear - publicationYear;

    if (age < 0){
        showError("publicationDate", "publicationDateError", "Publication Date cannot be in the future");
        return;
    }

    const book = {
        title,
        author,
        isbn,
        publicationDate,
        genre,
        age,
        category: "Manual Entry",
        source: "Manual Entry"
    };
    if (editIndex !== -1){
        books[editIndex] = book;
        editIndex = -1;
    }
    else{
        books.push(book);
    }

    updateDashboard();
    applyFilters();
    form.reset();
    submitBtn.textContent = "Register Book";
    clearErrors();
});

window.deleteBook = (index) => {
    if (confirm("Delete this book?")) {
        books.splice(index, 1);
        updateDashboard();
        applyFilters();
    }
};

window.editBook = (index) => {
    const book = books[index];
    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("isbn").value = book.isbn;
    document.getElementById("publicationDate").value = book.publicationDate;
    document.getElementById("genre").value = book.genre;

    editIndex = index;
    submitBtn.textContent = "Update Book";
};

const serverRequest = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Data fetched successfully");
        }, 2000);
    });
};
serverRequest()
.then(result => console.log(result))

document.getElementById("fetchBooksBtn").addEventListener("click", applyFilters);
document.getElementById("genreFilter").addEventListener("change", applyFilters);
document.getElementById("sortBooks").addEventListener("change", applyFilters);

const renderApiBook = (book) => {
    document.getElementById("apiResultList").innerHTML=`
    <div class="apiCard">
        <div class="apiInfo">
            <div class="apiId">
                ${book.id}
            </div>
            <div class="apiBookTitle">
                ${book.title}
            </div>
        </div>
        <button id="addBtn${book.id}" class="addBtn" onclick="addApiBook(${book.id})">
        + Add
        </button>
    </div>
`;
};

document.querySelectorAll("input, select").forEach(input => {
    input.addEventListener("input", () => {
        input.classList.remove("inputError");
        const errorId = input.id + "Error";
        const error = document.getElementById(errorId);
        if(error){
            error.textContent = "";
        }
    });
});

const fetchSingleBook = async () => {

    const id = document.getElementById("apiBookSearch").value;
    if(id === ""){
        alert("Please enter Book ID");
        return;
    }
    document.getElementById("apiResultList").innerHTML = `
        <p style="text-align:center;padding:20px;">
            Loading book...
        </p>
    `;

    try{
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/posts/${id}`
        );
        const data = await response.json();
        renderApiBook(data);
    }
    catch(error){
        document.getElementById("apiResultList").innerHTML = `
            <p style="color:red;text-align:center;">
                Failed to load book.
            </p>
        `;
    }
};

document.getElementById("fetchApiBooks").addEventListener("click", fetchSingleBook);
const genres = [
    "Action",
    "Adventure",
    "Comedy",
    "Historical",
    "Mystery",
    "Romance",
    "Thriller",
    "Religious",
    "Other"
];

function getRandomGenre(){
    return genres[Math.floor(Math.random() * genres.length)];
}

const authors=[
"John Smith",
"William Brown",
"Emily Davis",
"James Wilson",
"Sophia Clark",
"Olivia White",
"Noah Thomas",
"Lucas Walker"
];

function getRandomAuthor(){
return authors[Math.floor(Math.random()*authors.length)];
}

function getRandomDate(){
        const year = 2015 + Math.floor(Math.random()*11);
        const month = String(Math.floor(Math.random()*12)+1).padStart(2,"0");
        const day = String(Math.floor(Math.random()*28)+1).padStart(2,"0");               
        return `${year}-${month}-${day}`;
}


const addApiBook = async (id) => {

    const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`
    );
    const data = await response.json();
    const alreadyExists =
        books.some(book => book.title === data.title);

    if(alreadyExists){
        alert("Book already added");
        return;
    }

    const isbn = String(
        Math.floor(1000000000 + Math.random()*9000000000)
    );

    const randomGenre = getRandomGenre();
    const publicationDate = getRandomDate();
    const age =
        new Date().getFullYear() - new Date(publicationDate).getFullYear();

    books.push({
        title:data.title,
        author:getRandomAuthor(),
        isbn:isbn,
        publicationDate:publicationDate,
        genre:randomGenre,
        age:age,
        category:"API",
        source:"API"
    });

    updateDashboard();
    applyFilters();
    document.getElementById("apiResultList").innerHTML="";
    document.getElementById("apiBookSearch").value="";
};

function applyFilters() {

    let filtered = [...books];

    // Search
    const keyword = document
        .getElementById("searchBook")
        .value
        .trim()
        .toLowerCase();

    if(keyword !== ""){
        filtered = filtered.filter(book =>
            book.title.toLowerCase().includes(keyword)
        );
    }

    // Genre
    const genre = document.getElementById("genreFilter").value;

    if(genre !== ""){
        filtered = filtered.filter(book =>
            book.genre === genre
        );
    }

    const sort = document.getElementById("sortBooks").value;

    switch(sort){

        case "az":
            filtered.sort((a,b)=>
                a.title.localeCompare(b.title));
            break;

        case "za":
            filtered.sort((a,b)=>
                b.title.localeCompare(a.title));
            break;

        case "newest":
            filtered.sort((a,b)=>
                new Date(b.publicationDate) -
                new Date(a.publicationDate));
            break;

        case "oldest":
            filtered.sort((a,b)=>
                new Date(a.publicationDate) -
                new Date(b.publicationDate));
            break;
    }
    displayedBooks = filtered;
    renderBooks();
}