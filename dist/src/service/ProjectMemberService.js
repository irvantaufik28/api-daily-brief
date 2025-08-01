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
exports.ProjectMemberService = void 0;
const response_error_1 = require("../error/response-error");
const database_1 = require("../application/database");
class ProjectMemberService {
    static getMemberByProjectId(request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const page = parseInt((_a = request.page) !== null && _a !== void 0 ? _a : 1);
            const size = parseInt((_b = request.size) !== null && _b !== void 0 ? _b : 10);
            const skip = (page - 1) * size;
            const projectId = parseInt(request.projectId);
            const fullNameFilter = (_c = request.fullName) !== null && _c !== void 0 ? _c : "";
            const orderByField = request.orderBy || "createdAt";
            const sortOrder = request.sortBy || "desc";
            const whereClause = Object.assign({ projectId: parseInt(request.projectId) }, (request.fullName && {
                person: {
                    fullName: {
                        contains: request.fullName,
                        mode: "insensitive",
                    },
                },
            }));
            if (fullNameFilter) {
                whereClause.person.fullName = {
                    contains: fullNameFilter,
                    mode: "insensitive",
                };
            }
            // Ambil data project members + person
            const [members, totalItems] = yield database_1.prismaClient.$transaction([
                database_1.prismaClient.projectMember.findMany({
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
                database_1.prismaClient.projectMember.count({
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
        });
    }
    static assignUnassignMemberProject(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const projectId = parseInt(request.projectId);
            if (!projectId) {
                throw new response_error_1.ResponseError(400, "projectId is required");
            }
            const assignIds = request.assignPersonIds || [];
            const unassignIds = request.unassignPersonIds || [];
            // ✅ Assign members (insert if not exists)
            const assignOps = assignIds.map((personId) => database_1.prismaClient.projectMember.upsert({
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
            }));
            // ✅ Unassign members (delete)
            const unassignOps = unassignIds.map((personId) => database_1.prismaClient.projectMember.deleteMany({
                where: {
                    projectId,
                    personId,
                },
            }));
            // Jalankan semua dalam transaksi
            yield database_1.prismaClient.$transaction([...assignOps, ...unassignOps]);
            return {
                message: "Assign/unassign completed",
                assigned: assignIds,
                unassigned: unassignIds,
            };
        });
    }
}
exports.ProjectMemberService = ProjectMemberService;
exports.default = ProjectMemberService;
//# sourceMappingURL=ProjectMemberService.js.map