// src/main.ts
import express from 'express';
import cors from 'cors';
import { logger } from "./application/logging";
import { errorMiddleware } from "./middleware/error-middleware";
import { PrismaClient } from "@prisma/client";
import router from './routes/routes'; 

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

api.use(cors({ origin: "*" }));
api.use(express.json());
api.use(express.urlencoded({ extended: true }));


api.use('/api/v1', router);


api.get('/', (req, res) => {
    logger.info('Test route accessed');
    res.send('Hello from Express with TypeScript!');
});


api.use(errorMiddleware);

api.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}`);
});
