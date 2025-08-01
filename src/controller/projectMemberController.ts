import { Request, Response, NextFunction } from 'express';
import ProjectMemberService from '../service/ProjectMemberService';

const getMemberByProjectId = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        const request = {
            projectId: req.query.projectId,
            fullName: req.query.fullName,
            page: req.query.page,
            size: req.query.size,
            orderBy: req.query.orderBy,
            sortBy: req.query.sortBy
        }

        const members = await ProjectMemberService.getMemberByProjectId(request);

        return res.status(200).json({
            message: "success",
            data: members
        });
    } catch (error) {
        next(error);
    }
};

const assignUnassignMemberProject = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const request = {
            projectId: req.body.projectId,
            assignPersonIds: req.body.assignPersonIds ?? [],
            unassignPersonIds: req.body.unassignPersonIds ?? [],
        };


        if (!request.projectId) {
            return res.status(400).json({
                message: "projectId is required",
            });
        }

        const result = await ProjectMemberService.assignUnassignMemberProject(request);

        return res.status(200).json({
            message: "success",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};


export default {
    getMemberByProjectId,
    assignUnassignMemberProject
}