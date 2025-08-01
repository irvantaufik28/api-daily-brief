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
const ProjectMemberService_1 = __importDefault(require("../service/ProjectMemberService"));
const getMemberByProjectId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = {
            projectId: req.query.projectId,
            fullName: req.query.fullName,
            page: req.query.page,
            size: req.query.size,
            orderBy: req.query.orderBy,
            sortBy: req.query.sortBy
        };
        const members = yield ProjectMemberService_1.default.getMemberByProjectId(request);
        return res.status(200).json({
            message: "success",
            data: members
        });
    }
    catch (error) {
        next(error);
    }
});
const assignUnassignMemberProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const request = {
            projectId: req.body.projectId,
            assignPersonIds: (_a = req.body.assignPersonIds) !== null && _a !== void 0 ? _a : [],
            unassignPersonIds: (_b = req.body.unassignPersonIds) !== null && _b !== void 0 ? _b : [],
        };
        if (!request.projectId) {
            return res.status(400).json({
                message: "projectId is required",
            });
        }
        const result = yield ProjectMemberService_1.default.assignUnassignMemberProject(request);
        return res.status(200).json({
            message: "success",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getMemberByProjectId,
    assignUnassignMemberProject
};
//# sourceMappingURL=projectMemberController.js.map