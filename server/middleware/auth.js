const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        console.error("Token missing in request");
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to the request
        console.log("Token verified:", decoded); // Debug log
        next();
    } catch (error) {
        console.error("Invalid token:", error);
        res.status(401).json({ error: "Invalid token" });
    }
};

// Middleware to check user role
const checkRole = (requiredRole) => (req, res, next) => {
    if (req.user.role !== requiredRole) {
        console.error(`Access denied: User role '${req.user.role}' does not match required role '${requiredRole}'`);
        return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
    }
    next();
};



module.exports = { verifyToken, checkRole };

