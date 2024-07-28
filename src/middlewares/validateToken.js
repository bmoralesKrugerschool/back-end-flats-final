/**
 * @autor: Morales David
 * middlewares se ejecutan antes que se ejecuta la ruta, deben de tener req, res, next (valida si se encuentra un token en la cookie)
 */ 
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';
import ApiResponse from '../../utils/apiResponse.js';

// Middleware para validar el token
export const validateToken = async (req, res, next) => {
    console.info('Ingreso a validateToken middleware');

    const token = req.cookies?.token; // Asegúrate de que la cookie esté definida
    
    if (!token) {
        console.warn('Token no encontrado en las cookies');
        return res.status(401).json(ApiResponse.error(401, 'No autorizado', null));
    }

    try {
        const decoded = jwt.verify(token, TOKEN_SECRET);
        req.user = decoded;
        console.info('Token verificado:', decoded);
        next();
    } catch (error) {
        console.error('Error al verificar el token:', error);
        return res.status(500).json(ApiResponse.error(500, 'No autorizado', null));
    } 
};
