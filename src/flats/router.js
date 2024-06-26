import { Router } from "express";
import {createFlat, 
    getFlat, 
    updateFlat,
    getFlats} from './controller.js';
import { validateToken } from "../middlewares/validateToken.js";

const router = Router();

router.get('/getFlats',validateToken, getFlat); //ruta para obtener un flat
router.get('/getFlat/:idFlat',validateToken, getFlat); //ruta para obtener un flat
router.post('/createFlat',validateToken, createFlat); //ruta para crear un flat
router.put('/updateFlat',validateToken, updateFlat); //ruta para actualizar un flat

export default router;