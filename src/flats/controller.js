import ApiResponse from '../../utils/apiResponse.js';
import FlatModel from './model.js';
import mongoose from 'mongoose';
import UserModel from '../users/model.js';

export const getFlat = async (req, res) => {
    // por flats se va a traer el flat de la base de datos del usuario segun el id que se le pase

    console.log('getFlat', req);
    const { idFlat } = req.params;
    console.log('idFlat:', idFlat);

    return res.status(200).json(ApiResponse.success(200, 'Flats obtenidos con éxito', null));
}

/**
 * Agregar Flats en la aplicación.
 * @param {*} req body de la petición
 * @param {*} res respuesta de la petición
 * @returns 
 */
export const createFlat = async (req, res) => {
    try {
        const { title, description, areaSize, city, dateAvailable, hasAc, rentPrice, streetName, streetNumber, user, yearBuilt } = req.body;

        // Verificar que todos los campos están presentes
        if (!title || !description || !areaSize || !city || !dateAvailable || !hasAc || !rentPrice || !streetName || !streetNumber || !user || !yearBuilt) {
            return res.status(400).json(ApiResponse.error(400, 'Todos los campos son requeridos.', null));
        }

        // Verificar si el valor del usuario es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(user)) {
            return res.status(400).json(ApiResponse.error(400, 'Invalid user ID', null));
        }

        const newFlat = new FlatModel({
            title,
            description,
            areaSize,
            city,
            dateAvailable,
            hasAc,
            rentPrice,
            streetName,
            streetNumber,
            user: new mongoose.Types.ObjectId(user),
            yearBuilt
        });
        // Guardar el flat
        const savedFlat = await newFlat.save();
        return res.status(201).json(ApiResponse.success(201, 'Flat creado con éxito', savedFlat));
    } catch (error) {
        console.error('Error creating flat:', error);
        return res.status(500).json(ApiResponse.error(500, 'Error interno del servidor', error.message));
    }
}