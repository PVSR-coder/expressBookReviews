const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.some(user => user.username === username);
  };
  
  const authenticatedUser = (username, password) => {
    return users.some(
      user => user.username === username && user.password === password
    );
  };
  

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    // Check if username or password missing
    if (!username || !password) {
      return res.status(400).json({ message: "Username or password missing" });
    }
  
    // Authenticate user
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign(
        { username: username },
        "fingerprint_customer",
        { expiresIn: '1h' }
      );
  
      // Save token in session
      req.session.authorization = {
        accessToken
      };
  
      return res.status(200).json({ message: "User successfully logged in" });
    } else {
      return res.status(401).json({ message: "Invalid login credentials" });
    }
  });
  

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
  
    if (!review) {
      return res.status(400).json({ message: "Review is missing" });
    }
  
    const username = req.session.authorization?.accessToken
      ? jwt.verify(req.session.authorization.accessToken, "fingerprint_customer").username
      : null;
  
    if (!username) {
      return res.status(401).json({ message: "User not authenticated" });
    }
  
    if (books[isbn]) {
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review added/updated successfully" });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });

  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
  
    // Get username from session JWT
    const username = req.session.authorization?.accessToken
      ? jwt.verify(req.session.authorization.accessToken, "fingerprint_customer").username
      : null;
  
    if (!username) {
      return res.status(401).json({ message: "User not authenticated" });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if user has a review
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "No review found for this user" });
    }
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
