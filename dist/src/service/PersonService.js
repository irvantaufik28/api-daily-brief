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
const response_error_1 = require("../error/response-error");
class PersonService {
    static get(request) {
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
            const allowedOrderFields = ["id", "fullName", "position", "status", "createdAt"];
            const orderBy = allowedOrderFields.includes(request.orderBy) ? request.orderBy : "createdAt";
            const sortBy = ["asc", "desc"].includes(request.sortBy) ? request.sortBy : "desc";
            const orders = {
                [orderBy]: sortBy
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
                persons: person,
                paging: {
                    page: page,
                    total_item: totalItems,
                    total_page: Math.ceil(totalItems / parseInt(size)),
                },
            };
        });
    }
    static getPersonNotInProject(request) {
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
            // Ambil semua personId yang sudah tergabung di project tertentu
            const assignedPerson = yield database_1.prismaClient.projectMember.findMany({
                where: {
                    projectId: parseInt(request.projectId),
                },
                select: {
                    personId: true,
                },
            });
            const excludedPersonIds = assignedPerson.map((pm) => pm.personId);
            const allowedOrderFields = ["id", "fullName", "position", "status", "createdAt"];
            const orderBy = allowedOrderFields.includes(request.orderBy) ? request.orderBy : "createdAt";
            const sortBy = ["asc", "desc"].includes(request.sortBy) ? request.sortBy : "desc";
            const orders = {
                [orderBy]: sortBy,
            };
            const persons = yield database_1.prismaClient.person.findMany({
                where: {
                    AND: [
                        ...filters,
                        {
                            id: {
                                notIn: excludedPersonIds,
                            },
                        },
                    ],
                },
                orderBy: orders,
                skip,
                take: parseInt(size),
            });
            const totalItems = yield database_1.prismaClient.person.count({
                where: {
                    AND: [
                        ...filters,
                        {
                            id: {
                                notIn: excludedPersonIds,
                            },
                        },
                    ],
                },
            });
            return {
                persons,
                paging: {
                    page,
                    total_item: totalItems,
                    total_page: Math.ceil(totalItems / parseInt(size)),
                },
            };
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const person = yield database_1.prismaClient.person.findUnique({
                where: { id },
                include: {
                    user: true
                }
            });
            if (!person) {
                throw new response_error_1.ResponseError(404, "person not found");
            }
            return person;
        });
    }
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt_1.default.hash(request.password, 10);
            const existingUser = yield database_1.prismaClient.user.findUnique({
                where: {
                    username: request.username,
                },
            });
            if (existingUser) {
                throw new response_error_1.ResponseError(400, "Username already exists");
            }
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
    static update(userId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield database_1.prismaClient.user.findUnique({
                where: { id: userId },
            });
            if (!existingUser) {
                throw new response_error_1.ResponseError(404, "User not found");
            }
            const usernameTaken = yield database_1.prismaClient.user.findFirst({
                where: {
                    username: request.username,
                    NOT: { id: userId }
                }
            });
            if (usernameTaken) {
                throw new response_error_1.ResponseError(400, "Username already exists");
            }
            let hashedPassword = existingUser.password;
            if (request.password) {
                hashedPassword = yield bcrypt_1.default.hash(request.password, 10);
            }
            const updatedUser = yield database_1.prismaClient.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const user = yield tx.user.update({
                    where: { id: userId },
                    data: {
                        username: request.username,
                        password: hashedPassword,
                        role: request.role,
                        person: {
                            update: {
                                fullName: request.fullName,
                                email: request.email,
                                position: request.position,
                                category: request.category,
                                phoneNumber: request.phoneNumber,
                                address: request.address,
                                photo: request.photo,
                                startDate: request.startDate ? new Date(request.startDate) : null,
                                endDate: request.endDate ? new Date(request.endDate) : null,
                                status: request.status,
                            }
                        }
                    },
                    include: {
                        person: true,
                    },
                });
                return user;
            }));
            return updatedUser;
        });
    }
}
exports.default = PersonService;
//# sourceMappingURL=PersonService.js.map