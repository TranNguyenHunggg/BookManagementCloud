
require("dotenv").config();

const express = require("express");
const { engine } = require("express-handlebars");

const app = express();

// 1. Đọc dữ liệu từ form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Cấu hình Handlebars
app.engine(
    "handlebars",
    engine({
        defaultLayout: "main"
    })
);

app.set("view engine", "handlebars");
app.set("views", "./views");

// 3. Khai báo routes
const bookRoutes = require("./routes/bookRoutes");
app.use("/", bookRoutes);

// 4. Khởi động server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});