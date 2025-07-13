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
const PersonService_1 = __importDefault(require("../service/PersonService"));
const get = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const personService = new PersonService_1.default();
        const request = {
            fullName: req.query.fullName,
            position: req.query.position,
            status: req.query.status,
            page: req.query.page,
            size: req.query.size,
            orderBy: req.query.orderBy,
            sortBy: req.query.sortBy
        };
        const result = yield personService.get(request);
        return res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const personService = new PersonService_1.default();
        const result = yield personService.create(req.body);
        res.status(200).json({
            success: true,
            message: "Request successful",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    get,
    create
};
//# sourceMappingURL=personController.js.map