const express = require('express');
const router = express.Router();
const bookController = require('../Controller/Controller');

// GET /books - List all books
router.get('/', bookController.getAllBooks);

// GET /books/:id - View a single book
router.get('/:id', bookController.getBookById);

// POST /books - Add a new book
router.post('/', bookController.createBook);

// PUT /books/:id - Edit an existing book
router.put('/:id', bookController.updateBook);

// DELETE /books/:id - Remove a book
router.delete('/:id', bookController.deleteBook);

module.exports = router;