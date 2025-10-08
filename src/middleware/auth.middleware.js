const jwt = require("jsonwebtoken");

const auth = (roles = []) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) return res.status(401).json({ message: "No token provided" });

            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            req.user = decoded;
            console.log("Decoded user:", decoded);
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: "Forbidden: insufficient rights" });
            }
            next();
        } catch (err) {
            console.error(err);
            return res.status(401).json({ message: "Invalid/expired access token" });
        }
    };
};

module.exports = auth;