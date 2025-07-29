"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyService = void 0;
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class CompanyService {
    static async get(request) {
        const page = request.page ?? 1;
        const size = request.size ?? 10;
        const skip = (parseInt(page) - 1) * parseInt(size);
        const filters = [];
        if (request.title) {
            filters.push({
                name: {
                    contains: request.name,
                    mode: "insensitive",
                },
            });
        }
        let orders = {
            [request.orderBy || "createdAt"]: request.sortBy || "desc",
        };
        const company = await database_1.prismaClient.company.findMany({
            orderBy: orders,
            where: {
                AND: filters
            },
            take: parseInt(size),
            skip: skip,
        });
        const totalItems = await database_1.prismaClient.company.count({
            where: {
                AND: filters
            }
        });
        return {
            companies: company,
            paging: {
                page: page,
                total_item: totalItems,
                total_page: Math.ceil(totalItems / parseInt(size)),
            },
        };
    }
    static async getById(id) {
        const company = await database_1.prismaClient.company.findUnique({
            where: { id },
            include: {
                projects: true
            }
        });
        if (!company) {
            throw new response_error_1.ResponseError(404, "Company not found");
        }
        return company;
    }
    static async create(request) {
        const company = await database_1.prismaClient.company.create({
            data: {
                name: request.name,
                email: request.email,
                altEmail1: request.altEmail1,
                altEmail2: request.altEmail2,
                altEmail3: request.altEmail3,
                phone: request.phone,
                location: request.location,
            },
        });
        return company;
    }
    static async update(id, request) {
        const company = await database_1.prismaClient.company.update({
            where: { id },
            data: {
                name: request.name,
                email: request.email,
                altEmail1: request.altEmail1,
                altEmail2: request.altEmail2,
                altEmail3: request.altEmail3,
                phone: request.phone,
                location: request.location,
            },
        });
        return company;
    }
}
exports.CompanyService = CompanyService;
//# sourceMappingURL=CompanyService.js.map