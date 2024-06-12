import ApiResponse from "../../utils/apiResponse.js";
import User from "../users/model.js";


export const login = async (req, res) => {

    console.log('REQUES::',req.body);
    
    const { name, lastName, email, password } = req.body;

    if (!name || !lastName || !email || !password) {
        return res.status(400).json(ApiResponse.error(400, 'Todos los campos son requeridos.', null));
    }
    try {
        console.log(req.body);
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.error(500, 'Internal server error',null));
    }
};

/**
 * Resgitra un usuario en la base de datos.
 * @param {*} req 
 * @param {*} res 
 */
export const register = async (req, res) => {
    console.log('REQUES::',req.body);

    const { name, lastName, email, password, birthDate, rol } = req.body;
    
    if (!name || !lastName || !email || !password) {
        return res.status(400).json(ApiResponse.error(400, 'Todos los campos son requeridos.', null));
    }

    try {
        const user = await User.create({ name, lastName, email, password, birthDate, rol });
        res.status(201).json(ApiResponse.success(201, 'User created', user));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.error(500, 'Internal server error',null));
    }
};