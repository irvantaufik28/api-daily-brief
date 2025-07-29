import express from "express";
import personController from "../controller/personController";
import projectController from "../controller/projectController";
import companyController from "../controller/companyController";
import reportController from "../controller/reportController";
import authorized from "../middleware/jwt"
import authController from "../controller/authController";
import { emailQueue } from "../queue/emailQueue";
import emailController from "../controller/emailController";


const router = express.Router();


router.post('/login', authController.login);

router.get('/person', authorized.allowAdmin, personController.get);
router.get('/person/:id', authorized.allowAdmin, personController.getById);
router.post('/person/create', authorized.allowAdmin, personController.create);
router.patch('/person/update/:id', authorized.allowAdmin, personController.update);

router.get('/project', authorized.allowAdmin, projectController.get);
router.get('/project/:id', authorized.allowAdmin, projectController.getByid);
router.post('/project/create', authorized.allowAdmin, projectController.create);
router.patch('/project/update/:id', authorized.allowAdmin, projectController.update);
router.delete('/project/delete/:id', authorized.allowAdmin, projectController.remove);
router.post('/project/member-assign', authorized.allowAdmin, projectController.assignProject);
router.post('/project/member-unassign', authorized.allowAdmin, projectController.unassignProject);

router.get('/company', authorized.allowAdmin, companyController.get);
router.get('/company/:id', authorized.allowAdmin, companyController.getByid);
router.post('/company/create', authorized.allowAdmin, companyController.create);
router.patch('/company/update/:id', authorized.allowAdmin, companyController.update);

router.get('/report', authorized.allowAdmin, reportController.get);
router.get('/report/:id', authorized.allowAdmin, reportController.getByid);
router.post('/report/create', authorized.allowAdmin, reportController.create);
router.patch('/report/update-detail/:id', authorized.allowAdmin, reportController.updateReportDetail);
router.delete('/report/delete/:id', authorized.allowAdmin, reportController.removeReport);
router.delete('/report/delete-detail/:id', authorized.allowAdmin, reportController.removeReportDetail);
router.post("/send-email", authorized.allowAdmin, emailController.sendEmail)

export default router;
