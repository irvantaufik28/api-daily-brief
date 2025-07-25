import { prismaClient } from "../application/database";
import { ResponseError } from '../error/response-error';

export class CompanyService {

    static async get(request: any) {
        const page = request.page ?? 1;
        const size = request.size ?? 10;
        const skip = (parseInt(page) - 1) * parseInt(size);
        const filters: any = [];

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

        const company = await prismaClient.company.findMany({
            orderBy: orders,
            where: {
                AND: filters
            },

            take: parseInt(size),
            skip: skip,
        })

        const totalItems = await prismaClient.company.count({
            where: {
                AND: filters
            }
        })

        return {
            companies: company,
            paging: {
                page: page,
                total_item: totalItems,
                total_page: Math.ceil(totalItems / parseInt(size)),
            },
        };
    }

    static async getById(id: number) {
        const company = await prismaClient.company.findUnique({
            where: { id },
            include: {
                projects: true
            }
        });

        if (!company) {
            throw new ResponseError(404, "Company not found");
        }

        return company;
    }

    static async create(request: any) {
        const company = await prismaClient.company.create({
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
    }


    static async update(id: number, request: any) {
        const company = await prismaClient.company.update({
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
    }


}
