const express = require("express");
const booksController = require("../controllers/books-controller");

const booksRouter = express.Router();

booksRouter.route("/")
    .get(booksController.getAllBooks)
    .post(booksController.addBook)

booksRouter.route("/:id")
    .get(booksController.getBookById)
    .delete(booksController.deleteBook)

booksRouter.route("/:id/:price")
    .put(booksController.updatePrice)

booksRouter.route("/find")
    .get(booksController.getAllDescription)

module.exports = booksRouter;


