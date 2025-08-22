const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'parent', 'driver', 'admin', 'principal'],
        required: true
    },
    // Role-specific fields
    studentDetails: {
        rollNumber: String,
        phone: String,
        parentContact: String,
        busNumber: String,
        route: String
    },
    parentDetails: {
        childRollNumber: String,
        contactNumber: String
    },
    driverDetails: {
        licenseNumber: String,
        busNumber: String,
        contactNumber: String
    },
    principalDetails: {
        officeContact: String
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
