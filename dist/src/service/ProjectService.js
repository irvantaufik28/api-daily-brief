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
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class ProjectService {
    static get(request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const page = (_a = request.page) !== null && _a !== void 0 ? _a : 1;
            const size = (_b = request.size) !== null && _b !== void 0 ? _b : 10;
            const skip = (parseInt(page) - 1) * parseInt(size);
            const filters = [];
            if (request.title) {
                filters.push({
                    title: {
                        contains: request.title,
                        mode: "insensitive",
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
            const project = yield database_1.prismaClient.project.findMany({
                orderBy: orders,
                where: {
                    AND: filters
                },
                take: parseInt(size),
                skip: skip,
            });
            const totalItems = yield database_1.prismaClient.project.count({
                where: {
                    AND: filters
                }
            });
            return {
                data: project,
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
            const project = yield database_1.prismaClient.project.findUnique({
                where: { id },
                include: {
                    projectMembers: {
                        include: {
                            person: true
                        }
                    }
                }
            });
            if (!project) {
                throw new response_error_1.ResponseError(404, "Project not found");
            }
            return project;
        });
    }
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.prismaClient.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const project = yield tx.project.create({
                    data: {
                        title: request.title,
                        description: request.description,
                        companyId: request.companyId,
                        startDate: request.startDate ? new Date(request.startDate) : null,
                        endDate: request.endDate ? new Date(request.endDate) : null,
                        status: request.status || 'ONGOING',
                    },
                });
                return project;
            }));
        });
    }
    static update(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.prismaClient.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const project = yield tx.project.update({
                    where: { id },
                    data: {
                        title: request.title,
                        description: request.description,
                        companyId: request.companyId,
                        startDate: request.startDate ? new Date(request.startDate) : null,
                        endDate: request.endDate ? new Date(request.endDate) : null,
                        status: request.status,
                    },
                });
                return project;
            }));
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield database_1.prismaClient.project.findUnique({
                where: { id }
            });
            if (!existing) {
                throw new response_error_1.ResponseError(404, "Project not found");
            }
            yield database_1.prismaClient.project.delete({
                where: { id }
            });
            return { message: "Project deleted successfully" };
        });
    }
    static assignProject(request) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.prismaClient.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const data = request.personIds.map((personId) => ({
                    personId,
                    projectId: request.projectId,
                    assignedAt: new Date()
                }));
                const result = yield tx.projectMember.createMany({
                    data,
                    skipDuplicates: true
                });
                return {
                    message: `${result.count} person(s) assigned to project successfully`,
                };
            }));
        });
    }
    static unassignProject(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_1.prismaClient.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const deleted = yield tx.projectMember.deleteMany({
                    where: {
                        projectId: request.projectId,
                        personId: {
                            in: request.personIds,
                        },
                    },
                });
                return {
                    message: `${deleted.count} member(s) unassigned from project`,
                    count: deleted.count,
                };
            }));
        });
    }
}
exports.default = ProjectService;
//# sourceMappingURL=ProjectService.js.map