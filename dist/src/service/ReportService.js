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
exports.ReportService = void 0;
const response_error_1 = require("../error/response-error");
const database_1 = require("../application/database");
class ReportService {
    static get(request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const page = (_a = request.page) !== null && _a !== void 0 ? _a : 1;
            const size = (_b = request.size) !== null && _b !== void 0 ? _b : 10;
            const skip = (parseInt(page) - 1) * parseInt(size);
            const filters = [];
            if (request.personId) {
                filters.push({
                    personId: parseInt(request.personId),
                });
            }
            if (request.projectId) {
                filters.push({
                    projectId: parseInt(request.projectId),
                });
            }
            if (request.reportDate) {
                filters.push({
                    reportDate: new Date(request.reportDate),
                });
            }
            const orderBy = {
                [request.orderBy || "createdAt"]: request.sortBy || "desc",
            };
            const reports = yield database_1.prismaClient.reportProject.findMany({
                where: {
                    AND: filters,
                },
                orderBy,
                include: {
                    project: true,
                    person: true
                },
                skip,
                take: parseInt(size),
            });
            const totalItems = yield database_1.prismaClient.reportProject.count({
                where: {
                    AND: filters,
                },
            });
            return {
                data: reports,
                paging: {
                    page: parseInt(page),
                    total_item: totalItems,
                    total_page: Math.ceil(totalItems / parseInt(size)),
                },
            };
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const detail = yield database_1.prismaClient.reportProject.findUnique({
                where: { id },
                include: {
                    project: true,
                    person: true,
                    ReportDetail: true,
                },
            });
            if (!detail) {
                throw new response_error_1.ResponseError(404, "Report not found");
            }
            return detail;
        });
    }
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_1.prismaClient.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const reportProject = yield tx.reportProject.create({
                    data: {
                        projectId: request.projectId,
                        personId: request.personId,
                        reportDate: request.reportDate ? new Date(request.reportDate) : null,
                    },
                });
                const reportDetailsData = request.reports.map((r) => ({
                    workedHour: r.workedHour,
                    description: r.description,
                    reportProjectId: reportProject.id,
                }));
                yield tx.reportDetail.createMany({
                    data: reportDetailsData,
                });
                return reportProject;
            }));
        });
    }
    static updateReportDetail(reportDetailId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingDetail = yield database_1.prismaClient.reportDetail.findUnique({
                where: { id: reportDetailId },
            });
            if (!existingDetail) {
                throw new response_error_1.ResponseError(404, "Report detail not found");
            }
            const updatedDetail = yield database_1.prismaClient.reportDetail.update({
                where: { id: reportDetailId },
                data: {
                    workedHour: request.workedHour,
                    description: request.description,
                },
            });
            return updatedDetail;
        });
    }
    static deleteReport(reportProjectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield database_1.prismaClient.reportProject.findUnique({
                where: { id: reportProjectId },
            });
            if (!existing) {
                throw new response_error_1.ResponseError(404, "Report project not found");
            }
            yield database_1.prismaClient.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield tx.reportDetail.deleteMany({
                    where: {
                        reportProjectId: reportProjectId,
                    },
                });
                yield tx.reportProject.delete({
                    where: {
                        id: reportProjectId,
                    },
                });
            }));
            return;
        });
    }
    static deleteReportDetail(detailId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield database_1.prismaClient.reportDetail.findUnique({
                where: { id: detailId },
            });
            if (!existing) {
                throw new response_error_1.ResponseError(404, "Report detail not found");
            }
            yield database_1.prismaClient.reportDetail.delete({
                where: {
                    id: detailId,
                },
            });
            return;
        });
    }
}
exports.ReportService = ReportService;
exports.default = ReportService;
//# sourceMappingURL=ReportService.js.map