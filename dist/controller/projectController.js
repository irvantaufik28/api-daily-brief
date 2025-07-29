"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProjectService_1 = __importDefault(require("../service/ProjectService"));
const response_error_1 = require("../error/response-error");
const get = async (req, res, next) => {
    try {
        const request = {
            fullName: req.query.fullName,
            position: req.query.position,
            status: req.query.status,
            page: req.query.page,
            size: req.query.size,
            orderBy: req.query.orderBy,
            sortBy: req.query.sortBy
        };
        const result = await ProjectService_1.default.get(request);
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
        const result = await ProjectService_1.default.getById(id);
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
        const result = await ProjectService_1.default.create(req.body);
        return res.status(200).json({
            message: "success",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
const update = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const result = await ProjectService_1.default.update(id, req.body);
        return res.status(200).json({
            message: "success",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
const remove = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const result = await ProjectService_1.default.delete(id);
        return res.status(200).json({
            message: "success",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
const assignProject = async (req, res, next) => {
    try {
        const { personIds, projectId } = req.body;
        if (!Array.isArray(personIds) || typeof projectId !== 'number') {
            throw new response_error_1.ResponseError(400, "Invalid request. 'personIds' must be an array and 'projectId' must be a number.");
        }
        const result = await ProjectService_1.default.assignProject({ personIds, projectId });
        return res.status(200).json({
            message: "Project members assigned successfully",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
const unassignProject = async (req, res, next) => {
    try {
        const { personIds, projectId } = req.body;
        if (!Array.isArray(personIds) || typeof projectId !== 'number') {
            throw new response_error_1.ResponseError(400, "Invalid request. 'personIds' must be an array and 'projectId' must be a number.");
        }
        const result = await ProjectService_1.default.unassignProject({ personIds, projectId });
        return res.status(200).json({
            message: "Project members unassigned successfully",
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
    update,
    remove,
    assignProject,
    unassignProject
};
//# sourceMappingURL=projectController.js.map