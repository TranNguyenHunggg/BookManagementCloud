const { ReadBook, WriteBook } = require("../models/Book");

// ========================================
// BƯỚC 14: LẤY DANH SÁCH SÁCH
// ========================================
const getBooks = async (req, res) => {
    try {
        const books = await ReadBook.find();

        // Tính VAT từ chữ số cuối MSSV
        const mssv = process.env.MSSV;
        const lastDigit = Number(mssv.slice(-1));
        const vat = lastDigit + 6;

        res.render("home", {
            books: books,
            fullName: process.env.FULL_NAME,
            mssv: mssv,
            vat: vat
        });

    } catch (error) {
        console.error("Lỗi khi lấy danh sách sách:", error);
        res.status(500).send("Không thể lấy danh sách sách");
    }
};


// ========================================
// BƯỚC 17: THÊM SÁCH + TÍNH VAT
// ========================================
const addBook = async (req, res) => {
    try {
        const { productCode, name, price } = req.body;

        // Lấy MSSV từ biến môi trường
        const mssv = process.env.MSSV;

        // Lấy 3 số cuối MSSV
        const prefix = mssv.slice(-3);

        // ========================================
        // KIỂM TRA MÃ SẢN PHẨM
        // ========================================
        if (!productCode.startsWith(prefix)) {
            return res.status(400).send(
                `Mã sản phẩm phải bắt đầu bằng ${prefix}`
            );
        }

        // ========================================
        // TÍNH VAT
        // ========================================

        // Lấy chữ số cuối MSSV
        const lastDigit = Number(mssv.slice(-1));

        // VAT = chữ số cuối MSSV + 6
        const vat = lastDigit + 6;

        // ========================================
        // TÍNH GIÁ SAU THUẾ
        // ========================================

        const priceNumber = Number(price);

        const priceAfterTax =
            priceNumber * (1 + vat / 100);

        // ========================================
        // LƯU VÀO MONGODB
        // ========================================

        const book = new WriteBook({
            productCode: productCode,
            name: name,
            price: priceNumber,
            priceAfterTax: priceAfterTax
        });

        await book.save();

        res.redirect("/books");

    } catch (error) {
        console.error("Lỗi khi thêm sách:", error);
        res.status(500).send("Không thể thêm sách");
    }
};


// ========================================
// EXPORT
// ========================================
module.exports = {
    getBooks,
    addBook
};