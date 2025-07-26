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
                [request.orderBy || "reportDate"]: request.sortBy || "desc",
            };
            const [reports, totalItems] = yield database_1.prismaClient.$transaction([
                database_1.prismaClient.reportProject.findMany({
                    where: {
                        AND: filters,
                    },
                    orderBy,
                    select: {
                        id: true,
                        reportDate: true,
                        emailStatus: true,
                        project: {
                            select: {
                                title: true,
                                status: true,
                                company: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                        person: {
                            select: {
                                id: true,
                                fullName: true,
                            },
                        },
                    },
                    skip,
                    take: parseInt(size),
                }),
                database_1.prismaClient.reportProject.count({
                    where: {
                        AND: filters,
                    },
                }),
            ]);
            const mapped = reports.map((r) => {
                var _a, _b, _c, _d, _e, _f;
                return ({
                    id: r.id,
                    reportDate: r.reportDate,
                    projectTitle: (_a = r.project) === null || _a === void 0 ? void 0 : _a.title,
                    projectStatus: (_b = r.project) === null || _b === void 0 ? void 0 : _b.status,
                    emailStatus: r.emailStatus,
                    companyName: (_d = (_c = r.project) === null || _c === void 0 ? void 0 : _c.company) === null || _d === void 0 ? void 0 : _d.name,
                    personId: (_e = r.person) === null || _e === void 0 ? void 0 : _e.id,
                    personFullName: (_f = r.person) === null || _f === void 0 ? void 0 : _f.fullName,
                });
            });
            return {
                reports: mapped,
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
                    project: {
                        include: {
                            company: true, // nested include
                        },
                    },
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
    static createOrUpdate(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_1.prismaClient.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                let reportProject;
                if (request.id) {
                    reportProject = yield tx.reportProject.findUnique({
                        where: { id: request.id },
                    });
                    if (!reportProject) {
                        throw new Error("Report project not found");
                    }
                    yield tx.reportDetail.deleteMany({
                        where: { reportProjectId: reportProject.id },
                    });
                }
                else {
                    reportProject = yield tx.reportProject.create({
                        data: {
                            projectId: Number(request.projectId),
                            personId: Number(request.personId),
                            reportDate: request.reportDate ? new Date(request.reportDate) : null,
                        },
                    });
                }
                const reportDetailsData = request.reports.map((r) => ({
                    workedHour: parseInt(r.workedHour),
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