import ApiResponse from '../../utils/apiResponse.js';
import FlatModel from './model.js';
import mongoose from 'mongoose';
import { uploadMultipleImages } from '../libs/cloudDinary.js';
import fs from 'fs-extra';
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
    console.log('Ingreso a getFlats', req.query);

    const { city, minRentPrice, maxRentPrice, minAreaSize, maxAreaSize,  sortField = 'areaSize', sortOrder = 'desc' } = req.query;


    const filters = {};


    if (city) filters.city = city;
    if (minRentPrice) filters.rentPrice = { ...filters.rentPrice, $gte: minRentPrice };
    if (maxRentPrice) filters.rentPrice = { ...filters.rentPrice, $lte: maxRentPrice };
    if (minAreaSize) filters.areaSize = { ...filters.areaSize, $gte: minAreaSize };
    if (maxAreaSize) filters.areaSize = { ...filters.areaSize, $lte: maxAreaSize };

    console.log('filters:', filters);
    console.log('sortField:', sortField);
    console.log('sortOrder:', sortOrder);
    console.log('sortOrder:', sortOrder);
    



    // Convertir sortOrder a -1 o 1
    const sortDirection = sortOrder === 'desc' ? -1 : 1;

    // Definir los campos de ordenación
    const sortOptions = {};
    sortOptions[sortField] = sortDirection;


    console.log('sortOptions:', sortOptions);

    try {

        const flats = await FlatModel.find(filters).populate('user') // Ordenar por ciudad, precio y tamaño del área

        
        if (!flats) {
            return res.status(404).json(ApiResponse.error(404, 'Flats no encontrados', null));
        }

        if (flats.length === 0) {
            return res.status(200).json(ApiResponse.success(200, 'No se encontraron flats', flats));
        } else {
            return res.status(200).json(ApiResponse.success(200, 'Flats obtenidos con éxito', flats));
        }

        



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
    let foto = null;
    try {
        const { realStateType, areaSize, city, sellType, publishedData, dateAvailable, hasAc, rentPrice, streetName, streetNumber, user, yearBuilt, bathroom, bedrooms, parkingLot, petsAllowed } = req.body;

        // Verificar que todos los campos están presentes
        if (!realStateType || !sellType || !publishedData) {
            return res.status(400).json(ApiResponse.error(400, 'All fields are required!', null));
        }

        const userExists = await UserModel.findById(user);
        console.log('userExists:', userExists);
        if (!userExists) {
            return res.status(404).json(ApiResponse.error(404, 'User not found', null));
        }

        const userFirstName = userExists.firstName;
        console.log('userName:', userFirstName);

        const userLastName = userExists.lastName;
        console.log('userLastName:', userLastName);

        // Verificar si el valor del usuario es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(user)) {
            return res.status(400).json(ApiResponse.error(400, 'Invalid user ID', null));
        }
        // Subir imagen a Cloudinary
        const nameflat = extractUsername(realStateType);
        console.log('nameflat', nameflat);


        let imageUrls = [];

        if (req.files && req.files.img) {
            const files = Array.isArray(req.files.img) ? req.files.img : [req.files.img];
            imageUrls = await uploadMultipleImages(files, `flats/${nameflat}`);

            // Eliminar archivos temporales
            for (const file of files) {
                console.log('file', file);
                await fs.remove(file.tempFilePath);
            }
        }

     

        console.log('Mensajes', req.body.img);
        const newFlat = new FlatModel({
            realStateType,
            areaSize,
            city,
            sellType,
            publishedData,
            dateAvailable,
            hasAc,
            rentPrice,
            streetName,
            streetNumber,
            yearBuilt,
            bathroom,
            bedrooms,
            parkingLot,
            petsAllowed,
            user: new mongoose.Types.ObjectId(user),
            yearBuilt,
            img: imageUrls,


        });
        

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
    console.log('Ingreso a updateFlat', req.body)

    const { idFlat } = req.params;
    const { realStateType, areaSize, city, dateAvailable, hasAc, rentPrice, streetName, streetNumber, user, yearBuilt } = req.body;
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
            realStateType,
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

/**
 * Eliminar un flat de la base de datos.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const deleteFlat = async (req, res) => {
    const { idFlat } = req.params;
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
        await FlatModel.findByIdAndDelete(idFlat);
        return res.status(200).json(ApiResponse.success(200, 'Flat eliminado con éxito', null));
    } catch (error) {
        console.error('Error deleting flat:', error);
        return res.status(500).json(ApiResponse.error(500, 'Error interno del servidor', error.message));
    }
}




/**
 * Obtener todos los flats creados por un usuario con paginación
 * @param {*} req 
 * @param {*} res 
 */
export const getUserCreatedFlats = async (req, res) => {
    const { idUser } = req.query;
    console.log('idUser:', idUser);

    if (!mongoose.Types.ObjectId.isValid(idUser)) {
        return res.status(400).json(ApiResponse.error(400, 'ID de usuario inválido', null));
    }

    try {
        const flats = await FlatModel.find({ user: idUser }).populate('user');
        return res.status(200).json(ApiResponse.success(200, 'Flats obtenidos con éxito', {
            flats: flats
        }));
    } catch (error) {
        console.error('Error getting user created flats:', error);
        return res.status(500).json(ApiResponse.error(500, 'Error en el servidor', error));
    }
};

/// extras
/**
 * Extraer el nombre de usuario de una dirección de correo electrónico.
 * @param {string} direcion - Dirección de correo electrónico
 * @returns {string} - Nombre de usuario sin caracteres especiales
 */
const extractUsername = (direcion) => {
    const cleanUsername = direcion.replace(/[^a-zA-Z0-9]/g, '').replace(/\s+/g, ''); // Elimina caracteres especiales y espacios
    const randomNumber = Math.floor(100 + Math.random() * 900); // Genera un número aleatorio de 3 dígitos
    return `${cleanUsername}${randomNumber}`; // Añade el número aleatorio al final
}