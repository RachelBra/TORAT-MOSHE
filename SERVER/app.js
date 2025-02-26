const express = require("express");
require('dotenv').config();
const usersRouter = require("./routes/users-router");
const handwritingRouter = require("./routes/handwriting-router");
const approvalRouter = require("./routes/approvals-router");
const booksRouter = require("./routes/books-router");
const treeRouter = require("./routes/tree-router");


const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 8000

app.use(cors());
app.use(express.urlencoded())
app.use(express.json());

//middleware
app.use((req, res, next) => {
    console.log(`${req.method}-${req.url}`);
    console.log(req.body);
    next();
});

app.use("/users", usersRouter);
app.use("/handwritings", handwritingRouter);
app.use("/approvals", approvalRouter);
app.use("/books", booksRouter);
app.use("/tree", treeRouter);


app.use((req, res) => {
    res.send("404 in app");
});



app.listen(PORT, () => {
    console.log(`app running on port ${PORT}`);
});