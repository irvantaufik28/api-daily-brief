import express from "express";
import { logger } from "../application/logging";
import personController from "../controller/personController";

const router = express.Router();

router.get('/person', personController.get);
router.post('/person/create', personController.create);

export default router;
