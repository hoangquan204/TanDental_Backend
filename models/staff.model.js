const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const nhanVienSchema = mongoose.Schema({
    MSNV: { type: String, unique: true, required: true },
    HoTenNV: { type: String, required: true },
    Password: { type: String, required: true },
    ChucVu: { type: String, required: true },
    DiaChi: { type: String, required: true },
    SoDienThoai: { type: String, required: true }
});

nhanVienSchema.pre('save', function (next) {
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

const NHANVIEN = mongoose.model('NHANVIEN', nhanVienSchema);

module.exports = NHANVIEN;