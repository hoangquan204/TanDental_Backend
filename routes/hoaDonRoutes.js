const express = require("express");
const router = express.Router();
const hoaDonController = require("../controllers/hoaDonController");

// Lấy tất cả hóa đơn (Tất cả nha khoa - Admin)
router.get("/all", hoaDonController.getAllHoaDonAdmin);

// Các route cũ của bạn
router.post("/", hoaDonController.createHoaDon);
router.get("/nha-khoa/:nhaKhoaId", hoaDonController.getAllHoaDon);
router.get("/don-hang-chua-xuat/:nhaKhoaId", hoaDonController.getDonHangChuaXuatHoaDon);
router.put("/:id", hoaDonController.updateHoaDon);

module.exports = router;