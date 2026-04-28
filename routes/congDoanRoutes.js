const express = require("express");
const router = express.Router();

// Import controller mới (đã đổi tên từ quyTrinh sang congDoan)
const {
    createCongDoan,
    getAllCongDoan,
    // Nếu bạn có update hoặc delete cho danh mục công đoạn thì thêm vào đây
    deleteCongDoan,
} = require("../controllers/congDoanController");

const { verifyToken } = require("../middleware/authMiddleware");

// Lấy danh sách tất cả công đoạn trong kho để hiển thị ở cột bên trái (Frontend)
router.get("/", verifyToken, getAllCongDoan);

// Thêm một công đoạn mới vào kho dữ liệu
router.post("/", verifyToken, createCongDoan);

// Xóa công đoạn khỏi kho
router.delete("/:id", verifyToken, deleteCongDoan);

module.exports = router;