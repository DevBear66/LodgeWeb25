const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    eventDate: { type: Date, required: true },
    attendees: { type: Number, required: true },
});

module.exports = mongoose.model("Booking", bookingSchema);
