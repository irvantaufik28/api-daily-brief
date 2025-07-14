"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateAccessToken = (data) => {
    const user_data = {
        id: data.id,
        username: data.username,
        role: data.role,
    };
    const secretKey = process.env.JWT_SECRET_KEY || "defaultSecretKey";
    const accessToken = jsonwebtoken_1.default.sign(user_data, secretKey, { expiresIn: "6h" });
    return accessToken;
};
exports.generateAccessToken = generateAccessToken;
const getToken = (authHeader) => {
    const splitHeader = authHeader.split(' ');
    return splitHeader.length > 1 ? splitHeader[1] : splitHeader[0];
};
exports.getToken = getToken;
//# sourceMappingURL=generate-token.js.map