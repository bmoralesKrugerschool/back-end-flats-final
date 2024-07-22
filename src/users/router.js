import { Router } from "express";
import {getAllUsers, updateUser,getUser, getUserId} from './controller.js';
import { validateToken } from "../middlewares/validateToken.js";
import { isLandlord, isAdmin } from '../auth/controller.js';

const router = Router();

router.get('/getAllUsers',validateToken, getAllUsers); //ruta para obtener todos los usuarios
router.post('/updateUser',validateToken,isLandlord, updateUser); //ruta para actualizar un usuario
router.get('/getUser',validateToken,isAdmin, getUser); //ruta para obtener un usuario
router.get('/getUserId',validateToken,isAdmin, getUserId); //ruta para obtener un usuario
export default router;