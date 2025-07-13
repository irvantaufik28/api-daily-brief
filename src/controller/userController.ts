import { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../application/database';
import { ResponseError } from '../error/response-error';

const get = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        const user = await prismaClient.user.findMany({
            select: {
                id: true,
                username: true,
                role: true,
                personId: true,
                createdAt: true,
                updatedAt: true,
             },
        });

      
        return res.status(200).json({
            message: "success",
            data: user
        });
    } catch (error) {
        next(error);
    }
};


export default {
    get
}