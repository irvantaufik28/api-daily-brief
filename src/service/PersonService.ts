import bcrypt from 'bcrypt';
import { prismaClient } from "../application/database";
import { ResponseError } from '../error/response-error';

class PersonService {

    static async get(request: any) {
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
        const allowedOrderFields = ["id", "fullName", "position", "status", "createdAt"];
        const orderBy = allowedOrderFields.includes(request.orderBy) ? request.orderBy : "createdAt";
        const sortBy = ["asc", "desc"].includes(request.sortBy) ? request.sortBy : "desc";

        const orders = {
            [orderBy]: sortBy
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
            persons: person,
            paging: {
                page: page,
                total_item: totalItems,
                total_page: Math.ceil(totalItems / parseInt(size)),
            },
        };


    }


    static async getPersonNotInProject(request: any) {
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

        // Ambil semua personId yang sudah tergabung di project tertentu
        const assignedPerson = await prismaClient.projectMember.findMany({
            where: {
                projectId: parseInt(request.projectId),
            },
            select: {
                personId: true,
            },
        });

        const excludedPersonIds = assignedPerson.map((pm) => pm.personId);

        const allowedOrderFields = ["id", "fullName", "position", "status", "createdAt"];
        const orderBy = allowedOrderFields.includes(request.orderBy) ? request.orderBy : "createdAt";
        const sortBy = ["asc", "desc"].includes(request.sortBy) ? request.sortBy : "desc";

        const orders = {
            [orderBy]: sortBy,
        };

        const persons = await prismaClient.person.findMany({
            where: {
                AND: [
                    ...filters,
                    {
                        id: {
                            notIn: excludedPersonIds,
                        },
                    },
                ],
            },
            orderBy: orders,
            skip,
            take: parseInt(size),
        });

        const totalItems = await prismaClient.person.count({
            where: {
                AND: [
                    ...filters,
                    {
                        id: {
                            notIn: excludedPersonIds,
                        },
                    },
                ],
            },
        });

        return {
            persons,
            paging: {
                page,
                total_item: totalItems,
                total_page: Math.ceil(totalItems / parseInt(size)),
            },
        };
    }


    static async getById(id: number) {
        const person = await prismaClient.person.findUnique({
            where: { id },
            include: {
                user: true
            }
        });

        if (!person) {
            throw new ResponseError(404, "person not found");
        }

        return person;
    }

    static async create(request: any) {
        const hashedPassword = await bcrypt.hash(request.password, 10);

        const existingUser = await prismaClient.user.findUnique({
            where: {
                username: request.username,
            },
        });

        if (existingUser) {

            throw new ResponseError(400, "Username already exists");
        }
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
                            startDate: new Date(request.startDate) ?? null,
                            endDate: new Date(request.endDate) ?? null,
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

    static async update(userId: number, request: any) {
        const existingUser = await prismaClient.user.findUnique({
            where: { id: userId },
        });

        if (!existingUser) {
            throw new ResponseError(404, "User not found");
        }

        const usernameTaken = await prismaClient.user.findFirst({
            where: {
                username: request.username,
                NOT: { id: userId }
            }
        });

        if (usernameTaken) {
            throw new ResponseError(400, "Username already exists");
        }

        let hashedPassword = existingUser.password;
        if (request.password) {
            hashedPassword = await bcrypt.hash(request.password, 10);
        }

        const updatedUser = await prismaClient.$transaction(async (tx) => {
            const user = await tx.user.update({
                where: { id: userId },
                data: {
                    username: request.username,
                    password: hashedPassword,
                    role: request.role,
                    person: {
                        update: {
                            fullName: request.fullName,
                            email: request.email,
                            position: request.position,
                            category: request.category,
                            phoneNumber: request.phoneNumber,
                            address: request.address,
                            photo: request.photo,
                            startDate: request.startDate ? new Date(request.startDate) : null,
                            endDate: request.endDate ? new Date(request.endDate) : null,
                            status: request.status,
                        }
                    }
                },
                include: {
                    person: true,
                },
            });

            return user;
        });

        return updatedUser;
    }



}

export default PersonService;