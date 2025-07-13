import { Request, Response, NextFunction } from 'express';
import { CompanyService } from '../service/CompanyService';



const get = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const request = {
            name: req.query.name,
            page: req.query.page,
            size: req.query.size,
            orderBy: req.query.orderBy,
            sortBy: req.query.sortBy
        }
        const result = await CompanyService.get(request)

        return res.status(200).json({
            message: "success",
            data: result
        });
        
    } catch (error) {
        next(error);
    }
};

const getByid = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        const id = parseInt(req.params.id);
        const result = await CompanyService.getById(id)

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
        const result = await CompanyService.create(req.body);
       
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
        const result = await CompanyService.update(id, req.body);
        
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
    getByid,
    create,
    update
}