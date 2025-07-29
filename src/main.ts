// src/main.ts
import express from 'express';
import cors from 'cors';
import { logger } from "./application/logging";
import { errorMiddleware } from "./middleware/error-middleware";
import { PrismaClient } from "@prisma/client";
import router from './routes/routes';
import dotenv from 'dotenv';
import path from 'path';
import { prismaClient } from './application/database';

dotenv.config();

const api = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Prisma connected');

    // Middleware
    api.use(cors({ origin: "*" }));
    api.use(express.json());
    api.use(express.urlencoded({ extended: true }));

    // API routes
    api.use('/api/v1', router);

    // api.get('/', (req, res) => {
    //   logger.info('Test route accessed');
    //   res.send('Hello from Express with TypeScript!');
    // });

    api.set('view engine', 'ejs');
    api.set('views', path.join(__dirname, 'templates'));

    // // Route untuk tampilkan invoice
    // api.get('/', async (req, res) => {

    //   const data = await prismaClient.reportProject.findUnique({
    //     where: { id: 6 },
    //     include: {
    //       project: {
    //         include: {
    //           company: true,
    //         },
    //       },
    //       person: true,
    //       ReportDetail: true,
    //     },
    //   });

    //   if (!data) {
    //     return
    //   }
    //   res.render('welcome-email', {
    //     reports: {
    //       fullName: data.person.fullName,
    //       email: data.person.email,
    //       phone: data.person.phoneNumber,
    //       reportDetailId: data.id,
    //       reportDate: data.reportDate
    //         ? new Intl.DateTimeFormat("id-ID", {
    //           day: "numeric",
    //           month: "long",
    //           year: "numeric",
    //         }).format(new Date(data.reportDate))
    //         : "Tanggal tidak tersedia",

    //       projectOwner: data.project.company.name,
    //       projectDescription: data.project.title,
    //       items: data.ReportDetail
    //     }
    //   });
    // });


    api.use(errorMiddleware);

    // Start server
    api.listen(PORT, () => {
      logger.info(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`🧭 Queue dashboard: http://localhost:${PORT}/admin/queues`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();