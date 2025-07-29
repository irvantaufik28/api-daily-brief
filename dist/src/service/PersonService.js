"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class PersonService {
    static async get(request) {
        const page = request.page ?? 1;
        const size = request.size ?? 10;
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
        const person = await database_1.prismaClient.person.findMany({
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
        const totalItems = await database_1.prismaClient.person.count({
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
    }
    static async getById(id) {
        const person = await database_1.prismaClient.person.findUnique({
            where: { id },
            include: {
                user: true
            }
        });
        if (!person) {
            throw new response_error_1.ResponseError(404, "person not found");
        }
        return person;
    }
    static async create(request) {
        const hashedPassword = await bcrypt_1.default.hash(request.password, 10);
        const existingUser = await database_1.prismaClient.user.findUnique({
            where: {
                username: request.username,
            },
        });
        if (existingUser) {
            throw new response_error_1.ResponseError(400, "Username already exists");
        }
        await database_1.prismaClient.$transaction(async (tx) => {
            const user = await tx.user.create({
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
                            startDate: new Date(request.startDate) ?? null,
                            endDate: new Date(request.endDate) ?? null,
                            status: request.status,
                        },
                    },
                },
                include: {
                    person: true,
                },
            });
            return user;
        });
    }
    static async update(userId, request) {
        const existingUser = await database_1.prismaClient.user.findUnique({
            where: { id: userId },
        });
        if (!existingUser) {
            throw new response_error_1.ResponseError(404, "User not found");
        }
        const usernameTaken = await database_1.prismaClient.user.findFirst({
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
            hashedPassword = await bcrypt_1.default.hash(request.password, 10);
        }
        const updatedUser = await database_1.prismaClient.$transaction(async (tx) => {
            const user = await tx.user.update({
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
        });
        return updatedUser;
    }
}
exports.default = PersonService;
//# sourceMappingURL=PersonService.js.map