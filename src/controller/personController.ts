import { Request, Response, NextFunction } from 'express';
import PersonService from '../service/PersonService';
import { prismaClient } from '../application/database';



const get = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {


        const request = {
            fullName: req.query.fullName,
            position: req.query.position,
            status: req.query.status,
            page: req.query.page,
            size: req.query.size,
            orderBy: req.query.orderBy,
            sortBy: req.query.sortBy
        }

        const result = await PersonService.get(request)

        return res.status(200).json({
            message: "success",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const list = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        const person = await prismaClient.person.findMany({
            orderBy: {
                fullName: 'asc'
            },
            select: {
                id: true,
                fullName: true
            }
        });

        return res.status(200).json({
            message: "success",
            data: person
        });
    } catch (error) {
        next(error);
    }
};

const listNotInProject = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        const request = {
            fullName: req.query.fullName,
            position: req.query.position,
            status: req.query.status,
            projectId: req.query.projectId,
            page: req.query.page,
            size: req.query.size,
            orderBy: req.query.orderBy,
            sortBy: req.query.sortBy
        }

        const person = await PersonService.getPersonNotInProject(request)
        return res.status(200).json({
            message: "success",
            data: person
        });
    } catch (error) {
        next(error);
    }
};

const getById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        const id = parseInt(req.params.id);
        const result = await PersonService.getById(id)

        return res.status(200).json({
            message: "success",
            data: result
        });
    } catch (error) {
        next(error);
    }
};


const create = async (req: any, res: Response, next: NextFunction): Promise<any> => {

    try {
        const result = await PersonService.create(req.body);


        return res.status(200).json({
            message: "success",
            data: result
        });
    } catch (error: any) {
        next(error)
    }
};

const update = async (req: any, res: Response, next: NextFunction): Promise<any> => {

    try {
        const id = parseInt(req.params.id);
        const result = await PersonService.update(id, req.body);


        return res.status(200).json({
            message: "success",
            data: result
        });
    } catch (error: any) {
        next(error)
    }
};



export default {
    get,
    list,
    getById,
    create,
    update,
    listNotInProject
}