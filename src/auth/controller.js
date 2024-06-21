/**
 * @autor: Morales David
 */
import UserModel from '../users/model.js';
import bcryptjs from 'bcryptjs'; // For ES modules
import {createAccessToken} from '../libs/jwt.js';
import ApiResponse from '../../utils/apiResponse.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
/**
 * Registro de usuario para la aplicación.
 * @param {*} req bdoy de la petición
 * @param {*} res respuesta de la petición
 * @returns 
 */
export const register = async (req, res) => {
    const { name, lastName, email, password, role, status, birthDate} = req.body;

    if (!name || !lastName || !email || !password || !role || !status || !birthDate) {
        return res.status(400).json(ApiResponse.error(400, 'Todos los campos son requeridos.', null));
    }
    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json(ApiResponse.error(400,'El correo ya está registrado.', null));
        }
        //Encriptar la contraseña
        const hashedPassword = await bcryptjs.hash(password, 10);
        //Nuevo usuario
        const newUser = new UserModel({
            name,
            lastName,
            email,
            password: hashedPassword,
            role,
            status,
            birthDate
        });
        //Guardar el usuario
        const savedUser = await newUser.save();

        const token = await createAccessToken({ id: savedUser._id, email: savedUser.email });
        //const token = await createAccessToken({ id: savedUser._id, email: savedUser.email });
        //Guardar el token en una cookie
        res.cookie('token', token, { httpOnly: true });
        return res.status(201).json(ApiResponse.success(201,'Usuario registrado con éxito', { token }));
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json(ApiResponse.error(500,'Error en el servidor', null));
    }
};

/**
 * Login de usuario en la aplicación.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json(ApiResponse.error('Todos los campos son requeridos.'));
    }
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json(ApiResponse.error(400,'Credenciales incorrectas',null));
        }
        //comparar contraseñas mediante bcryptjs
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json(ApiResponse.error(400,'Credenciales incorrectas',null));
        }
        // 
        const token = await createAccessToken({ id: user._id, email: user.email });
        //Guardar el token en una cookie
        res.cookie('token', token, { httpOnly: true });
        return res.status(200).json(ApiResponse.success(200,'Inicio de sesión exitoso.',{ token } ));
    } catch (error) {
        console.error('Error::', error);
        return res.status(500).json(ApiResponse.error(500,'Error en el servidor.', null));
    }
};
/**
 * Cierre de sesión de usuario.
 * @param {*} req  
 * @param {*} res  respuesta de la petición
 * @returns 
 */
export const logout = async (req, res) => {
    res.clearCookie('token');
    return res.status(200).json(ApiResponse.success(200,'Cierre de sesión exitoso.', null));
}

/**
 * Perfil de usuario.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const profile = async (req, res) => { 
    const user = await UserModel.findById(req.user.id);
    if (!user) {
        return res.status(404).json(ApiResponse.error(404,'Usuario no encontrado.', null));
    }
    const activeUser = {
        id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email
    }
    return res.status(200).json(ApiResponse.success(200,'Perfil de usuario', activeUser));
}