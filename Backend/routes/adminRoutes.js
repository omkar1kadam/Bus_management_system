const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getAllUsers, addUser, updateUser, deleteUser } = require('../controllers/adminController');

// Only admin can access these routes
router.use(protect, authorize('admin'));

// Users CRUD
router.get('/users', getAllUsers);
router.post('/users', addUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
