import { Router } from "express";
import {createFlat, 
    getFlat, 
    updateFlat,
    getFlats,
    deleteFlat
,getUserCreatedFlats} from './controller.js';
import { validateToken } from "../middlewares/validateToken.js";

const router = Router();

router.get('/getFlats', getFlats); //ruta para obtener un flat
router.get('/getFlat/:idFlat',validateToken, getFlat); //ruta para obtener un flat
router.post('/createFlat',validateToken, createFlat); //ruta para crear un flat
router.delete('/deleteFlat/:idFlat',validateToken, deleteFlat); //ruta para eliminar un flat
router.put('/updateFlat/:idFlat',validateToken, updateFlat); //ruta para actualizar un flat

//USER POR FLATS
router.get('/getUserCreatedFlats', validateToken, getUserCreatedFlats); //ruta para obtener un flat por usuario


export default router;