const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Định nghĩa schema cho độc giả (DOCGIA)
const nguoiDungSchema = new mongoose.Schema({
    TenDangNhap: { type: String, unique: true, required: true, trim: true },
    HoTen: { type: String, required: true, trim: true },
    Password: { type: String, required: true },
    DiaChi: { type: String, required: true },
    SoDienThoai: { type: String, required: true, trim: true },
    TrangThai: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, {
    timestamps: true // tự động thêm createdAt, updatedAt
});

// Mã hoá mật khẩu trước khi lưu
nguoiDungSchema.pre('save', function (next) {
    if (!this.isModified('Password')) return next();

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(this.Password, salt, (err, hash) => {
            if (err) return next(err);

            this.Password = hash;
            next();
        });
    });
});

// Phương thức so sánh mật khẩu (nếu cần đăng nhập)
nguoiDungSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.Password);
};

// Sửa lỗi OverwriteModelError bằng cách kiểm tra model đã tồn tại hay chưa
const NGUOIDUNG = mongoose.models.NGUOIDUNG || mongoose.model('NGUOIDUNG', nguoiDungSchema);

module.exports = NGUOIDUNG;
