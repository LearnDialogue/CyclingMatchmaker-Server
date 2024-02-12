const { model, Schema } = require("mongoose");

const rideSchema = new Schema({
    // Fill out appropriate schema
    createdAt: String,
    setDate: String,
    location: String,
    createdAt: String
});

module.exports = model('Ride', rideSchema);