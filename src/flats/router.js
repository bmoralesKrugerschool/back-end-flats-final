import { Router } from "express";
import {getFlat} from './controller.js';


const router = Router();

router.get('/getFlat',getFlat);

export default router;