"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
const generate_token_1 = require("../utils/generate-token");
const bcrypt_1 = __importDefault(require("bcrypt"));
const login = async (req, res, next) => {
    try {
        const user = await database_1.prismaClient.user.findFirst({
            where: {
                username: req.body.username
            }
        });
        if (!user) {
            throw new response_error_1.ResponseError(404, "username or passwod wrong!");
        }
        const verifyPassword = await bcrypt_1.default.compare(req.body.password, user.password);
        if (!verifyPassword) {
            throw new response_error_1.ResponseError(404, "username or passwod wrong!");
        }
        const user_data_token = {
            id: user.id,
            username: user.username,
            role: user.role
        };
        const token = (0, generate_token_1.generateAccessToken)(user_data_token);
        const user_data = {
            id: user.id,
            username: user.username,
            role: user.role,
            token: token,
        };
        return res.status(200).json({
            data: user_data
        });
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    login
};
//# sourceMappingURL=authController.js.map