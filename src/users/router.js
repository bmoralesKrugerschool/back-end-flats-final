import { Router } from "express";
import {getAllUsers} from './controller.js';


const router = Router();

router.get('/getAllUsers', getAllUsers); //ruta para obtener todos los usuarios

export default router;