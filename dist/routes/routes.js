"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const personController_1 = __importDefault(require("../controller/personController"));
const projectController_1 = __importDefault(require("../controller/projectController"));
const companyController_1 = __importDefault(require("../controller/companyController"));
const reportController_1 = __importDefault(require("../controller/reportController"));
const jwt_1 = __importDefault(require("../middleware/jwt"));
const authController_1 = __importDefault(require("../controller/authController"));
const emailQueue_1 = require("../queue/emailQueue");
const router = express_1.default.Router();
router.post('/login', authController_1.default.login);
router.get('/person', jwt_1.default.allowAdmin, personController_1.default.get);
router.get('/person/:id', jwt_1.default.allowAdmin, personController_1.default.getById);
router.post('/person/create', jwt_1.default.allowAdmin, personController_1.default.create);
router.patch('/person/update/:id', jwt_1.default.allowAdmin, personController_1.default.update);
router.get('/project', jwt_1.default.allowAdmin, projectController_1.default.get);
router.get('/project/:id', jwt_1.default.allowAdmin, projectController_1.default.getByid);
router.post('/project/create', jwt_1.default.allowAdmin, projectController_1.default.create);
router.patch('/project/update/:id', jwt_1.default.allowAdmin, projectController_1.default.update);
router.delete('/project/delete/:id', jwt_1.default.allowAdmin, projectController_1.default.remove);
router.post('/project/member-assign', jwt_1.default.allowAdmin, projectController_1.default.assignProject);
router.post('/project/member-unassign', jwt_1.default.allowAdmin, projectController_1.default.unassignProject);
router.get('/company', jwt_1.default.allowAdmin, companyController_1.default.get);
router.get('/company/:id', jwt_1.default.allowAdmin, companyController_1.default.getByid);
router.post('/company/create', jwt_1.default.allowAdmin, companyController_1.default.create);
router.patch('/company/update/:id', jwt_1.default.allowAdmin, companyController_1.default.update);
router.get('/report', jwt_1.default.allowAdmin, reportController_1.default.get);
router.get('/report/:id', jwt_1.default.allowAdmin, reportController_1.default.getByid);
router.post('/report/create', jwt_1.default.allowAdmin, reportController_1.default.create);
router.patch('/report/update-detail/:id', jwt_1.default.allowAdmin, reportController_1.default.updateReportDetail);
router.delete('/report/delete/:id', jwt_1.default.allowAdmin, reportController_1.default.removeReport);
router.delete('/report/delete-detail/:id', jwt_1.default.allowAdmin, reportController_1.default.removeReportDetail);
router.post("/send-email", async (req, res) => {
    const { email, name } = req.body;
    if (!email || !name) {
        return res.status(400).json({ error: "Email and name are required" });
    }
    // Tentukan `from` berdasarkan NODE_ENV
    const from = process.env.NODE_ENV === "production"
        ? process.env.GMAIL_USER
        : process.env.APP_EMAIL_FROM;
    // Tambahkan ke queue
    await emailQueue_1.emailQueue.add("sendEmail", {
        to: email,
        subject: "Welcome!",
        name,
    });
    res.json({
        message: `✅ Email queued (${process.env.NODE_ENV === "production" ? "Gmail" : "Mailtrap"})`,
        from,
        to: email,
    });
});
exports.default = router;
//# sourceMappingURL=routes.js.map