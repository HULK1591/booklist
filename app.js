/******************************* BOOK CLASS ************************************ */
// Book Class: Represent a book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  } //end constructor
} //end book class

/******************************* UI CLASS ************************************ */
//UI Class: Handle UI Tasks
class UI {
  static displayBook() {
    /*
    const StoredBooks = [
      {
        title: "Book One",
        author: "Manjit Kaur",
        isbn: "34562132"
      },
      {
        title: "Book Two",
        author: "Shyam Patel",
        isbn: "451230132"
      }
    ];
    */

    //Bring in the books from dummy books above and assign them to "Books"
    //const books = StoredBooks;

    //Bring in thebooks from localStorage and assign them to "books"
    const books = Store.getBooks();

    //Loop through the each book in storage and add them to UI
    books.forEach(book => {
      UI.addBookToList(book);
    });
  } //end displayBook()

  //Add books from storage to the table
  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
  } //end addBookToList

  //Delete Book
  static deleteBook(elm) {
    //check if the targeted element has the delete class
    if (elm.classList.contains("delete")) {
      /*
        Delete the targeted element by calling its parentElement twice
        1: ParentElement would be just the button it self.
        2: Parent Element would be the row itself
    */
      elm.parentElement.parentElement.remove();
    }
  } //end deleteBook()

  //Create ShowAlert() for alert messages
  static showAlert(message, className) {
    //Create a div
    const div = document.createElement("div");
    //add a custom class to the div, based on the type of alert
    div.className = `alert alert-${className}`;
    //Add the text to the alert message
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);

    //Vanish in 3 Sec
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  } //end ShowAlert()

  //Clear All the input Fields
  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  } //end ClearFields
} //end UI class

/******************************* STORE CLASS ************************************ */
//Store Class: handles Storage
class Store {
  //Get the book from the input and add it to the local storage
  static getBooks() {
    let books;
    //Check if ther is an item in localstorage
    if (localStorage.getItem("books") === null) {
      //
      books = [];
    } else {
      //Parse via JSON parse method
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  } //end getBook()

  //Add book method for local storage
  static addBook(book) {
    //Get the book via getBook method and assign it to books variable
    const books = Store.getBooks();
    //Push method to push onto localstorage
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  } //end addBook

  //RemoveBook method for removing book from the storage
  static removeBook(isbn) {
    //Get the book via getBook method and assign it to books variable
    const books = Store.getBooks();

    //Loop through all the books to get a perticular book
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  } //end
} //end Store Class

/******************************* DISPLAY EVENT ************************************ */
//Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBook);

/******************************* ADD BOOK EVENT ************************************ */
//Event: Add a Book
//Get the form ID and add an event when "Add Book" button is clicked
document.querySelector("#book-form").addEventListener("submit", e => {
  //Prevent actual submit
  e.preventDefault();
  //Get form input values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  //Validate the fields
  if (title === "" || author === "" || isbn === "") {
    // Error message
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    //Instatiate book
    const book = new Book(title, author, isbn);

    //Add Book to UI
    UI.addBookToList(book);

    //Add book to storage
    Store.addBook(book);

    //Show Success message;
    UI.showAlert("Book Added successfully", "success");

    //Clear Fields
    UI.clearFields();
  }
});

/******************************* DELETE EVENT ************************************ */
//Event: Remove a Book
document.querySelector("#book-list").addEventListener("click", e => {
  //Remove book from UI
  UI.deleteBook(e.target);

  //Remove book from store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //Show danger message
  UI.showAlert("Book Removed", "danger");
});
