import bcrypt from 'bcrypt';
import { prismaClient } from "../application/database";
import { ResponseError } from '../error/response-error';

class ProjectService {


    static async get(request: any) {
        const page = parseInt(request.page ?? 1);
        const size = parseInt(request.size ?? 10);
        const skip = (page - 1) * size;

        const filters: any = [];

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

        const orderBy = {
            [request.orderBy || "createdAt"]: request.sortBy || "desc",
        };

        const [projects, totalItems] = await prismaClient.$transaction([
            prismaClient.project.findMany({
                where: {
                    AND: filters,
                },
                orderBy,
                include: {
                    company: {
                        select: {
                            name: true,
                        },
                    },
                },
                skip,
                take: size,
            }),
            prismaClient.project.count({
                where: {
                    AND: filters,
                },
            }),
        ]);

        const mapped = projects.map((project) => ({
           id : project.id,
           title : project.title,
           description : project.description,
           startDate : project.startDate,
           status :project.status,
           company : project.company.name

        }));

        return {
            projects: mapped,
            paging: {
                page,
                total_item: totalItems,
                total_page: Math.ceil(totalItems / size),
            },
        };
    }



    static async getById(id: number) {
        const project = await prismaClient.project.findUnique({
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
            throw new ResponseError(404, "Project not found");
        }

        return project;
    }


    static async create(request: any) {
        await prismaClient.$transaction(async (tx) => {
            const project = await tx.project.create({
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
        });
    }

    static async update(id: number, request: any) {
        await prismaClient.$transaction(async (tx) => {
            const project = await tx.project.update({
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
        });
    }

    static async delete(id: number) {
        const existing = await prismaClient.project.findUnique({
            where: { id }
        });

        if (!existing) {
            throw new ResponseError(404, "Project not found");
        }

        await prismaClient.project.delete({
            where: { id }
        });

        return { message: "Project deleted successfully" };
    }

    static async assignProject(request: { personIds: number[], projectId: number }) {
        await prismaClient.$transaction(async (tx) => {
            const data = request.personIds.map((personId) => ({
                personId,
                projectId: request.projectId,
                assignedAt: new Date()
            }));

            const result = await tx.projectMember.createMany({
                data,
                skipDuplicates: true
            });

            return {
                message: `${result.count} person(s) assigned to project successfully`,
            };
        });
    }
    static async unassignProject(request: { personIds: number[]; projectId: number }) {
        return await prismaClient.$transaction(async (tx) => {
            const deleted = await tx.projectMember.deleteMany({
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
        });
    }



}

export default ProjectService;