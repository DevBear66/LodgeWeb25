const express = require("express");
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// Fetch user's own profile
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.id !== id) return res.status(403).json({ error: "Access denied" });

        const user = await User.findById(id, "-password");
        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
