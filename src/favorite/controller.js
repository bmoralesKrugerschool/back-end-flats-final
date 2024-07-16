import mongoose from 'mongoose';
import FavoriteModel from './model.js';
import ApiResponse from '../../utils/apiResponse.js';

/**
 * Añadir un nuevo favorito, verificando si ya existe
 * @param {*} req 
 * @param {*} res 
 */
export const addFavorite = async (req, res) => {
    const { user, flats, status } = req.body;
    if (!user || !flats) {
        return res.status(400).json(ApiResponse.error(400, 'All fields are required!.', null));
    }
    try {
        if (!mongoose.Types.ObjectId.isValid(user)) {
            return res.status(400).json(ApiResponse.error(400, 'ID de usuario inválido', null));
        }
        if (!mongoose.Types.ObjectId.isValid(flats)) {
            return res.status(400).json(ApiResponse.error(400, 'ID de flats inválido', null));
        }

        // Verificar si el usuario ya tiene el flats como favorito
        const existingFavorite = await FavoriteModel.findOne({ user: user, flats: flats });
        if (existingFavorite) {
            return res.status(200).json(ApiResponse.success(200, 'El flats ya está marcado como favorito.', existingFavorite));
        }

        // Crear un nuevo favorito si no existe
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


/**
 * Obtener todos los flats favoritos de un solo usuario con paginación
 * @param {*} req 
 * @param {*} res 
 */
export const getUserFlats = async (req, res) => {
    console.log('req.params:', req.params);
    console.log('req.query:', req);
    
    const { page = 1, limit = 10, userId } = req.query;  // Valores por defecto para page y limit

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json(ApiResponse.error(400, 'ID de usuario inválido', null));
    }

    try {
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            populate: 'flats',
            lean: true  // Usar lean para mejorar el rendimiento
        };

        // Buscar todos los favoritos del usuario con paginación y poblar los datos de los flats
        const favorites = await FavoriteModel.paginate({ user: userId }, options);

        // Extraer solo los flats de los favoritos
        const flats = favorites.docs.map(favorite => favorite.flats);

        return res.status(200).json(ApiResponse.success(200, 'Flats obtenidos con éxito', {
            flats,
            totalDocs: favorites.totalDocs,
            totalPages: favorites.totalPages,
            page: favorites.page,
            limit: favorites.limit
        }));
    } catch (error) {
        console.error('Error getting user flats:', error);
        return res.status(500).json(ApiResponse.error(500, 'Error en el servidor', error));
    }
};