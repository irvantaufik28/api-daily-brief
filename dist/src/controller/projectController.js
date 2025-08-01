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
const ProjectService_1 = __importDefault(require("../service/ProjectService"));
const response_error_1 = require("../error/response-error");
const get = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = {
            title: req.query.title,
            companyId: req.query.companyId,
            status: req.query.status,
            page: req.query.page,
            size: req.query.size,
            orderBy: req.query.orderBy,
            sortBy: req.query.sortBy
        };
        const result = yield ProjectService_1.default.get(request);
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
        const result = yield ProjectService_1.default.getById(id);
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
        const result = yield ProjectService_1.default.create(req.body);
        return res.status(200).json({
            message: "success",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const result = yield ProjectService_1.default.update(id, req.body);
        return res.status(200).json({
            message: "success",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const result = yield ProjectService_1.default.delete(id);
        return res.status(200).json({
            message: "success",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
const assignProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { personIds, projectId } = req.body;
        if (!Array.isArray(personIds) || typeof projectId !== 'number') {
            throw new response_error_1.ResponseError(400, "Invalid request. 'personIds' must be an array and 'projectId' must be a number.");
        }
        const result = yield ProjectService_1.default.assignProject({ personIds, projectId });
        return res.status(200).json({
            message: "Project members assigned successfully",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
const unassignProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { personIds, projectId } = req.body;
        if (!Array.isArray(personIds) || typeof projectId !== 'number') {
            throw new response_error_1.ResponseError(400, "Invalid request. 'personIds' must be an array and 'projectId' must be a number.");
        }
        const result = yield ProjectService_1.default.unassignProject({ personIds, projectId });
        return res.status(200).json({
            message: "Project members unassigned successfully",
            data: result
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
    update,
    remove,
    assignProject,
    unassignProject
};
//# sourceMappingURL=projectController.js.map