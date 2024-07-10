import mongoose from 'mongoose';
import FavoriteModel from './model.js';
import ApiResponse from '../../utils/apiResponse.js';

/**
 * Añadir un nuevo favorito
 * @param {*} req 
 * @param {*} res 
 */
export const addFavorite = async (req, res) => {
    const { user, flats, status } = req.body;
    if (!user || !flats) {
        return res.status(400).json(ApiResponse.error(400, 'Todos los campos son requeridos.', null));
    }
    try {
        if (!mongoose.Types.ObjectId.isValid(user)) {
            return res.status(400).json(ApiResponse.error(400, 'ID de usuario inválido', null));
        }
        if (!mongoose.Types.ObjectId.isValid(flats)) {
            return res.status(400).json(ApiResponse.error(400, 'ID de flats inválido', null));
        }
        
        const newFavorite = new FavoriteModel({
            user: new mongoose.Types.ObjectId(user),
            flats: new mongoose.Types.ObjectId(flats),
            status: status !== undefined ? status : true
        });
        const savedFavorite = await newFavorite.save();
        return res.status(201).json(ApiResponse.success(201, 'Favorito creado con éxito', savedFavorite));
    } catch (error) {
        console.error('Error creating favorite:', error);
        return res.status(500).json(ApiResponse.error(500, 'Error en el servidor', error));
    }
};

/**
 * Obtener todos los favoritos con datos de usuario y flats
 * @param {*} req 
 * @param {*} res 
 */
export const getFavorites = async (req, res) => {
    try {
        const favorites = await FavoriteModel.find().populate('user').populate('flats');
        return res.status(200).json(ApiResponse.success(200, 'Favoritos obtenidos con éxito', favorites));
    } catch (error) {
        console.error('Error getting favorites:', error);
        return res.status(500).json(ApiResponse.error(500, 'Error en el servidor', error));
    }
};

/**
 * Obtener un favorito específico con datos de usuario y flats
 * @param {*} req 
 * @param {*} res 
 */
export const getFavorite = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json(ApiResponse.error(400, 'El ID es requerido.', null));
    }
    try {
        const favorite = await FavoriteModel.findById(id).populate('user').populate('flats');
        if (!favorite) {
            return res.status(404).json(ApiResponse.error(404, 'Favorito no encontrado.', null));
        }
        return res.status(200).json(ApiResponse.success(200, 'Favorito obtenido con éxito', favorite));
    } catch (error) {
        console.error('Error getting favorite:', error);
        return res.status(500).json(ApiResponse.error(500, 'Error en el servidor', error));
    }
};

/**
 * Actualizar un favorito
 * @param {*} req 
 * @param {*} res 
 */
export const updateFavorite = async (req, res) => {
    const { id } = req.params;
    const { user, flats, status } = req.body;
    if (!id) {
        return res.status(400).json(ApiResponse.error(400, 'El ID es requerido.', null));
    }
    try {
        const favorite = await FavoriteModel.findById(id);
        if (!favorite) {
            return res.status(404).json(ApiResponse.error(404, 'Favorito no encontrado.', null));
        }
        favorite.user = user ? new mongoose.Types.ObjectId(user) : favorite.user;
        favorite.flats = flats ? new mongoose.Types.ObjectId(flats) : favorite.flats;
        favorite.status = status !== undefined ? status : favorite.status;
        const updatedFavorite = await favorite.save();
        return res.status(200).json(ApiResponse.success(200, 'Favorito actualizado con éxito', updatedFavorite));
    } catch (error) {
        console.error('Error updating favorite:', error);
        return res.status(500).json(ApiResponse.error(500, 'Error en el servidor', error));
    }
};
