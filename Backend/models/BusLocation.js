const mongoose = require("mongoose");

const BusLocationSchema = new mongoose.Schema({
  busId: String,
  lat: Number,
  lng: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("BusLocation", BusLocationSchema);
