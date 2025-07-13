import { Request, Response, NextFunction } from 'express';
import ReportService from '../service/ReportService';

const get = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const request = {
            personId: req.query.personId,
            projectId: req.query.position,
            reportDate: req.query.reportDate,
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

const create = async (req: any, res: Response, next: NextFunction): Promise<any> => {

    try {
        const result = await ReportService.create(req.body);


        return res.status(200).json({
            message: "success",
            data: result
        });
    } catch (error: any) {
        next(error)
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


export default {
    get,
    getByid,
    create,
    updateReportDetail,
    removeReport,
    removeReportDetail

}