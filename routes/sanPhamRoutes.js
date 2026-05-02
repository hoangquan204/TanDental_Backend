const express = require("express");
const router = express.Router();

const {
    createSanPham,
    getAllSanPham,
    updateSanPham,
    deleteSanPham,
} = require("../controllers/sanPhamController");

const { verifyToken } = require("../middleware/authMiddleware");

// Thêm và Lấy danh sách
router.post("/", verifyToken, createSanPham);
router.get("/", verifyToken, getAllSanPham);

// Sửa và Xóa cần truyền thêm ID trên URL (ví dụ: /api/sanpham/64a1b2c3...)
router.put("/:id", verifyToken, updateSanPham);
router.delete("/:id", verifyToken, deleteSanPham);

module.exports = router;