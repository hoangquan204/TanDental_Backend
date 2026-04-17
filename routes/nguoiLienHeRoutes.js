const express = require("express");
const router = express.Router();

const {
  createNguoiLienHe,
  getAllNguoiLienHe,
} = require("../controllers/nguoiLienHeController");

const { verifyToken } = require("../middleware/authMiddleware");


router.post("/",verifyToken, createNguoiLienHe);
router.get("/",verifyToken, getAllNguoiLienHe);

module.exports = router;