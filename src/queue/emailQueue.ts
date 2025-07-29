import { Queue, Worker, Job } from 'bullmq';
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import dotenv from 'dotenv';
import juice from 'juice';
import { prismaClient } from '../application/database';

dotenv.config();

interface EmailJob {
  to: string;
  subject: string;
  reports: any;

}
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

export const emailQueue = new Queue<EmailJob>('emailQueue', {
  connection: redisConnection,
});

const transporter = (() => {
  if (process.env.NODE_ENV === 'production') {
    console.log('📦 Using Gmail transporter');
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });
  } else {
    console.log("🔧 Mailtrap config:", {
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      user: process.env.MAILTRAP_USER,
    });

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

new Worker<EmailJob>(
  'emailQueue',
  async (job: Job<EmailJob>) => {

    await prismaClient.reportProject.update({
      where: { id: job.data.reports.reportDetailId },
      data: {
        emailStatus: "SUCCESS"
      },
    });

    const { to, subject, reports } = job.data;

    try {
      const html = await ejs.renderFile(
        path.join(__dirname, '../templates/welcome-email.ejs'),
        { reports }
      );
      const inlinedHtml = juice(html);


      const info = await transporter.sendMail({
        from: `<${process.env.APP_EMAIL_FROM}>`,
        to,
        subject,
        html: inlinedHtml
      });

      console.log(`✅ Email sent to ${to}, messageId: ${info.messageId}`);
    } catch (error) {
      await prismaClient.reportProject.update({
        where: { id: job.data.reports.reportDetailId },
        data: {
          emailStatus: "FAILED"
        },
      });

      console.error("❌ Failed to send email:", error);
    }
  },
  {
    connection: redisConnection,
  }
);