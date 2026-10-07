const { WriteBook } = require("../models/Book");

const addBook = async (req, res) => {

    const { productCode, name, price } = req.body;

    // xử lý validation

    const book = new WriteBook({
        productCode,
        name,
        price
    });

    await book.save();

    res.redirect("/books");
};