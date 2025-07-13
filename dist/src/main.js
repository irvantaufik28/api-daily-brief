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
// src/main.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const logging_1 = require("./application/logging");
const error_middleware_1 = require("./middleware/error-middleware");
const client_1 = require("@prisma/client");
const routes_1 = __importDefault(require("./routes/routes"));
const api = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const prisma = new client_1.PrismaClient();
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.$connect();
        console.log('Prisma connected successfully!');
    }
    catch (error) {
        console.error('Prisma connection error:', error);
    }
    finally {
        yield prisma.$disconnect();
    }
}))();
api.use((0, cors_1.default)({ origin: "*" }));
api.use(express_1.default.json());
api.use(express_1.default.urlencoded({ extended: true }));
api.use('/api/v1', routes_1.default);
api.get('/', (req, res) => {
    logging_1.logger.info('Test route accessed');
    res.send('Hello from Express with TypeScript!');
});
api.use(error_middleware_1.errorMiddleware);
api.listen(PORT, () => {
    logging_1.logger.info(`Server running at http://localhost:${PORT}`);
});
//# sourceMappingURL=main.js.map