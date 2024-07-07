import ApiResponse from '../../utils/apiResponse.js';
import UserModel from './model.js';

/**
 * Extraer el usuario de la base de datos.
 * @param {*} req 
 * @param {*} res 
 */
export const getAllUsers = async (req, res) => { 
    try {
        console.log('getAll users', req.query);
        
        const filter = req.query.filter || {};
        const queryFilter = {};

        // Filtros
        if (filter.role) {
            queryFilter.role = { $eq: filter.role };
        }
        if (filter.flatCountMin) {
            queryFilter.flatCount = { $gte: parseInt(filter.flatCountMin) };
        }
        if (filter.flatCountMax) {
            queryFilter.flatCount = { ...queryFilter.flatCount, $lte: parseInt(filter.flatCountMax) };
        }

        const orderBy = req.query.orderBy || 'name';
        const order = parseInt(req.query.order) || 1;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await UserModel.aggregate([
            { 
                $lookup: {
                    from: 'flats',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'flats'
                }
            },
            {
                $addFields: {
                    flatCount: { $size: '$flats' }
                }
            },
            {
                $match: queryFilter
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            },
            {
                $sort: { [orderBy]: order }
            }
        ]);

        console.log('users:', users);
        return res.status(200).json(ApiResponse.success(200, 'Usuarios obtenido con éxito', users));
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return res.status(500).json(ApiResponse.error(500, 'Error al obtener usuarios', error));
    }
};
