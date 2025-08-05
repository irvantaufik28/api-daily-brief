import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { generateAccessToken } from "../utils/generate-token";
import bcrypt from "bcrypt"
import { Request, Response, NextFunction } from 'express';

const login = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const user = await prismaClient.user.findFirst({
            where: {
                username: req.body.username
            },
            include: {
                person: {
                    select: {
                        fullName: true,
                        photo: true
                    }
                }
            }
        });

        if (!user) {
            throw new ResponseError(404, "username or passwod wrong!")
        }

        const verifyPassword = await bcrypt.compare(req.body.password, user.password)
        if (!verifyPassword) {
            throw new ResponseError(404, "username or passwod wrong!")

        }


        const user_data_token = {
            id: user.id,
            username: user.username,
            role: user.role,
            fullName: user.person?.fullName,
            photo: user.person?.photo
        }

        const token = generateAccessToken(user_data_token)

        const user_data = {
            id: user.id,
            username: user.username,
            role: user.role,
            token: token,

        }

        return res.status(200).json({
            data: user_data

        });
    } catch (error) {
        next(error);
    }
};

export default {
    login
}