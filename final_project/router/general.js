const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "Customer already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register customer." });
});

public_users.get('/allbooks', function (req, res) {
  return res.send(books);
});

const fetchBooksFromAPI = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:5000/allbooks')
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const response = await fetchBooksFromAPI();
    return res.send(response);
  } catch (error) {
    return res.status(500).send('Error fetching books from API');
  }
  // res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/bookbyisbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn]);
});

const fetchBookByIdFromAPI = (isbn) => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:5000/bookbyisbn/' + isbn)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const response = await fetchBookByIdFromAPI(req.params.isbn);
    return res.send(response);
  } catch (error) {
    return res.status(500).send('Error fetching book by isbn from API');
  }
});

// Get book details based on author
public_users.get('/bookbyauthor/:author', function (req, res) {
  const author = req.params.author;
  let obj = null;
  for (const key in books) {
    if (Object.prototype.hasOwnProperty.call(books, key)) {
      const element = books[key];
      if (element.author === author) {
        obj = element;
        break;
      }
    }
  }
  if (obj) {
    return res.send(obj);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

const fetchBookByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:5000/bookbyauthor/' + author)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};
public_users.get('/author/:author', async function (req, res) {
  try {
    const response = await fetchBookByAuthor(req.params.author);
    return res.send(response);
  } catch (error) {
    return res.status(500).send('Error fetching book by author from API');
  }
});

// Get all books based on title
public_users.get('/bookbytitle/:title', function (req, res) {
  const title = req.params.title;
  let obj = null;
  for (const key in books) {
    if (Object.prototype.hasOwnProperty.call(books, key)) {
      const element = books[key];
      if (element.title === title) {
        obj = element;
        break;
      }
    }
  }
  if (obj) {
    return res.send(obj);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

const fetchBookByTitle = (title) => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:5000/bookbytitle/' + title)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};
public_users.get('/title/:title', async function (req, res) {
  try {
    const response = await fetchBookByTitle(req.params.title);
    return res.send(response);
  } catch (error) {
    return res.status(500).send('Error fetching book by title from API');
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
