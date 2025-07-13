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
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../application/database");
class PersonService {
    constructor() { }
    get(request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const page = (_a = request.page) !== null && _a !== void 0 ? _a : 1;
            const size = (_b = request.size) !== null && _b !== void 0 ? _b : 10;
            const skip = (parseInt(page) - 1) * parseInt(size);
            const filters = [];
            if (request.fullName) {
                filters.push({
                    fullName: {
                        contains: request.fullName,
                        mode: "insensitive",
                    },
                });
            }
            if (request.position) {
                filters.push({
                    position: {
                        equals: request.position,
                    },
                });
            }
            if (request.status) {
                filters.push({
                    status: {
                        equals: request.status,
                    },
                });
            }
            let orders = {
                [request.orderBy || "createdAt"]: request.sortBy || "desc",
            };
            const person = yield database_1.prismaClient.person.findMany({
                orderBy: orders,
                where: {
                    AND: filters
                },
                include: {
                    user: true
                },
                take: parseInt(size),
                skip: skip,
            });
            const totalItems = yield database_1.prismaClient.person.count({
                where: {
                    AND: filters
                }
            });
            return {
                data: person,
                paging: {
                    page: page,
                    total_item: totalItems,
                    total_page: Math.ceil(totalItems / parseInt(size)),
                },
            };
        });
    }
    create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt_1.default.hash(request.password, 10);
            yield database_1.prismaClient.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const user = yield tx.user.create({
                    data: {
                        username: request.username,
                        password: hashedPassword,
                        role: request.role,
                        person: {
                            create: {
                                fullName: request.fullName,
                                email: request.email,
                                position: request.position,
                                category: request.category,
                                phoneNumber: request.phoneNumber,
                                address: request.address,
                                photo: request.photo,
                                startDate: (_a = new Date(request.startDate)) !== null && _a !== void 0 ? _a : null,
                                endDate: (_b = new Date(request.endDate)) !== null && _b !== void 0 ? _b : null,
                                status: request.status,
                            },
                        },
                    },
                    include: {
                        person: true,
                    },
                });
                return user;
            }));
        });
    }
}
exports.default = PersonService;
//# sourceMappingURL=PersonService.js.map