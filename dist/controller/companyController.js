"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CompanyService_1 = require("../service/CompanyService");
const get = async (req, res, next) => {
    try {
        const request = {
            name: req.query.name,
            page: req.query.page,
            size: req.query.size,
            orderBy: req.query.orderBy,
            sortBy: req.query.sortBy
        };
        const result = await CompanyService_1.CompanyService.get(request);
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
        const result = await CompanyService_1.CompanyService.getById(id);
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
        const result = await CompanyService_1.CompanyService.create(req.body);
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
        const result = await CompanyService_1.CompanyService.update(id, req.body);
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
    update
};
//# sourceMappingURL=companyController.js.map