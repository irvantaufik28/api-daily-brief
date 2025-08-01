import { ResponseError } from "../error/response-error";
import { prismaClient } from "../application/database";

export class ProjectMemberService {
    static async getMemberByProjectId(request: any) {
        const page = parseInt(request.page ?? 1);
        const size = parseInt(request.size ?? 10);
        const skip = (page - 1) * size;

        const projectId = parseInt(request.projectId);
        const fullNameFilter = request.fullName ?? "";

        const orderByField = request.orderBy || "createdAt";
        const sortOrder = request.sortBy || "desc";

        const whereClause: any = {
            projectId: parseInt(request.projectId),
            ...(request.fullName && {
                person: {
                    fullName: {
                        contains: request.fullName,
                        mode: "insensitive",
                    },
                },
            }),
        };

        if (fullNameFilter) {
            whereClause.person.fullName = {
                contains: fullNameFilter,
                mode: "insensitive",
            };
        }

        // Ambil data project members + person
        const [members, totalItems] = await prismaClient.$transaction([
            prismaClient.projectMember.findMany({
                where: whereClause,
                include: {
                    person: true,
                },
                orderBy: {
                    [orderByField]: sortOrder,
                },
                skip,
                take: size,
            }),
            prismaClient.projectMember.count({
                where: whereClause,
            }),
        ]);

        // Kembalikan hanya data person dari hasil relasi
        const persons = members.map((member) => member.person);

        return {
            members: persons,
            paging: {
                page,
                total_item: totalItems,
                total_page: Math.ceil(totalItems / size),
            },
        };
    }
    static async assignUnassignMemberProject(request: any) {
        const projectId = parseInt(request.projectId);

        if (!projectId) {
            throw new ResponseError(400, "projectId is required");
        }

        const assignIds: number[] = request.assignPersonIds || [];
        const unassignIds: number[] = request.unassignPersonIds || [];

        // ✅ Assign members (insert if not exists)
        const assignOps = assignIds.map((personId) =>
            prismaClient.projectMember.upsert({
                where: {
                    projectId_personId: {
                        projectId,
                        personId,
                    },
                },
                update: {
                    assignedAt: new Date(),
                },
                create: {
                    projectId,
                    personId,
                    assignedAt: new Date(),
                },
            })
        );

        // ✅ Unassign members (delete)
        const unassignOps = unassignIds.map((personId) =>
            prismaClient.projectMember.deleteMany({
                where: {
                    projectId,
                    personId,
                },
            })
        );

        // Jalankan semua dalam transaksi
        await prismaClient.$transaction([...assignOps, ...unassignOps]);

        return {
            message: "Assign/unassign completed",
            assigned: assignIds,
            unassigned: unassignIds,
        };
    }
}



export default ProjectMemberService