const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staff.controller');
const { verifyToken } = require('../middlewares/verifyToken');
const { verifyStaff } = require('../middlewares/auth');

router.get('/', verifyToken, staffController.getAllStaff);
router.get('/:id', staffController.getStaff);
router.post('/', staffController.createStaff);
router.put('/:id', verifyToken, staffController.updateStaff);
router.put('/block/:id', verifyToken, staffController.blockUser);
router.put('/unblock/:id', verifyToken, staffController.unblockUser);
router.delete('/:id', verifyToken, staffController.deleteStaff);
router.post('/login', staffController.loginStaff);

module.exports = router;