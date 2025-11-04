const jwt = require("jsonwebtoken");
const ApiRes = require("../res/apiRes");
const { UnauthorizedError, ForbiddenError } = require("../res/AppError");

const auth = (roles = []) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                throw new UnauthorizedError("No token provided");
            }

            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            req.user = decoded;

            if (roles.length && !roles.includes(decoded.role)) {
                throw new ForbiddenError("Forbidden: insufficient rights");
            }
            
            next();
        } catch (err) {
            if (err instanceof jwt.JsonWebTokenError) {
                return ApiRes.unauthorized(res, "Invalid token");
            }
            if (err instanceof jwt.TokenExpiredError) {
                return ApiRes.unauthorized(res, "Token expired");
            }
            if (err.statusCode) {
                return ApiRes.error(res, err.message, err.statusCode);
            }
            return ApiRes.unauthorized(res, "Invalid/expired access token");
        }
    };
};

module.exports = auth;