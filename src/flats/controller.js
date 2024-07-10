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
    const { city, minRentPrice, maxRentPrice, minAreaSize, maxAreaSize, page = 1, limit = 3, sortField = 'areaSize', sortOrder = 'desc' } = req.query;
console.log('city:', city);
    console.log('minRentPrice:', minRentPrice);
    console.log('maxRentPrice:', maxRentPrice);
    console.log('minAreaSize:', minAreaSize);
    console.log('maxAreaSize:', maxAreaSize);
    console.log('page:', page);
    console.log('limit:', limit);
    
    const filters = {};
    
    
    if (city) filters.city = city;
    if (minRentPrice) filters.rentPrice = { ...filters.rentPrice, $gte: minRentPrice };
    if (maxRentPrice) filters.rentPrice = { ...filters.rentPrice, $lte: maxRentPrice };
    if (minAreaSize) filters.areaSize = { ...filters.areaSize, $gte: minAreaSize };
    if (maxAreaSize) filters.areaSize = { ...filters.areaSize, $lte: maxAreaSize };

    // Calcular el offset para la paginación
    const offset = (page - 1) * limit;
    /**
     * city: sortDirection,
        rentPrice: sortDirection,
        areaSize: sortDirection
     */

    console.log('filters:', filters);
    console.log('offset:', offset);
    console.log('limit:', limit);
    console.log('page:', page);
    console.log('pageO:', parseInt(page));

    // Convertir sortOrder a -1 o 1
    const sortDirection = sortOrder === 'desc' ? -1 : 1;

    // Definir los campos de ordenación
    const sortOptions = {};
    sortOptions[sortField] = sortDirection;
    

    console.log('sortOptions:', sortOptions);

    try {

        const flats = await FlatModel.find(filters)
        .populate('user')
        .skip(offset)
        .limit(parseInt(limit))
        .sort(sortOptions); // Ordenar por ciudad, precio y tamaño del área

        const flat  = {};
        const totalFlats = await FlatModel.countDocuments(filters);
        flat.flatsTotal = flats.length;
            flat.flats = flats;
            flat.page = page;
            flat.limit = limit;
            flat.pages = Math.ceil(flats.length / limit);
        if(flats.length === 0){
            console.log('david',Math.ceil(totalFlats / limit),totalFlats,limit,page)
            
            return res.status(200).json(ApiResponse.success(200, 'No se encontraron flats', flat));
         } else {
            //flat.flatsO = flats.slice(offset, offset + parseInt(limit));
            console.log('david',Math.ceil(totalFlats / limit),totalFlats,limit,page)
            console.log('aqui',flats.length)
            return res.status(200).json(ApiResponse.success(200, 'Flats obtenidos con éxito', flat));
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
    console.log('Ingreso a updateFlat', req.body)

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
    
    const { page = 1, limit = 10 ,userId} = req.query;  // Valores por defecto para page y limit

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json(ApiResponse.error(400, 'ID de usuario inválido', null));
    }

    try {
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            lean: true  // Usar lean para mejorar el rendimiento
        };

        // Buscar todos los flats creados por el usuario con paginación
        const flats = await FlatModel.paginate({ user: userId }, options);

        return res.status(200).json(ApiResponse.success(200, 'Flats obtenidos con éxito', {
            flats: flats.docs,
            totalDocs: flats.totalDocs,
            totalPages: flats.totalPages,
            page: flats.page,
            limit: flats.limit
        }));
    } catch (error) {
        console.error('Error getting user created flats:', error);
        return res.status(500).json(ApiResponse.error(500, 'Error en el servidor', error));
    }
};