"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const response_error_1 = require("../error/response-error");
const database_1 = require("../application/database");
class ReportService {
    static async get(request) {
        const page = request.page ?? 1;
        const size = request.size ?? 10;
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
        const [reports, totalItems] = await database_1.prismaClient.$transaction([
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
        const mapped = reports.map((r) => ({
            id: r.id,
            reportDate: r.reportDate,
            projectTitle: r.project?.title,
            projectStatus: r.project?.status,
            emailStatus: r.emailStatus,
            companyName: r.project?.company?.name,
            personId: r.person?.id,
            personFullName: r.person?.fullName,
        }));
        return {
            reports: mapped,
            paging: {
                page: parseInt(page),
                total_item: totalItems,
                total_page: Math.ceil(totalItems / parseInt(size)),
            },
        };
    }
    static async getById(id) {
        const detail = await database_1.prismaClient.reportProject.findUnique({
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
    }
    static async createOrUpdate(request) {
        return await database_1.prismaClient.$transaction(async (tx) => {
            let reportProject;
            if (request.id) {
                reportProject = await tx.reportProject.findUnique({
                    where: { id: request.id },
                });
                if (!reportProject) {
                    throw new Error("Report project not found");
                }
                await tx.reportDetail.deleteMany({
                    where: { reportProjectId: reportProject.id },
                });
            }
            else {
                reportProject = await tx.reportProject.create({
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
            await tx.reportDetail.createMany({
                data: reportDetailsData,
            });
            return reportProject;
        });
    }
    static async updateReportDetail(reportDetailId, request) {
        const existingDetail = await database_1.prismaClient.reportDetail.findUnique({
            where: { id: reportDetailId },
        });
        if (!existingDetail) {
            throw new response_error_1.ResponseError(404, "Report detail not found");
        }
        const updatedDetail = await database_1.prismaClient.reportDetail.update({
            where: { id: reportDetailId },
            data: {
                workedHour: request.workedHour,
                description: request.description,
            },
        });
        return updatedDetail;
    }
    static async deleteReport(reportProjectId) {
        const existing = await database_1.prismaClient.reportProject.findUnique({
            where: { id: reportProjectId },
        });
        if (!existing) {
            throw new response_error_1.ResponseError(404, "Report project not found");
        }
        await database_1.prismaClient.$transaction(async (tx) => {
            await tx.reportDetail.deleteMany({
                where: {
                    reportProjectId: reportProjectId,
                },
            });
            await tx.reportProject.delete({
                where: {
                    id: reportProjectId,
                },
            });
        });
        return;
    }
    static async deleteReportDetail(detailId) {
        const existing = await database_1.prismaClient.reportDetail.findUnique({
            where: { id: detailId },
        });
        if (!existing) {
            throw new response_error_1.ResponseError(404, "Report detail not found");
        }
        await database_1.prismaClient.reportDetail.delete({
            where: {
                id: detailId,
            },
        });
        return;
    }
}
exports.ReportService = ReportService;
exports.default = ReportService;
//# sourceMappingURL=ReportService.js.map