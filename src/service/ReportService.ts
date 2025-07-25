import { ResponseError } from "../error/response-error";
import { prismaClient } from "../application/database";


export class ReportService {

    static async get(request: any) {
        const page = request.page ?? 1;
        const size = request.size ?? 10;
        const skip = (parseInt(page) - 1) * parseInt(size);

        const filters: any = [];

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

        const [reports, totalItems] = await prismaClient.$transaction([
            prismaClient.reportProject.findMany({
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
                            id : true,
                            fullName: true,
                        },
                    },
                },
                skip,
                take: parseInt(size),
            }),
            prismaClient.reportProject.count({
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
            emailStatus : r.emailStatus,
            companyName: r.project?.company?.name,
            personId : r.person?.id,
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


    static async getById(id: number) {
        const detail = await prismaClient.reportProject.findUnique({
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
            throw new ResponseError(404, "Report not found");
        }

        return detail;
    }



    static async create(request: any) {
        return await prismaClient.$transaction(async (tx) => {
            const reportProject = await tx.reportProject.create({
                data: {
                    projectId: request.projectId,
                    personId: request.personId,
                    reportDate: request.reportDate ? new Date(request.reportDate) : null,
                },
            });

            const reportDetailsData = request.reports.map((r: any) => ({
                workedHour: r.workedHour,
                description: r.description,
                reportProjectId: reportProject.id,
            }));

            await tx.reportDetail.createMany({
                data: reportDetailsData,
            });

            return reportProject;
        });
    }


    static async updateReportDetail(reportDetailId: number, request: any) {
        const existingDetail = await prismaClient.reportDetail.findUnique({
            where: { id: reportDetailId },
        });

        if (!existingDetail) {
            throw new ResponseError(404, "Report detail not found");
        }

        const updatedDetail = await prismaClient.reportDetail.update({
            where: { id: reportDetailId },
            data: {
                workedHour: request.workedHour,
                description: request.description,
            },
        });

        return updatedDetail;
    }

    static async deleteReport(reportProjectId: number) {
        const existing = await prismaClient.reportProject.findUnique({
            where: { id: reportProjectId },
        });

        if (!existing) {
            throw new ResponseError(404, "Report project not found");
        }

        await prismaClient.$transaction(async (tx) => {
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

        return
    }

    static async deleteReportDetail(detailId: number) {
        const existing = await prismaClient.reportDetail.findUnique({
            where: { id: detailId },
        });

        if (!existing) {
            throw new ResponseError(404, "Report detail not found");
        }

        await prismaClient.reportDetail.delete({
            where: {
                id: detailId,
            },
        });

        return
    }
}


export default ReportService