const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract the token
    if (!token) {
        console.error("Token missing in request"); // Debug log
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        req.user = decoded; // Attach decoded user data (id, role) to the request
        console.log("Token verified successfully:", decoded); // Debug log
        next();
    } catch (error) {
        console.error("Token verification failed:", error.message); // Debug log
        res.status(401).json({ error: "Invalid or expired token" });
    }
};

// Middleware to check user role
const checkRole = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        console.error(
            `Access denied: User role '${req.user.role}' is not in [${roles}]`
        ); // Debug log
        return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
    }
    next();
};

module.exports = { verifyToken, checkRole };

