const User = require('../models/User');

// Get driver profile + assigned bus info
exports.getDriverProfile = async (req, res) => {
    try {
        if (req.user.role !== 'driver') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { name, email, role, driverDetails } = req.user;

        // Fetch students assigned to this bus
        const students = await User.find({
            role: 'student',
            'studentDetails.busNumber': driverDetails.busNumber
        }).select('name email studentDetails');

        res.json({
            name,
            email,
            role,
            driverDetails,
            students
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Optional: update driver contact or bus info
exports.updateDriverProfile = async (req, res) => {
    try {
        const { contactNumber, busNumber } = req.body;

        if (req.user.role !== 'driver') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        req.user.driverDetails.contactNumber = contactNumber || req.user.driverDetails.contactNumber;
        req.user.driverDetails.busNumber = busNumber || req.user.driverDetails.busNumber;

        await req.user.save();

        res.json({ message: 'Driver profile updated', driverDetails: req.user.driverDetails });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
