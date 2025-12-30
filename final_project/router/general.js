const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');



public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    // Check if username or password is missing
    if (!username || !password) {
      return res.status(400).json({ message: "Username or password missing" });
    }
  
    // Check if user already exists
    if (isValid(username)) {
      return res.status(409).json({ message: "User already exists" });
    }
  
    // Register new user
    users.push({ username: username, password: password });
    return res.status(200).json({ message: "User successfully registered" });
  });
  

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});
// Task 10: Get all books using async/await with Axios
public_users.get('/async/books', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:5000/');
      return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books" });
    }
  });

  // Task 11: Get book details by ISBN using async/await with Axios
public_users.get('/async/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
  
    try {
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  // Task 12: Get book details by Author using async/await with Axios
public_users.get('/async/author/:author', async (req, res) => {
    const author = req.params.author;
  
    try {
      const response = await axios.get(
        `http://localhost:5000/author/${encodeURIComponent(author)}`
      );
      return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
      return res.status(404).json({ message: "No books found for this author" });
    }
  });

  // Task 13: Get book details by Title using async/await with Axios
public_users.get('/async/title/:title', async (req, res) => {
    const title = req.params.title;
  
    try {
      const response = await axios.get(
        `http://localhost:5000/title/${encodeURIComponent(title)}`
      );
      return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
      return res.status(404).json({ message: "No books found with this title" });
    }
  });
  
  
  
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    if (books[isbn]) {
      return res.status(200).send(JSON.stringify(books[isbn], null, 4));
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  
  
  public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    let result = [];
  
    for (let key in books) {
      if (books[key].author.toLowerCase() === author) {
        result.push(books[key]);
      }
    }
  
    if (result.length > 0) {
      return res.status(200).send(JSON.stringify(result, null, 4));
    } else {
      return res.status(404).json({ message: "No books found for this author" });
    }
  });
  

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    let result = [];
  
    for (let key in books) {
      if (books[key].title.toLowerCase() === title) {
        result.push(books[key]);
      }
    }
  
    if (result.length > 0) {
      return res.status(200).send(JSON.stringify(result, null, 4));
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
  });
  

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    if (books[isbn]) {
      return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  

module.exports.general = public_users;
