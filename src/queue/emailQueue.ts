import { Queue, Worker, Job } from 'bullmq';
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

interface EmailJob {
  to: string;
  subject: string;
  name: string;
}

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
export const emailQueue = new Queue<EmailJob>('emailQueue', {
  connection: redisConnection,
});

// ✅ Setup transporter berdasar NODE_ENV
const transporter = (() => {
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      service: 'gmail', // gunakan Gmail langsung
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS, // App password dari Gmail
      },
    });
  } else {
    // default Mailtrap untuk dev
    return nodemailer.createTransport({
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
new Worker<EmailJob>(
  'emailQueue',
  async (job: Job<EmailJob>) => {
    const { to, subject, name } = job.data;

    const html = await ejs.renderFile(
      path.join(__dirname, '../templates/welcome-email.ejs'),
      { name }
    );

    await transporter.sendMail({
      from: `"App 👋" <${process.env.APP_EMAIL_FROM}>`,
      to,
      subject,
      html,
    });

    console.log(`📨 Email sent to ${to}`);
  },
  {
    connection: redisConnection,
  }
);
