import bcrypt from 'bcrypt';
import { prismaClient } from "../application/database";

class PersonService {
    constructor() { }

    async get(request: any) {
        const page = request.page ?? 1;
        const size = request.size ?? 10;
        const skip = (parseInt(page) - 1) * parseInt(size);
        const filters: any = [];

        if (request.fullName) {
            filters.push({
                fullName: {
                    contains: request.fullName,
                    mode: "insensitive",
                },
            });
        }

        if (request.position) {
            filters.push({
                position: {
                    equals: request.position,
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

        const person = await prismaClient.person.findMany({
            orderBy: orders,
            where: {
                AND: filters
            },
            include: {
                user: true
            },
            take: parseInt(size),
            skip: skip,
        })

        const totalItems = await prismaClient.person.count({
            where: {
                AND: filters
            }
        })

        return {
            data: person,
            paging: {
                page: page,
                total_item: totalItems,
                total_page: Math.ceil(totalItems / parseInt(size)),
            },
        };


    }

    async create(request: any) {
        const hashedPassword = await bcrypt.hash(request.password, 10);
        await prismaClient.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    username: request.username,
                    password: hashedPassword,
                    role: request.role,
                    person: {
                        create: {
                            fullName: request.fullName,
                            email: request.email,
                            position: request.position,
                            category: request.category,
                            phoneNumber: request.phoneNumber,
                            address: request.address,
                            photo: request.photo,
                            startDate: new Date (request.startDate) ?? null,
                            endDate: new Date (request.endDate) ?? null,
                            status: request.status,
                        },
                    },
                },
                include: {
                    person: true,
                },
            });

            return user;
        });
    }



}

export default PersonService;