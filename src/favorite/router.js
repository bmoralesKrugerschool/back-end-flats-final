import { Router } from "express";
import { validateToken } from "../middlewares/validateToken.js";
import { addFavorite, getFavorite, getFavorites, updateFavorite } from './controller.js';
import { isAdmin, isLandlord } from '../auth/controller.js';

const router = Router();

router.post('/addFavorite', validateToken, addFavorite); //ruta para añadir un favorito
router.get('/getFavorites', validateToken, getFavorites); //ruta para obtener todos los favoritos   
router.get('/getFavorite/:id', validateToken, getFavorite); //ruta para obtener un favorito 
router.put('/updateFavorite/:id', validateToken, updateFavorite); //ruta para actualizar un favorito    
export default router;
