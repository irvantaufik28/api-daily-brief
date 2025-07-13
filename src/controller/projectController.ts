import { Request, Response, NextFunction } from 'express';
import ProjectService from '../service/ProjectService';
import { ResponseError } from '../error/response-error';

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
        const result = await ProjectService.get(request)
     
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
        const result = await ProjectService.getById(id)
      
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
        const result = await ProjectService.create(req.body);

       
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
        const result = await ProjectService.update(id, req.body);

        
        return res.status(200).json({
            message: "success",
            data: result
        });
    } catch (error: any) {
        next(error)
    }
};

const remove = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        const id = parseInt(req.params.id);
        const result = await ProjectService.delete(id)
        return res.status(200).json({
            message: "success",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const assignProject = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        const { personIds, projectId } = req.body;

        if (!Array.isArray(personIds) || typeof projectId !== 'number') {
            throw new ResponseError(400, "Invalid request. 'personIds' must be an array and 'projectId' must be a number.")
        }

        const result = await ProjectService.assignProject({ personIds, projectId });

        return res.status(200).json({
            message: "Project members assigned successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const unassignProject = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { personIds, projectId } = req.body;

        if (!Array.isArray(personIds) || typeof projectId !== 'number') {
            throw new ResponseError(400, "Invalid request. 'personIds' must be an array and 'projectId' must be a number.")
        }

        const result = await ProjectService.unassignProject({ personIds, projectId });

        return res.status(200).json({
            message: "Project members unassigned successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};



export default {
    get,
    getByid,
    create,
    update,
    remove,
    assignProject,
    unassignProject
}