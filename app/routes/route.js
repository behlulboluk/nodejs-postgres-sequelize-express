import express from 'express';
import {
  getAllUsers,
  postUser,
  getUser,
  borrowBookFromUser,
  returnBookFromUserWithScore
} from '../controllers/users.controller';
import { getAllBooks, getBook, postBook } from '../controllers/books.controller';

let router = express.Router();

// Retrieve all users
router.get('/users', getAllUsers);

// Retrieve a single user with userId
router.get('/users/:userId', getUser);

// Create a new user
router.post('/users', postUser);

// Retrieve a single borrow a book with bookId
router.post('/users/:userId/borrow/:bookId', borrowBookFromUser);

// Retrieve a single borrow a book with bookId
router.post('/users/:userId/return/:bookId', returnBookFromUserWithScore);

// Retrieve all books
router.get('/books', getAllBooks);

// Retrieve a single book with bookId
router.get('/books/:bookId', getBook);

// Create a new book
router.post('/books', postBook);

export default router;
