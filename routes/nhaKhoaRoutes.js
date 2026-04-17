const express = require("express");
const router = express.Router();

const {
  createNhaKhoa,
  getAllNhaKhoa,
} = require("../controllers/nhaKhoaController");

const { verifyToken } = require("../middleware/authMiddleware");


router.post("/",verifyToken, createNhaKhoa);
router.get("/",verifyToken, getAllNhaKhoa);

module.exports = router;