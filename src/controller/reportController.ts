import { Request, Response, NextFunction } from 'express';
import ReportService from '../service/ReportService';
import { prismaClient } from '../application/database';

const get = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const request = {
            personId: req.query.personId,
            projectId: req.query.position,
            reportDate: req.query.reportDate,
            isDraft: req.query.isDraft === 'true' ? true : req.query.isDraft === 'false' ? false : undefined,
            page: req.query.page,
            size: req.query.size,
            orderBy: req.query.orderBy,
            sortBy: req.query.sortBy
        }
        const result = await ReportService.get(request)

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
        const result = await ReportService.getById(id)

        return res.status(200).json({
            message: "success",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id, projectId, personId, reportDate, reports, isDraft } = req.body;

        const result = await ReportService.createOrUpdate({
            id: id ? parseInt(id) : undefined,
            projectId: parseInt(projectId),
            personId: parseInt(personId),
            reportDate: new Date(reportDate),
            reports,
            isDraft: isDraft ? isDraft : false

        });

        res.status(200).json({
            message: id ? "updated" : "created",
            data: result,
        });
    } catch (error: any) {
        console.error("Create report error:", error);
        next(error);
    }
};

const updateReportDetail = async (req: any, res: Response, next: NextFunction): Promise<any> => {

    try {
        const id = parseInt(req.params.id);
        const result = await ReportService.updateReportDetail(id, req.body);


        return res.status(200).json({
            message: "success",
            data: result
        });
    } catch (error: any) {
        next(error)
    }
};

const removeReport = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        const id = parseInt(req.params.id);
        const result = await ReportService.deleteReport(id)
        return res.status(200).json({
            message: "success",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const removeReportDetail = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        const id = parseInt(req.params.id);
        const result = await ReportService.deleteReportDetail(id)
        return res.status(200).json({
            message: "success",
            data: result
        });
    } catch (error) {
        next(error);
    }
};
const countDraft = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const count = await prismaClient.reportProject.count({
            where: {
                isDraft: true,
            },
        });

        return res.status(200).json({
            message: "success",
            data: count,
        });
    } catch (error) {
        next(error);
    }
};



export default {
    get,
    getByid,
    create,
    updateReportDetail,
    removeReport,
    removeReportDetail,
    countDraft

}