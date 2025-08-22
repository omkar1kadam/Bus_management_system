const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get logged-in admin profile
exports.getAdminProfile = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { name, email, role } = req.user;

        res.json({
            name,
            email,
            role
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add new user
exports.addUser = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { name, email, password, role, studentDetails, parentDetails, driverDetails } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            studentDetails: role === 'student' ? studentDetails : {},
            parentDetails: role === 'parent' ? parentDetails : {},
            driverDetails: role === 'driver' ? driverDetails : {}
        });

        await user.save();
        res.status(201).json({ message: 'User added successfully', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};



// Update user
exports.updateUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });

    const { id } = req.params;
    const updates = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Only hash password if it’s provided
    if (updates.password && updates.password.trim() !== "") {
      updates.password = await bcrypt.hash(updates.password, 10);
    } else {
      delete updates.password; // don't overwrite existing password
    }

    Object.assign(user, updates);
    await user.save();

    res.json({ message: 'User updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Delete user
// Delete user
// In your admin controller deleteUser function
// Delete user (works for students & admins)
exports.deleteUser = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Optional: prevent deleting yourself
        if (user._id.equals(req.user._id)) {
            return res.status(403).json({ message: 'You cannot delete yourself' });
        }

        // Use deleteOne instead of remove
        await User.deleteOne({ _id: id });

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};



