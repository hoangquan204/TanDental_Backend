const Staff = require("../models/Staff");
const jwt = require("jsonwebtoken");

// 🔑 Tạo JWT
const generateToken = (staff) => {
  return jwt.sign(
    {
      id: staff._id,
      MSNV: staff.MSNV,
      role: staff.ChucVu,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

// ✅ Tạo nhân viên
exports.createStaff = async (req, res) => {
  try {
    const { MSNV } = req.body;

    const exist = await Staff.findOne({ MSNV });
    if (exist) {
      return res.status(400).json({ message: "MSNV đã tồn tại" });
    }

    const staff = await Staff.create(req.body);

    res.status(201).json({
      message: "Tạo nhân viên thành công",
      staff,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔑 Đăng nhập
exports.loginStaff = async (req, res) => {
  try {
    const { MSNV, Password } = req.body;

    const staff = await Staff.findOne({ MSNV });
    if (!staff) {
      return res.status(400).json({ message: "Sai tài khoản" });
    }

    const isMatch = await staff.comparePassword(Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    const token = generateToken(staff);

    res.json({
      message: "Đăng nhập thành công",
      token,
      staff: {
        id: staff._id,
        MSNV: staff.MSNV,
        HoTenNV: staff.HoTenNV,
        ChucVu: staff.ChucVu,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📋 Lấy danh sách nhân viên
exports.getAllStaff = async (req, res) => {
  try {
    const staffs = await Staff.find().select("-Password");
    res.json(staffs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔍 Lấy 1 nhân viên
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).select("-Password");
    if (!staff) {
      return res.status(404).json({ message: "Không tìm thấy" });
    }
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Cập nhật nhân viên
exports.updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({ message: "Không tìm thấy" });
    }

    Object.assign(staff, req.body);

    // nếu đổi password → hash lại
    if (req.body.Password) {
      staff.Password = req.body.Password;
    }

    await staff.save();

    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Xóa nhân viên
exports.deleteStaff = async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};