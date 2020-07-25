import express from 'express';
// import { getAllUsers, getUser, postUser, updateUser, deleteUser } from '../controllers/controller';
import { getAllUsers, postUser, getUser, borrowBookFromUser } from '../controllers/users.controller';
import { getAllBooks, getBook, postBook } from '../controllers/books.controller';

let router = express.Router();

// Retrieve all users
router.get('/users', getAllUsers);

// Retrieve a single user with userId
router.get('/users/:userId', getUser);

// Create a new user
router.post('/users', postUser);

// Retrieve a single user with userId
router.post('/users/:userId/borrow/:bookId', borrowBookFromUser);

// Retrieve all books
router.get('/books', getAllBooks);

// Retrieve a single book with bookId
router.get('/books/:bookId', getBook);

// Create a new book
router.post('/books', postBook);

// // Update a user with userId
// router.put('/users/:userId', updateUser);

// // Delete a user with userId
// router.delete('/users/:userId', deleteUser);
export default router;
