exports.verifyStaff = (req, res, next) => {
    if (!req.staff || req.staff.vaiTro !== "staff") {
        return res.status(403).json({ message: "Bạn không có quyền thực hiện hành động này" });
    }
    next();
};

exports.verifyUser = (req, res, next) => {
    if (!req.staff || req.staff.vaiTro !== "user") {
        return res.status(403).json({ message: "Bạn không có quyền thực hiện hành động này" });
    }
    next();
};