const express = require("express");
const router = express.Router();

const {
  createBenhNhan,
  getAllBenhNhan,
} = require("../controllers/benhNhanController");

const { verifyToken } = require("../middleware/authMiddleware");


router.post("/",verifyToken, createBenhNhan);
router.get("/",verifyToken, getAllBenhNhan);

module.exports = router;