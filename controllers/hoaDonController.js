const HoaDon = require("../models/HoaDon");
const DonHang = require("../models/DonHang");
const BangGia = require("../models/bangGia");
const SanPham = require("../models/sanPham");

//Lấy danh sách đơn hàng chưa xuất hóa đơn
exports.getDonHangChuaXuatHoaDon = async (req, res) => {
  try {
    const { nhaKhoaId } = req.params;

    const donHangs = await DonHang.find({
      nhaKhoa: nhaKhoaId,
      daXuatHoaDon: { $ne: true },
    })
      .populate("benhNhan", "hoVaTen")
      .sort({ createdAt: -1 });

    res.json(donHangs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Lấy đơn giá cho từng sản phẩm
async function getDonGia(nhaKhoaId, sanPhamId) {
  const giaRieng = await BangGia.findOne({ nhaKhoaId, sanPhamId });

  if (giaRieng) return giaRieng.donGia;

  const sp = await SanPham.findById(sanPhamId);
  return sp.donGiaChung;
}
async function tinhTienDonHang(donHang, nhaKhoaId) {
  let tong = 0;

  for (const item of donHang.danhSachSanPham) {
    const donGia = await getDonGia(nhaKhoaId, item.sanPham);

    tong += donGia * item.soLuong;
  }

  return tong;
}

/* ================= TẠO HÓA ĐƠN ================= */
exports.createHoaDon = async (req, res) => {
  try {
    const { nhaKhoaId, danhSachDonHang } = req.body;

    let tongTien = 0;
    let tongChietKhau = 0;

    const resultDonHang = [];

    for (const item of danhSachDonHang) {
      const donHang = await DonHang.findById(item.donHangId);

      if (!donHang) continue;

      // 🔥 tính tiền theo bảng giá
      const tongTienDon = await tinhTienDonHang(donHang, nhaKhoaId);

      let chietKhau = item.chietKhau || 0;
      let thanhTienSauCK = tongTienDon;

      if (item.loaiChietKhau === "phanTram") {
        thanhTienSauCK = tongTienDon * (1 - chietKhau / 100);
      } else {
        thanhTienSauCK = tongTienDon - chietKhau;
      }

      tongTien += tongTienDon;
      tongChietKhau += tongTienDon - thanhTienSauCK;

      resultDonHang.push({
        donHang: donHang._id,
        tongTien: tongTienDon,
        chietKhau,
        loaiChietKhau: item.loaiChietKhau,
        thanhTienSauCK,
      });
    }

    const thanhTien = tongTien - tongChietKhau;

    // 🔢 Tạo số hóa đơn
    const count = await HoaDon.countDocuments();
    const soHoaDon = `HD${String(count + 1).padStart(5, "0")}`;

    const hoaDon = new HoaDon({
      soHoaDon,
      nhaKhoa: nhaKhoaId,
      danhSachDonHang: resultDonHang,
      tongTien,
      tongChietKhau,
      thanhTien,
    });

    await hoaDon.save();

    // 🔥 cập nhật trạng thái đơn hàng
    await DonHang.updateMany(
      { _id: { $in: danhSachDonHang.map((i) => i.donHangId) } },
      { $set: { daXuatHoaDon: true } }
    );

    res.json({ success: true, data: hoaDon });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy danh sách hóa đơn của tất cả nha khoa (Dành cho Admin)
exports.getAllHoaDonAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const { trangThai, search } = req.query;
    let query = {};

    if (trangThai) {
      query.trangThai = trangThai;
    }

    if (search) {
      query.soHoaDon = { $regex: search, $options: "i" };
    }

    const total = await HoaDon.countDocuments(query);
    
    const danhSach = await HoaDon.find(query)
      .populate("nhaKhoa", "hoVaTen tinh")
      .populate({
        path: "danhSachDonHang.donHang",
        select: "_id", // Chỉ lấy ID của đơn hàng như bạn yêu cầu
        populate: {
          path: "danhSachSanPham.sanPham",
          select: "tenSanPham", // Chỉ lấy tên sản phẩm từ model SanPham
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      results: danhSach.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: danhSach
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy danh sách hóa đơn theo nha khoa
exports.getAllHoaDon = async (req, res) => {
  try {
    const { nhaKhoaId } = req.params;
    const { search, trangThai } = req.query;

    let query = { nhaKhoa: nhaKhoaId };

    // Lọc theo trạng thái nếu có (Đã thanh toán / Chưa thanh toán)
    if (trangThai) {
      query.trangThai = trangThai;
    }

    // Tìm kiếm theo số hóa đơn nếu có
    if (search) {
      query.soHoaDon = { $regex: search, $options: "i" };
    }

    const danhSachHoaDon = await HoaDon.find(query)
      .populate("nhaKhoa", "tenNhaKhoa")
      .populate({
        path: "danhSachDonHang.donHang",
        populate: { path: "nguoiLienHe", select: "hoVaTen" }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: danhSachHoaDon.length,
      data: danhSachHoaDon
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Cập nhật hóa đơn (Ví dụ: Cập nhật trạng thái thanh toán)
exports.updateHoaDon = async (req, res) => {
  try {
    const { id } = req.params;
    const { trangThai, danhSachDonHangUpdate } = req.body;

    // 1. Tìm hóa đơn hiện tại
    let hoaDon = await HoaDon.findById(id);
    if (!hoaDon) {
      return res.status(404).json({ success: false, message: "Không tìm thấy hóa đơn" });
    }

    // 2. Nếu chỉ cập nhật trạng thái thanh toán
    if (trangThai) {
      hoaDon.trangThai = trangThai;
    }

    // 3. Nếu cần cập nhật lại chiết khấu hoặc danh sách đơn hàng (Nâng cao)
    if (danhSachDonHangUpdate) {
      // Logic tương tự như khi tạo: tính toán lại tongTien, tongChietKhau...
      // Lưu ý: Nếu xóa bớt đơn hàng khỏi hóa đơn, cần cập nhật lại daXuatHoaDon: false cho đơn hàng đó
      hoaDon.danhSachDonHang = danhSachDonHangUpdate;
      
      // Tính toán lại các con số tổng
      let moiTongTien = 0;
      let moiTongChietKhau = 0;

      hoaDon.danhSachDonHang.forEach(item => {
        moiTongTien += item.tongTien;
        moiTongChietKhau += (item.tongTien - item.thanhTienSauCK);
      });

      hoaDon.tongTien = moiTongTien;
      hoaDon.tongChietKhau = moiTongChietKhau;
      hoaDon.thanhTien = moiTongTien - moiTongChietKhau;
    }

    const updatedHoaDon = await hoaDon.save();

    res.json({
      success: true,
      message: "Cập nhật hóa đơn thành công",
      data: updatedHoaDon
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};