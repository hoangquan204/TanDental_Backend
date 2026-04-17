const BenhNhan = require("../models/BenhNhan");

exports.createBenhNhan = async (req, res) => {
  try {
    const data = await BenhNhan.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllBenhNhan = async (req, res) => {
  try {
    const data = await BenhNhan.find().populate("nhaKhoa");
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};