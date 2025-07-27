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
// src/queues/emailQueue.ts
const bullmq_1 = require("bullmq");
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// ✅ Gunakan config Redis Upstash sebagai object (bukan createClient)
const redisConnection = {
    connectionName: 'upstash',
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    tls: process.env.REDIS_USE_TLS === 'true' ? {} : undefined, // TLS aktif jika true
};
exports.emailQueue = new bullmq_1.Queue('emailQueue', {
    connection: redisConnection,
});
const transporter = nodemailer_1.default.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: Number(process.env.MAILTRAP_PORT),
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
    },
});
new bullmq_1.Worker('emailQueue', (job) => __awaiter(void 0, void 0, void 0, function* () {
    const { to, subject, name } = job.data;
    const html = yield ejs_1.default.renderFile(path_1.default.join(__dirname, '../templates/welcome-email.ejs'), { name });
    yield transporter.sendMail({
        from: `"App" <${process.env.APP_EMAIL_FROM}>`,
        to,
        subject,
        html,
    });
    console.log(`📨 Email sent to ${to}`);
}), {
    connection: redisConnection,
});
//# sourceMappingURL=emailQueue.js.map