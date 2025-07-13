"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const personController_1 = __importDefault(require("../controller/personController"));
const router = express_1.default.Router();
router.get('/person', personController_1.default.get);
router.post('/person/create', personController_1.default.create);
exports.default = router;
//# sourceMappingURL=routes.js.map