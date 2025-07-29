"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReportService_1 = __importDefault(require("../service/ReportService"));
const get = async (req, res, next) => {
    try {
        const request = {
            personId: req.query.personId,
            projectId: req.query.position,
            reportDate: req.query.reportDate,
            page: req.query.page,
            size: req.query.size,
            orderBy: req.query.orderBy,
            sortBy: req.query.sortBy
        };
        const result = await ReportService_1.default.get(request);
        return res.status(200).json({
            message: "success",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
const getByid = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const result = await ReportService_1.default.getById(id);
        return res.status(200).json({
            message: "success",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
const create = async (req, res, next) => {
    try {
        const { id, projectId, personId, reportDate, reports } = req.body;
        const result = await ReportService_1.default.createOrUpdate({
            id: id ? parseInt(id) : undefined,
            projectId: parseInt(projectId),
            personId: parseInt(personId),
            reportDate: new Date(reportDate),
            reports,
        });
        res.status(200).json({
            message: id ? "updated" : "created",
            data: result,
        });
    }
    catch (error) {
        console.error("Create report error:", error);
        next(error);
    }
};
const updateReportDetail = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const result = await ReportService_1.default.updateReportDetail(id, req.body);
        return res.status(200).json({
            message: "success",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
const removeReport = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const result = await ReportService_1.default.deleteReport(id);
        return res.status(200).json({
            message: "success",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
const removeReportDetail = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const result = await ReportService_1.default.deleteReportDetail(id);
        return res.status(200).json({
            message: "success",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    get,
    getByid,
    create,
    updateReportDetail,
    removeReport,
    removeReportDetail
};
//# sourceMappingURL=reportController.js.map