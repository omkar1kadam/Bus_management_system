const User = require('../models/User');

// Get logged-in student profile
exports.getStudentProfile = async (req, res) => {
    try {
        // req.user is set by auth middleware
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { name, email, role, studentDetails } = req.user;

        res.json({
            name,
            email,
            role,
            studentDetails
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update student details (optional: allow updating phone or parent contact)
exports.updateStudentProfile = async (req, res) => {
    try {
        const { phone, parentContact, seatNumber } = req.body;

        if (req.user.role !== 'student') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedDetails = {
            ...req.user.studentDetails,
            phone: phone || req.user.studentDetails.phone,
            parentContact: parentContact || req.user.studentDetails.parentContact,
            seatNumber: seatNumber || req.user.studentDetails.seatNumber
        };

        req.user.studentDetails = updatedDetails;
        await req.user.save();

        res.json({ message: 'Profile updated', studentDetails: updatedDetails });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Optional: Get bus info only
exports.getBusInfo = async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { busNumber, route, seatNumber } = req.user.studentDetails;

        res.json({ busNumber, route, seatNumber });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
