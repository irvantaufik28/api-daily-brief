import { Request, Response, NextFunction } from 'express';
import PersonService from '../service/PersonService';



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
        console.log(request)
        const result = await PersonService.get(request)

        return res.status(200).json({
            message: "success",
            data: result
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
    getById,
    create,
    update
}