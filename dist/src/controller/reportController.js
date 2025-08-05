"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReportService_1 = __importDefault(require("../service/ReportService"));
const database_1 = require("../application/database");
const get = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        };
        const result = yield ReportService_1.default.get(request);
        return res.status(200).json({
            message: "success",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
const getByid = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const result = yield ReportService_1.default.getById(id);
        return res.status(200).json({
            message: "success",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, projectId, personId, reportDate, reports, isDraft } = req.body;
        const result = yield ReportService_1.default.createOrUpdate({
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
    }
    catch (error) {
        console.error("Create report error:", error);
        next(error);
    }
});
const updateReportDetail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const result = yield ReportService_1.default.updateReportDetail(id, req.body);
        return res.status(200).json({
            message: "success",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
const removeReport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const result = yield ReportService_1.default.deleteReport(id);
        return res.status(200).json({
            message: "success",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
const removeReportDetail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const result = yield ReportService_1.default.deleteReportDetail(id);
        return res.status(200).json({
            message: "success",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
const countDraft = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield database_1.prismaClient.reportProject.count({
            where: {
                isDraft: true,
            },
        });
        return res.status(200).json({
            message: "success",
            data: count,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    get,
    getByid,
    create,
    updateReportDetail,
    removeReport,
    removeReportDetail,
    countDraft
};
//# sourceMappingURL=reportController.js.map