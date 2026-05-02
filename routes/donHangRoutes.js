const express = require("express");
const router = express.Router();
const donHangController = require("../controllers/donHangController");


router.post("/", donHangController.createDonHang);
router.get("/", donHangController.getAllDonHang);
router.get("/:id", donHangController.getDonHangById);

module.exports = router;