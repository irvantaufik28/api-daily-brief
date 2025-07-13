import express from "express";
import personController from "../controller/personController";
import projectController from "../controller/projectController";
import companyController from "../controller/companyController";

const router = express.Router();

router.get('/person', personController.get);
router.get('/person/:id', personController.getById);
router.post('/person/create', personController.create);
router.delete('/person/update/:id', personController.update);

router.get('/project', projectController.get);
router.get('/project/:id', projectController.getByid);
router.post('/project/create', projectController.create);
router.patch('/project/update/:id', projectController.update);
router.delete('/project/delete/:id', projectController.remove);
router.post('/project/member-assign', projectController.assignProject);
router.post('/project/member-unassign', projectController.unassignProject);

router.get('/company', companyController.get);
router.get('/company/:id', companyController.getByid);
router.post('/company/create', companyController.create);
router.patch('/company/update/:id', companyController.update);


export default router;
