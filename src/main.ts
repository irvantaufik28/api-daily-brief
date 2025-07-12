import express from 'express';
import cors from 'cors';
import { logger } from "./application/logging";
import { PrismaClient } from "@prisma/client";

const api = express();

const PORT = process.env.PORT || 3000;


const prisma = new PrismaClient();
(async () => {
  try {
    await prisma.$connect();
    console.log('Prisma connected successfully!');
  } catch (error) {
    console.error('Prisma connection error:', error);
  } finally {
    await prisma.$disconnect();
  }
})();

api.use(
  cors({
    origin: "*",
  })
);

api.use(express.json());
api.use(express.urlencoded({ extended: true }));

api.get('/', (req, res) => {
  logger.info('Root route accessed');
  res.send('Hello from Express with TypeScript!');
});

api.listen(PORT, () => {
  logger.info(`🚀 Server running at http://localhost:${PORT}`);
});
