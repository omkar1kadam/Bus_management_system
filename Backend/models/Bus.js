const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    busNumber: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true },
    route: { type: String, required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // driver assigned
    currentLocation: {
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 }
    }
}, { timestamps: true });

module.exports = mongoose.model('Bus', busSchema);
