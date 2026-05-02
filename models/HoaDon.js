const mongoose = require("mongoose");

const hoaDonSchema = new mongoose.Schema(
  {
    soHoaDon: {
      type: String,
      unique: true,
      required: true,
    },

    nhaKhoa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NhaKhoa",
      required: true,
    },

    danhSachDonHang: [
      {
        donHang: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "DonHang",
          required: true,
        },

        tongTien: Number,

        chietKhau: {
          type: Number,
          default: 0,
        },

        loaiChietKhau: {
          type: String,
          enum: ["phanTram", "tienMat"],
          default: "tienMat",
        },

        thanhTienSauCK: Number,
      },
    ],

    tongTien: Number,
    tongChietKhau: Number,
    thanhTien: Number,

    trangThai: {
      type: String,
      enum: ["Chưa thanh toán", "Đã thanh toán"],
      default: "Chưa thanh toán",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HoaDon", hoaDonSchema);