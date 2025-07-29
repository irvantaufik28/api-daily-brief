"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EmailService_1 = require("../service/EmailService");
const sendEmail = async (req, res, next) => {
    try {
        const result = await EmailService_1.EmailService.sendEmail(req.body);
        return res.status(200).json({
            message: `Email queued (${process.env.NODE_ENV === "production" ? "Gmail" : "Mailtrap"})`,
            to: result.to
        });
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    sendEmail
};
//# sourceMappingURL=emailController.js.map