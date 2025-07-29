"use strict";
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
dotenv_1.default.config();
// ✅ Redis Upstash connection
const redisConnection = {
    connectionName: 'upstash',
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    tls: process.env.REDIS_USE_TLS === 'true' ? {} : undefined,
};
// ✅ Buat Queue
exports.emailQueue = new bullmq_1.Queue('emailQueue', {
    connection: redisConnection,
});
// ✅ Setup transporter berdasar NODE_ENV
const transporter = (() => {
    if (process.env.NODE_ENV === 'production') {
        return nodemailer_1.default.createTransport({
            service: 'gmail', // gunakan Gmail langsung
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASS, // App password dari Gmail
            },
        });
    }
    else {
        // default Mailtrap untuk dev
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
// ✅ Worker
new bullmq_1.Worker('emailQueue', async (job) => {
    const { to, subject, name } = job.data;
    const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, '../templates/welcome-email.ejs'), { name });
    await transporter.sendMail({
        from: `"App 👋" <${process.env.APP_EMAIL_FROM}>`,
        to,
        subject,
        html,
    });
    console.log(`📨 Email sent to ${to}`);
}, {
    connection: redisConnection,
});
//# sourceMappingURL=emailQueue.js.map