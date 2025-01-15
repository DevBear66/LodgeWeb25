const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: null }, // Password is hashed
    role: { type: String, enum: ["admin", "user"], required: true },
    code: { type: String, default: null }, // First-time code
    contactInfo: {
        phone: String,
        address: String,
    },
    progression: {
        initiationDate: Date,
        currentDegree: { type: String, enum: ["Entered Apprentice", "Fellowcraft", "Master Mason"] },
        positionsHeld: [String],
    },
    lodgeDetails: {
        lodgeName: String,
        lodgeNumber: String,
        membershipStatus: { type: String, enum: ["active", "resigned", "honorary"] },
    },
    notes: String,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
