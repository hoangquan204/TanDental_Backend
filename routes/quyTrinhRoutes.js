const express = require("express");
const router = express.Router();

const {
    createQuyTrinh,
    getAllQuyTrinh,
    updateQuyTrinh,
    deleteQuyTrinh,
} = require("../controllers/quyTrinhController");

const { verifyToken } = require("../middleware/authMiddleware");

// Các API Endpoint cho Quy Trình
router.post("/", verifyToken, createQuyTrinh);
router.get("/", verifyToken, getAllQuyTrinh);
router.put("/:id", verifyToken, updateQuyTrinh);
router.delete("/:id", verifyToken, deleteQuyTrinh);

module.exports = router;