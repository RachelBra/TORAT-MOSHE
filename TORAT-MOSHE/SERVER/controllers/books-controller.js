const db = require('../models/index');
const Book = db.books;
const base64toFile = require('node-base64-to-file');
const path = require("path")
const { v4: uuid } = require("uuid")


class BooksController {
    getAllBooks = async (req, res) => {
        const obj = await Book.findAll();
        if (obj)
            return res.status(201).json(obj)
        return res.status(404).json({ message: 'error' })
    }

    getBookById = async (req, res) => {
        const obj = await Book.findOne({ where: { id: req.params.id } });
        if (obj) {
            const book = {
                image_path: fs.readFileSync(obj.image_path, { encoding: 'base64' }),
                transcription: obj.transcription,
                name: obj.name
            }
            return res.status(201).json({ book })
        }
        return res.status(404).json({ message: 'error' })
    }

    getAllDescription = async (req, res) => {
        const obj = await Book.findAll({ attributes: ["name", "description"] });// name too?!
        if (obj)
            return res.status(201).json(obj)
        return res.status(404).json({ message: 'error' })
    }

    updatePrice = async (req, res) => {
        await Book.update({ "price": req.params.price }, {
            where: { id: req.params.id }
        });
        const obj = await Book.findOne({ where: { id: req.params.id } });
        if (obj && obj.pr == req.params.path_id)
            return res.status(201).json({ message: "price is updated" })
        return res.status(404).json({ message: 'error' })
    }

    addBook = async (req, res) => {
        let imagePath = ""
        const folder = path.join(__dirname, "..", "public", "images")
        const filename = `${uuid()}`
        const fileUrl = `${folder}\\${filename}.png`

        const base64String = req.body.image_path;

        try {
            imagePath = await base64toFile(base64String, { filePath: folder, fileName: filename, types: ['png'], fileMaxSize: 3145728 });
        }
        catch (error) {
            return res.status(400).json({ message: 'error occured while loading image' })
        }

        const obj = await Book.create({image_path: fileUrl ,description: req.body.description , name: req.body.name });
        if (obj)
            return res.status(201).json(obj)
        return res.status(507).json({ message: "not success" })
    }

    deleteBook = async (req, res) => {
        await Book.destroy({
            where: { id: req.params.id }
        })
        const check = await Book.findAll({ where: { id: req.params.id } });
        if (!check.length)
            return res.status(201).json({ message: 'book is deleted' })
        return res.status(404).json({ message: 'error' })

    }
}
const booksController = new BooksController();
module.exports = booksController;