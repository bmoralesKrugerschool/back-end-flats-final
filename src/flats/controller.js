import ApiResponse from '../../utils/apiResponse.js';
import FlatModel from './model.js';
import mongoose from 'mongoose';
import UserModel from '../users/model.js';

/**
 * Extraer un flat de la base de datos.
 * @param {*} req   idFlat del flat a extraer
 * @param {*} res   respuesta de la petición
 * @returns       flat extraído
 */
export const getFlat = async (req, res) => {
    // por flats se va a traer el flat de la base de datos del usuario segun el id que se le pase
    const { idFlat } = req.params;
    console.log('idFlat:', idFlat);
    if (!idFlat) {
        return res.status(400).json(ApiResponse.error(400, 'ID de flat requerido', null));
    }
    // Verificar si el valor del idFlat es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(idFlat)) {
        return res.status(400).json(ApiResponse.error(400, 'ID de flat inválido', null));
    }
    const flat = await FlatModel.findById(idFlat).populate('user');
    console.log('flat:', flat);
    if (!flat) {
        return res.status(404).json(ApiResponse.error(404, 'Flat no encontrado', null));
    }
    return res.status(200).json(ApiResponse.success(200, 'Flat obtenido con éxito', flat));
}

/**
 * Extraer todos los flats de la base de datos.
 * @param {*} req  petición de la aplicación
 * @param {*} res  respuesta de la petición 
 * @returns     todos los flats de la base de datos
 */ 
export const getFlats = async (req, res) => { 
    try {
        const flats = await FlatModel.find();
        return res.status(200).json(ApiResponse.success(200, 'Flats obtenidos con éxito', flats));
    } catch (error) {
        console.error('Error getting flats:', error);
        return res.status(500).json(ApiResponse.error(500, 'Error interno del servidor', error.message));
    }

}



/**
 * Agregar Flats en la aplicación.
 * @param {*} req body de la petición
 * @param {*} res respuesta de la petición
 * @returns 
 */
export const createFlat = async (req, res) => {
    console.log('Ingreso a createFlat', req);
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

/**
 *  Actualizar un flat en la base de datos.
 * @param {*} req   idFlat del flat a actualizar
 * @param {*} res   respuesta de la petición
 * @returns     flat actualizado
 */
export const updateFlat = async (req, res) => { 
    const { idFlat } = req.params;
    const { title, description, areaSize, city, dateAvailable, hasAc, rentPrice, streetName, streetNumber, user, yearBuilt } = req.body;
    if (!idFlat) {
        return res.status(400).json(ApiResponse.error(400, 'ID de flat requerido', null));
    }
    // Verificar si el valor del idFlat es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(idFlat)) {
        return res.status(400).json(ApiResponse.error(400, 'ID de flat inválido', null));
    }
    const flat = await FlatModel.findById(idFlat);
    if (!flat) {
        return res.status(404).json(ApiResponse.error(404, 'Flat no encontrado', null));
    }
    try {
        const updatedFlat = await FlatModel.findByIdAndUpdate(idFlat, {
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
        }, { new: true });
        return res.status(200).json(ApiResponse.success(200, 'Flat actualizado con éxito', updatedFlat));
    } catch (error) {
        console.error('Error updating flat:', error);
        return res.status(500).json(ApiResponse.error(500, 'Error interno del servidor', error.message));
    }

}