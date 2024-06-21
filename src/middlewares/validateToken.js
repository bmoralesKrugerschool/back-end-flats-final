/**
 * @autor: Morales David
 * middlewares se ejecutan antes que se ejecuta la ruta, deben de tener req, res, next
 */ 
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';
import ApiResponse from '../utils/apiResponse.js';

export const validateToken = async (req, res, next) => {
    console.info('Ingreso a validateToken middleware');
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json(ApiResponse.error(401, 'No autorizado', null));
    }
    try {
        const decoded = jwt.verify(token, TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json(ApiResponse.error(500, 'No autorizado', null));
    } 
}   
