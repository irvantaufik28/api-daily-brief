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

        if (request.isDraft) {
            filters.push({
                isDraft: request.isDraft
            })
        }


        console.log(request)
        const orderBy = {
            [request.orderBy || "reportDate"]: request.sortBy || "desc",
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
                            id: true,
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

    static async useDraft(request: any) {

    }


    static async createOrUpdate(request: any) {
        return await prismaClient.$transaction(async (tx) => {
            let reportProject;

            const isDraft = request.isDraft
            if (request.id) {
                // UPDATE case
                reportProject = await tx.reportProject.findUnique({
                    where: { id: request.id },
                });

                if (!reportProject) {
                    throw new ResponseError(404, "Report project not found");
                }

                // Cek reportDate conflict jika reportDate diubah
                if (
                    request.reportDate &&
                    new Date(request.reportDate).toISOString() !== reportProject.reportDate?.toISOString()
                ) {
                    const existing = await tx.reportProject.findFirst({
                        where: {
                            id: { not: reportProject.id },
                            projectId: Number(request.projectId),
                            personId: Number(request.personId),
                            reportDate: new Date(request.reportDate),
                        },
                    });

                    if (existing) {
                        throw new ResponseError(404, "Report date already exists for this project and person.");
                    }
                }

                // Update reportProject
                reportProject = await tx.reportProject.update({
                    where: { id: reportProject.id },
                    data: {
                        reportDate: request.reportDate ? new Date(request.reportDate) : null,
                        isDraft,
                    },
                });

                await tx.reportDetail.deleteMany({
                    where: { reportProjectId: reportProject.id },
                });

            } else {
                // CREATE case
                if (request.reportDate) {
                    const existing = await tx.reportProject.findFirst({
                        where: {
                            projectId: Number(request.projectId),
                            personId: Number(request.personId),
                            reportDate: new Date(request.reportDate),
                        },
                    });

                    if (existing) {
                        throw new ResponseError(400, "Report date already exists for this project and person.");
                    }
                }

                reportProject = await tx.reportProject.create({
                    data: {
                        projectId: Number(request.projectId),
                        personId: Number(request.personId),
                        reportDate: request.reportDate ? new Date(request.reportDate) : null,
                        isDraft,
                    },
                });
            }

            const reportDetailsData = request.reports.map((r: any) => ({
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