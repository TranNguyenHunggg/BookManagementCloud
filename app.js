// ==========================================
// 1. LOAD ENVIRONMENT VARIABLES
// ==========================================
require("dotenv").config();


// ==========================================
// 2. IMPORT LIBRARIES
// ==========================================
const express = require("express");
const { engine } = require("express-handlebars");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;


// ==========================================
// 3. CREATE EXPRESS APP
// ==========================================
const app = express();


// ==========================================
// 4. MIDDLEWARE
// ==========================================

// Cho phép Express đọc JSON
app.use(express.json());

// Cho phép Express đọc dữ liệu từ HTML form
app.use(express.urlencoded({ extended: true }));


// ==========================================
// 5. HANDLEBARS CONFIGURATION
// ==========================================

app.engine(
    "handlebars",
    engine({
        defaultLayout: "main"
    })
);

app.set("view engine", "handlebars");

app.set("views", "./views");


// ==========================================
// 6. SESSION CONFIGURATION
// ==========================================

// Session được lưu trên MongoDB Atlas
// thay vì lưu trong RAM của server.

app.use(
    session({
        name: "book.sid",

        // Secret dùng để ký session
        secret: process.env.SESSION_SECRET,

        // Không lưu lại session nếu không có thay đổi
        resave: false,

        // Không tạo session rỗng
        saveUninitialized: false,

        // Lưu session vào MongoDB
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_SESSION_URI,
            collectionName: "sessions",

            // Session hết hạn sau 1 giờ
            ttl: 60 * 60
        }),

        // Cookie chứa session ID
        cookie: {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        }
    })
);


// ==========================================
// 7. BOOK ROUTES
// ==========================================

const bookRoutes = require("./routes/bookRoutes");

app.use("/", bookRoutes);


// ==========================================
// 8. HOME ROUTE
// ==========================================

// Khi truy cập:
// http://localhost:3000/
//
// chuyển sang /books

app.get("/", (req, res) => {
    res.redirect("/books");
});


// ==========================================
// 9. ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {

    console.error("Server Error:", err);

    res.status(500).send("Đã xảy ra lỗi trên server.");
});


// ==========================================
// 10. START SERVER
// ==========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("----------------------------------");
    console.log("Book Management Server");
    console.log("----------------------------------");
    console.log(`Server đang chạy tại: http://localhost:${PORT}`);
    console.log("----------------------------------");

});