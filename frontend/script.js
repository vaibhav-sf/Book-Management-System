const form = document.getElementById("bookForm");
const tableBody = document.querySelector("#bookTable tbody");

const books = [];
let editIndex = -1;
const getCategory = (genre) => {
    if (genre === "Religious"){
        return "Spiritual";
    }
    if (genre === "Historical"){
        return "History";
    }
    if(genre === "Action"){
        return "Entertainment";
    }
    if(genre === "Adventure"){
        return "Adventure";
    }
    if(genre === "Comedy"){
        return "Comedy";
    }
    if(genre === "Mystery"){
        return "Mystery";
    }
    if(genre === "Romance"){
        return "Romance";
    }
    if(genre === "Thriller"){
        return "Thriller";
    }
    if(genre === "Other"){
        return "Other";
    }
    return "General";
}

const renderBooks = () => {
    tableBody.innerHTML="";
    books.forEach((book, index) => {
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
            <button onClick="deleteBook(${index})">Delete</button>
            <button onClick="editBook(${index})">Edit</button>
        </td>
        `;
        tableBody.appendChild(row);
    });
};

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const isbn = document.getElementById("isbn").value;
    const publicationDate = document.getElementById("publicationDate").value;
    const genre = document.getElementById("genre").value;

    if (
        !title ||
        !author ||
        !isbn ||
        !publicationDate ||
        !genre
    ){
        alert("All fields are required");
        return;
    }
    if (isNaN(isbn)){
    alert("ISBN must be a number");
    return;
    }
    if (isbn.length !== 10){
        alert("ISBN must be 10 digits long");
        return;
    }

    const currentYear = new Date().getFullYear();
    const publicationYear = new Date(publicationDate).getFullYear();
    const age = currentYear - publicationYear;

    if (age < 0){
        alert("Publication Date cannot be in the future");
        return;
    }

    const book = {
        title,
        author,
        isbn,
        publicationDate,
        genre,
        age,
        category: getCategory(genre),
    };
    if (editIndex !== -1){
        books[editIndex] = book;
        editIndex = -1;
    }
    else{
        books.push(book);
    }
    renderBooks();
    form.reset();
});

const deleteBook = (index) => {
    books.splice(index, 1);
    renderBooks();
};

const editBook = (index) => {
    const book = books[index];
    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("isbn").value = book.isbn;
    document.getElementById("publicationDate").value = book.publicationDate;
    document.getElementById("genre").value = book.genre;

    editIndex = index;

};





