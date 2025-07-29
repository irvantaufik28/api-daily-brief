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
exports.emailQueue = void 0;
const bullmq_1 = require("bullmq");
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const juice_1 = __importDefault(require("juice"));
const database_1 = require("../application/database");
dotenv_1.default.config();
const isProd = process.env.NODE_ENV === 'production';
const redisConnection = isProd
    ? {
        connectionName: 'upstash',
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        tls: process.env.REDIS_USE_TLS === 'true' ? {} : undefined,
    }
    : {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number(process.env.REDIS_PORT || 6379),
        password: process.env.REDIS_PASSWORD,
    };
exports.emailQueue = new bullmq_1.Queue('emailQueue', {
    connection: redisConnection,
});
const transporter = (() => {
    if (process.env.NODE_ENV === 'production') {
        console.log('📦 Using Gmail transporter');
        return nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASS,
            },
        });
    }
    else {
        console.log("🔧 Mailtrap config:", {
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            user: process.env.MAILTRAP_USER,
        });
        return nodemailer_1.default.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: Number(process.env.MAILTRAP_PORT),
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS,
            },
        });
    }
})();
new bullmq_1.Worker('emailQueue', (job) => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.prismaClient.reportProject.update({
        where: { id: job.data.reports.reportDetailId },
        data: {
            emailStatus: "SUCCESS"
        },
    });
    const { to, subject, reports } = job.data;
    try {
        const html = yield ejs_1.default.renderFile(path_1.default.join(__dirname, '../templates/welcome-email.ejs'), { reports });
        const inlinedHtml = (0, juice_1.default)(html);
        const info = yield transporter.sendMail({
            from: `<${process.env.APP_EMAIL_FROM}>`,
            to,
            subject,
            html: inlinedHtml
        });
        console.log(`✅ Email sent to ${to}, messageId: ${info.messageId}`);
    }
    catch (error) {
        yield database_1.prismaClient.reportProject.update({
            where: { id: job.data.reports.reportDetailId },
            data: {
                emailStatus: "FAILED"
            },
        });
        console.error("❌ Failed to send email:", error);
    }
}), {
    connection: redisConnection,
});
//# sourceMappingURL=emailQueue.js.map