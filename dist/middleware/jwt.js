"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
dotenv_1.default.config();
const getToken = (authHeader) => {
    const splitHeader = authHeader.split(" ");
    return splitHeader.length > 1 ? splitHeader[1] : splitHeader[0];
};
const authorized = async (authorization) => {
    if (!authorization || typeof authorization !== "string")
        return null;
    try {
        const token = getToken(authorization);
        const secretKey = process.env.JWT_SECRET_KEY || "defaultSecretKey";
        const payload = jsonwebtoken_1.default.verify(token, secretKey);
        const user = await database_1.prismaClient.user.findUnique({ where: { id: payload.id } });
        if (!user)
            return null;
        return {
            id: user.id,
            username: user.username,
            role: user.role,
        };
    }
    catch {
        return null;
    }
};
const allowRoles = (roles) => {
    return async (req, res, next) => {
        try {
            const user = await authorized(req.headers.authorization);
            if (!user)
                throw new response_error_1.ResponseError(401, "Unauthorized");
            if (!roles.includes(user.role)) {
                throw new response_error_1.ResponseError(403, "Forbidden: Access denied");
            }
            req.user = user;
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
const allowAdmin = allowRoles(['ADMIN']);
const allowAll = allowRoles(['USER', 'ADMIN']);
exports.default = { allowRoles, allowAdmin, allowAll };
//# sourceMappingURL=jwt.js.map