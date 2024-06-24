import { Router } from "express";
import {createFlat, getFlat} from './controller.js';


const router = Router();

router.get('/getFlat/:idFlat',getFlat);

router.post('/createFlat',createFlat);

export default router;