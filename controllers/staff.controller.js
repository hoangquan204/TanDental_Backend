const NHANVIEN = require('../models/staff.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const NGUOIDUNG = require('../models/user.model');
dotenv.config();

// Lấy danh sách nhân viên
exports.getAllStaff = async (req, res) => {
    try {
        const staffList = await NHANVIEN.find();
        // Kiểm tra nhân viên đang đăng nhập (từ middleware verifyToken)
        const currentStaff = req.staff ? await NHANVIEN.findById(req.staff.id) : null;

        res.json({ staffList, currentStaff });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách nhân viên!', error: error.message });
    }
};

//  Lấy nhân viên theo id
exports.getStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await NHANVIEN.findById(id);
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy nhân viên', error });
    }
};

// Thêm nhân viên mới
exports.createStaff = async (req, res) => {
    try {
        const { MSNV, HoTenNV, Password, ChucVu, DiaChi, SoDienThoai } = req.body;
        const newStaff = new NHANVIEN({ MSNV, HoTenNV, Password, ChucVu, DiaChi, SoDienThoai });
        await newStaff.save();
        res.status(201).json({ message: 'Thêm nhân viên thành công', staff: newStaff });
    } catch (error) {
        res.status(500).json({
        message: 'Lỗi khi thêm nhân viên',
        error: error.message
    });
    }
};

// Cập nhật nhân viên
exports.updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = req.body;

        if (updateData.Password) {
            const salt = await bcrypt.genSalt(10);
            updateData.Password = await bcrypt.hash(updateData.Password, salt);
        }

        const updatedStaff = await NHANVIEN.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedStaff) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
        res.status(200).json({ message: 'Cập nhật nhân viên thành công', staff: updatedStaff });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật nhân viên', error: error.message });
    }
};


// Xóa nhân viên
exports.deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStaff = await NHANVIEN.findByIdAndDelete(id);
        if (!deletedStaff) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
        res.status(200).json({ message: 'Xóa nhân viên thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa nhân viên', error: error.message });
    }
};

exports.blockUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await NGUOIDUNG.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
        }
        user.TrangThai = 'Inactive';
        await user.save();
        res.json({ message: 'Khóa người dùng thành công!' });
    }catch (error) {
        res.status(500).json({ message: 'Lỗi server! ', error: error.message });
    }
};

exports.unblockUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await NGUOIDUNG.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
        }
        user.TrangThai = 'Active';
        await user.save();
        res.json({ message: 'Mở khóa người dùng thành công!' });
    }catch (error) {
        res.status(500).json({ message: 'Lỗi server!', error: error.message });
    }
};

// Đăng nhập
exports.loginStaff = async (req, res) => {
    const { MSNV, Password } = req.body;

    try {
        const staff = await NHANVIEN.findOne({ MSNV });
        if (!staff) return res.status(404).json({ message: 'Mã nhân viên không tồn tại' });

        const isMatch = await bcrypt.compare(Password, staff.Password);
        if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu' });

        const token = jwt.sign(
            { id: staff._id, MSNV: staff.MSNV, vaiTro: "staff" },
            process.env.SECRET_KEY,
            { expiresIn: '3h' }
        );

        res.status(200).json({ message: 'Đăng nhập thành công', token });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ:', error, error: error.message });
    }
};