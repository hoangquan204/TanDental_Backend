const QuyTrinh = require("../models/quyTrinhModel");

// Thêm quy trình mới (kèm danh sách công đoạn)
exports.createQuyTrinh = async (req, res) => {
    try {
        const data = await QuyTrinh.create(req.body);
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy danh sách tất cả quy trình (tự động sort công đoạn theo `thuTu` để Frontend dễ dùng)
exports.getAllQuyTrinh = async (req, res) => {
    try {
        const data = await QuyTrinh.find();

        // Sort các công đoạn bên trong mỗi quy trình theo đúng trường `thuTu`
        data.forEach(qt => {
            qt.danhSachCongDoan.sort((a, b) => a.thuTu - b.thuTu);
        });

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Cập nhật quy trình (Dùng để xử lý khi Frontend kéo thả xong và gửi mảng mới lên)
exports.updateQuyTrinh = async (req, res) => {
    try {
        // Khi frontend kéo thả xong, họ gửi lên req.body chứa danhSachCongDoan mới
        // Mongoose sẽ tự động ghi đè mảng cũ bằng mảng mới này
        const data = await QuyTrinh.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!data) {
            return res.status(404).json({ message: "Không tìm thấy quy trình" });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Xóa quy trình
exports.deleteQuyTrinh = async (req, res) => {
    try {
        const data = await QuyTrinh.findByIdAndDelete(req.params.id);

        if (!data) {
            return res.status(404).json({ message: "Không tìm thấy quy trình" });
        }

        res.json({ message: "Đã xóa quy trình thành công" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};