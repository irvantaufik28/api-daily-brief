"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PersonService_1 = __importDefault(require("../service/PersonService"));
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
        console.log(request);
        const result = await PersonService_1.default.get(request);
        return res.status(200).json({
            message: "success",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
const getById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const result = await PersonService_1.default.getById(id);
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
        const result = await PersonService_1.default.create(req.body);
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
        const result = await PersonService_1.default.update(id, req.body);
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
    getById,
    create,
    update
};
//# sourceMappingURL=personController.js.map