const express = require("express");
const User = require("../models/User");
const { verifyToken, checkRole } = require("../middleware/auth");

const router = express.Router();

// Get all users
router.get("/users", verifyToken, checkRole("admin"), async (req, res) => {
    try {
        const users = await User.find({}, "username email role code");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Error fetching users" });
    }
});

// Update user profile
router.put("/users/:id", verifyToken, checkRole("admin"), async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedUser) return res.status(404).json({ error: "User not found" });

        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
