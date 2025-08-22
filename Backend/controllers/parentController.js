const User = require('../models/User');

// Get parent's child details
exports.getChildProfile = async (req, res) => {
    try {
        if (req.user.role !== 'parent') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const childRoll = req.user.parentDetails.childRollNumber;

        if (!childRoll) {
            return res.status(400).json({ message: 'Child roll number not set' });
        }

        // Find the student by roll number
        const child = await User.findOne({ 'studentDetails.rollNumber': childRoll, role: 'student' });

        if (!child) {
            return res.status(404).json({ message: 'Child not found' });
        }

        const { name, email, studentDetails } = child;
        res.json({ name, email, studentDetails });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Optional: update parent's contact info
exports.updateParentProfile = async (req, res) => {
    try {
        const { contactNumber } = req.body;

        if (req.user.role !== 'parent') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        req.user.parentDetails.contactNumber = contactNumber || req.user.parentDetails.contactNumber;
        await req.user.save();

        res.json({ message: 'Parent profile updated', parentDetails: req.user.parentDetails });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
