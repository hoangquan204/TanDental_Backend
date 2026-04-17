const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const staffSchema = new mongoose.Schema(
  {
    MSNV: { type: String, required: true, unique: true, index: true },
    HoTenNV: { type: String, required: true },
    Password: { type: String, required: true },
    ChucVu: { type: String, default: "Nhân viên" },
    DiaChi: String,
    SoDienThoai: String,
  },
  { timestamps: true }
);

// // 🔐 Hash password trước khi lưu
staffSchema.pre("save", async function () {
  if (!this.isModified("Password")) return;

  const salt = await bcrypt.genSalt(10);
  this.Password = await bcrypt.hash(this.Password, salt);
});

// 🔑 So sánh password
staffSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.Password);
};

module.exports = mongoose.model("Staff", staffSchema);