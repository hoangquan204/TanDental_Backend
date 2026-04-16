const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'Truy cập bị từ chối: Không có token' });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: 'Truy cập bị từ chối: Sai định dạng token' });
    }

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        req.staff = verified;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token không hợp lệ', error });
    }
};