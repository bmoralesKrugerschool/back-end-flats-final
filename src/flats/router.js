import { Router } from "express";
import {createFlat, getFlat} from './controller.js';
import { validateToken } from "../middlewares/validateToken.js";

const router = Router();

router.get('/getFlat/:idFlat',validateToken, getFlat);

router.post('/createFlat',validateToken, createFlat);

export default router;