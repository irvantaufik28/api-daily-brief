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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyService = void 0;
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class CompanyService {
    static get(request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const page = (_a = request.page) !== null && _a !== void 0 ? _a : 1;
            const size = (_b = request.size) !== null && _b !== void 0 ? _b : 10;
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
            const company = yield database_1.prismaClient.company.findMany({
                orderBy: orders,
                where: {
                    AND: filters
                },
                take: parseInt(size),
                skip: skip,
            });
            const totalItems = yield database_1.prismaClient.company.count({
                where: {
                    AND: filters
                }
            });
            return {
                data: company,
                paging: {
                    page: page,
                    total_item: totalItems,
                    total_page: Math.ceil(totalItems / parseInt(size)),
                },
            };
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield database_1.prismaClient.company.findUnique({
                where: { id },
                include: {
                    projects: true
                }
            });
            if (!company) {
                throw new response_error_1.ResponseError(404, "Company not found");
            }
            return company;
        });
    }
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield database_1.prismaClient.company.create({
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
        });
    }
    static update(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield database_1.prismaClient.company.update({
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
        });
    }
}
exports.CompanyService = CompanyService;
//# sourceMappingURL=CompanyService.js.map