const NhaKhoa = require("../models/NhaKhoa");

exports.createNhaKhoa = async (req, res) => {
  try {
    const data = await NhaKhoa.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllNhaKhoa = async (req, res) => {
  try {
    const data = await NhaKhoa.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};