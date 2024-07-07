import { Router } from "express";
import {getAllUsers, updateUser} from './controller.js';
import { validateToken } from "../middlewares/validateToken.js";
import { isLandlord, isAdmin } from '../auth/controller.js';

const router = Router();

router.get('/getAllUsers',validateToken, getAllUsers); //ruta para obtener todos los usuarios
router.post('/updateUser',validateToken,isLandlord, updateUser); //ruta para crear un usuario
export default router;