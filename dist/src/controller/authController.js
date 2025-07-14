"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
const generate_token_1 = require("../utils/generate-token");
const bcrypt_1 = __importDefault(require("bcrypt"));
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield database_1.prismaClient.user.findFirst({
            where: {
                username: req.body.username
            }
        });
        if (!user) {
            throw new response_error_1.ResponseError(404, "username or passwod wrong!");
        }
        const verifyPassword = yield bcrypt_1.default.compare(req.body.password, user.password);
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
});
exports.default = {
    login
};
//# sourceMappingURL=authController.js.map