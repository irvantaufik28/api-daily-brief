"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/main.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const logging_1 = require("./application/logging");
const error_middleware_1 = require("./middleware/error-middleware");
const client_1 = require("@prisma/client");
const routes_1 = __importDefault(require("./routes/routes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const api = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const prisma = new client_1.PrismaClient();
async function startServer() {
    try {
        await prisma.$connect();
        console.log('✅ Prisma connected');
        // Middleware
        api.use((0, cors_1.default)({ origin: "*" }));
        api.use(express_1.default.json());
        api.use(express_1.default.urlencoded({ extended: true }));
        // API routes
        api.use('/api/v1', routes_1.default);
        api.get('/', (req, res) => {
            logging_1.logger.info('Test route accessed');
            res.send('Hello from Express with TypeScript!');
        });
        api.use(error_middleware_1.errorMiddleware);
        // Start server
        api.listen(PORT, () => {
            logging_1.logger.info(`🚀 Server running at http://localhost:${PORT}`);
            console.log(`🧭 Queue dashboard: http://localhost:${PORT}/admin/queues`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=main.js.map