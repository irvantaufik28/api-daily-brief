import { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../application/database';
import { ResponseError } from '../error/response-error';
import PersonService from '../service/PersonService';



const get = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        const personService = new PersonService()
        const request = {
            fullName: req.query.fullName,
            position: req.query.position,
            status: req.query.status,
            page: req.query.page,
            size: req.query.size,
            orderBy: req.query.orderBy,
            sortBy: req.query.sortBy
        }
        const result = await personService.get(request)
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const create = async (req: any, res: Response, next: NextFunction): Promise<any> => {

    try {
        const personService = new PersonService()
        const result = await personService.create(req.body);

        res.status(200).json({
            success: true,
            message: "Request successful",
            data: result
        });
    } catch (error: any) {
        next(error)
    }
};


export default {
    get,
    create
}