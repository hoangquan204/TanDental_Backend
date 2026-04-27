const mongoose = require("mongoose");

const sanPhamSchema = new mongoose.Schema(
    {
        tenSanPham: {
            type: String,
            required: [true, "Vui lòng nhập tên sản phẩm"],
            trim: true,
        },
        donGiaChung: {
            type: Number,
            required: [true, "Vui lòng nhập đơn giá chung"],
            min: [0, "Đơn giá chung không được nhỏ hơn 0"],
        },
        donGiaRieng: {
            type: Number,
            default: null, // Để null nếu không có giá riêng, tiện cho việc kiểm tra logic sau này
            min: [0, "Đơn giá riêng không được nhỏ hơn 0"],
        },
        loaiTinh: {
            type: String,
            enum: {
                values: ["Răng", "Răng (không đếm)", "Bán hàm", "Hàm", "Khác"],
                message: "{VALUE} không phải là loại tính hợp lệ",
            },
            required: [true, "Vui lòng chọn loại tính"],
        },
        loaiSanPham: {
            type: String,
            enum: {
                values: ["Cố định", "Miễn Phí", "Tháo Lắp"],
                message: "{VALUE} không phải là loại sản phẩm hợp lệ",
            },
            required: [true, "Vui lòng chọn loại sản phẩm"],
        },
        coMauRang: {
            type: Boolean,
            default: false,
        },
        nhomSanPham: {
            type: String,
            enum: {
                values: [
                    "Dịch vụ miễn phí",
                    "Gia Công Sườn",
                    "Report Hợp Kim",
                    "Report Toàn Sứ",
                    "Tháo Lắp",
                ],
                message: "{VALUE} không thuộc nhóm sản phẩm hợp lệ",
            },
            required: [true, "Vui lòng chọn nhóm sản phẩm"],
        },
        moTa: {
            type: String,
            trim: true,
            default: "",
        },
        loai: {
            type: String,
            enum: {
                values: ["Sản xuất", "Dịch vụ"],
                message: "{VALUE} không phải là loại hợp lệ",
            },
            required: [true, "Vui lòng chọn loại (Sản xuất hoặc Dịch vụ)"],
        },
        quyTrinhId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "QuyTrinh", // Trỏ đến Model QuyTrinh vừa tạo
            default: null,
        },
    },
    {
        timestamps: true, // Tự động thêm createdAt và updatedAt
    }
);

module.exports = mongoose.model("SanPham", sanPhamSchema);