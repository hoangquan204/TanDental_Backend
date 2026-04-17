const NguoiLienHe = require("../models/NguoiLienHe");

exports.createNguoiLienHe = async (req, res) => {
  try {
    const data = await NguoiLienHe.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllNguoiLienHe = async (req, res) => {
  try {
    const data = await NguoiLienHe.find().populate("nhaKhoa");
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};