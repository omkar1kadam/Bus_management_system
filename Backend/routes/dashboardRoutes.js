const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

// Example dashboard routes
router.get('/student', protect, authorize('student'), (req, res) => {
    res.json({ message: `Welcome to Student Dashboard, ${req.user.name}` });
});

router.get('/parent', protect, authorize('parent'), (req, res) => {
    res.json({ message: `Welcome to Parent Dashboard, ${req.user.name}` });
});

router.get('/driver', protect, authorize('driver'), (req, res) => {
    res.json({ message: `Welcome to Driver Dashboard, ${req.user.name}` });
});

router.get('/admin', protect, authorize('admin'), (req, res) => {
    res.json({ message: `Welcome to Admin Dashboard, ${req.user.name}` });
});

router.get('/principal', protect, authorize('principal'), (req, res) => {
    res.json({ message: `Welcome to Principal Dashboard, ${req.user.name}` });
});

module.exports = router;
