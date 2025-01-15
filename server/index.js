require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // For hashing and comparing passwords
const jwt = require("jsonwebtoken"); // For token generation and verification
const Booking = require("./models/Booking");
const User = require("./models/User"); // Import User model
const { verifyToken, checkRole } = require("./middleware/auth");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// Mongoose Connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt for email: ${email}`);

        const normalizedEmail = email.toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            console.error("User not found");
            return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error("Invalid password");
            return res.status(401).json({ error: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "4h" }
        );

        console.log("Login successful");
        res.status(200).json({ message: "Login successful", token, role: user.role });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error" });
    }
});


// Create a new user with a unique code
app.post("/admin/users", verifyToken, checkRole("admin"), async (req, res) => {
    try {
        const { username, email, role } = req.body;

        // Validate role
        if (!["admin", "user"].includes(role)) {
            return res.status(400).json({ error: "Invalid role" });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }

        // Generate a unique first-time code
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();

        // Create a new user
        const newUser = new User({ username, email, role, code });
        await newUser.save();

        res.status(201).json({
            message: `User created successfully! First-Time Code: ${code}`,
            user: newUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating user" });
    }
});


app.delete("/admin/users/:id", verifyToken, checkRole("admin"), async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Update user profile (Admin only)
app.put("/admin/users/:id", verifyToken, checkRole("admin"), async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        console.log(`Updating user with ID: ${id}`, updates); // Debug log

        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedUser) {
            console.error("User not found");
            return res.status(404).json({ error: "User not found" });
        }

        console.log("Profile updated successfully", updatedUser); // Debug log
        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// First-Time Password Setup
app.post("/setup-password", async (req, res) => {
    try {
        const { code, password } = req.body;

        // Find user by code
        const user = await User.findOne({ code });
        if (!user) {
            return res.status(400).json({ error: "Invalid signup code" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user's password and clear the code
        user.password = hashedPassword;
        user.code = null;
        await user.save();

        res.status(200).json({ message: "Password setup successful!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});


// User Login
app.get("/user/profile", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id, "-password"); // Exclude password
        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/user/profile/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`Fetching profile for user ID: ${id}`);
        const user = await User.findById(id, "-password");
        if (!user) {
            console.error("User not found");
            return res.status(404).json({ error: "User not found" });
        }

        console.log("Profile fetched successfully", user);
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Update user profile (User-specific)
app.put("/user/profile/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        // Allow updates only if the user is editing their own profile
        if (req.user.id !== id) {
            console.error("Forbidden: User attempting to update another user's profile");
            return res.status(403).json({ error: "Forbidden: Cannot update another user's profile" });
        }
        // Filter updates to allow only specific fields
        const allowedFields = ["contactInfo.phone", "contactInfo.address"];
        const filteredUpdates = {};
        Object.keys(updates).forEach((key) => {
            if (allowedFields.includes(key)) {
                filteredUpdates[key] = updates[key];
            }
        });
        if (Object.keys(filteredUpdates).length === 0) {
            console.error("No valid fields provided for update");
            return res.status(400).json({ error: "No valid fields to update" });
        }
        console.log(`User updating their profile with ID: ${id}`, filteredUpdates); // Debug log
        const updatedUser = await User.findByIdAndUpdate(id, filteredUpdates, { new: true });
        if (!updatedUser) {
            console.error("User not found");
            return res.status(404).json({ error: "User not found" });
        }
        console.log("User profile updated successfully", updatedUser); // Debug log
        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ error: "Server error" });
    }
});


// Fetch user profile by username
app.get("/user/profile/:username", verifyToken, async (req, res) => {
    try {
        const { username } = req.params;

        // Allow admins to fetch any profile
        if (req.user.role === "admin" || req.user.role === "bigadmin") {
            const user = await User.findOne({ username }, "-password");
            if (!user) {
                console.error("User not found");
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(200).json(user);
        }

        // Regular users can fetch only their own profile
        if (req.user.username !== username) {
            console.error("Access denied: User attempting to access another user's profile");
            return res.status(403).json({ error: "Access denied" });
        }

        const user = await User.findOne({ username }, "-password");
        if (!user) {
            console.error("User not found");
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ error: "Server error" });
    }
});


// Admin-Only Dashboard Route
app.get("/admin/dashboard", verifyToken, checkRole("admin"), async (req, res) => {
    try {
        res.status(200).json({ message: "Welcome to the admin dashboard!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Get all users (Admin only)
app.get("/admin/users", verifyToken, checkRole("admin"), async (req, res) => {
    try {
        console.log("Admin fetching all users");
        const users = await User.find({}, "username email role code");
        console.log("Users fetched:", users);
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Error fetching users" });
    }
});


// Create a new booking
app.post("/api/bookings", async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all bookings
app.get("/api/bookings", verifyToken, async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
