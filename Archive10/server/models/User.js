const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /^\S+@\S+\.\S+$/ }, // Email validation
    password: { type: String, default: null }, // Password is hashed if set
    role: { type: String, enum: ["bigadmin", "admin", "user"], required: true },
    code: { type: String, default: null }, // First-time code
    contactInfo: {
        phone: { type: String, match: /^\+?\d{7,15}$/ }, // Phone validation
        address: String,
    },
    personalDetails: {
        dateOfBirth: Date,
        pronouns: String,
        emergencyContact: {
            name: String,
            phone: { type: String, match: /^\+?\d{7,15}$/ },
            relation: String,
        },
    },
    progression: {
        initiationDate: Date,
        currentDegree: {
            type: String,
            enum: ["Entered Apprentice", "Fellow Craft", "Master Mason"],
            default: "Entered Apprentice",
        },
        positionsHeld: [String],
    },
    lodgeDetails: {
        lodgeName: String,
        lodgeNumber: String,
        membershipStatus: {
            type: String,
            enum: ["active", "resigned", "honorary"],
            default: "active",
        },
    },
    notes: String, // For additional information or observations
    createdAt: { type: Date, default: Date.now }, // Automatically tracks when the user was created
    updatedAt: { type: Date, default: null }, // Tracks updates
    history: [
        {
            field: String,
            oldValue: mongoose.Schema.Types.Mixed,
            newValue: mongoose.Schema.Types.Mixed,
            updatedAt: { type: Date, default: Date.now },
        },
    ],
});

module.exports = mongoose.model("User", UserSchema);

