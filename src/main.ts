// src/main.ts
import express from 'express';
import cors from 'cors';
import { logger } from "./application/logging";
import { errorMiddleware } from "./middleware/error-middleware";
import { PrismaClient } from "@prisma/client";
import router from './routes/routes';
import dotenv from 'dotenv';

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

    api.get('/', (req, res) => {
      logger.info('Test route accessed');
      res.send('Hello from Express with TypeScript!');
    });

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
