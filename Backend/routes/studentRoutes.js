const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getStudentProfile,
    updateStudentProfile,
    getBusInfo
} = require('../controllers/studentController');

// Only student can access these routes
router.use(protect, authorize('student'));

router.get('/profile', getStudentProfile);
router.put('/profile', updateStudentProfile);
router.get('/bus', getBusInfo);

module.exports = router;
