/**
 * @autor: Morales David
 */
import UserModel from '../users/model.js';
import bcryptjs from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';
import ApiResponse from '../../utils/apiResponse.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

/**
 * Registro de usuario para la aplicación.
 * @param {*} req - Cuerpo de la petición
 * @param {*} res - Respuesta de la petición
 * @returns 
 */
export const register = async (req, res) => {
    const { name, lastName, email, password, role, status, birthDate } = req.body;
    
    // Validación de campos obligatorios
    if (!name || !lastName || !email || !password || !role || !status || !birthDate) {
        return res.status(400).json(ApiResponse.error(400, 'Todos los campos son requeridos.', null));
    }

    console.log('Mensajes',req.files)
    console.log('Requiere',req)
    
    try {
        // Verificar si el usuario ya existe
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json(ApiResponse.error(400, 'El correo ya está registrado.', null));
        }

        // Encriptar la contraseña
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Crear nuevo usuario
        const newUser = new UserModel({
            name,
            lastName,
            email,
            password: hashedPassword,
            role,
            status,
            birthDate
        });

        // Guardar el usuario en la base de datos
        const savedUser = await newUser.save();

        // Generar token de acceso
        const token = await createAccessToken({ 
            id: savedUser._id, 
            email: savedUser.email,
            lastName: savedUser.lastName,
            name: savedUser.name,
            role: savedUser.role,
        });

        // Guardar el token en una cookie
        res.cookie('token', token, { httpOnly: true });

        return res.status(201).json(ApiResponse.success(201, 'Usuario registrado con éxito', { token, user: savedUser }));
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json(ApiResponse.error(500, 'Error en el servidor', null));
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

    // Validación de campos obligatorios
    if (!email || !password) {
        return res.status(400).json(ApiResponse.error(400, 'Todos los campos son requeridos.'));
    }

    try {
        // Buscar usuario por email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json(ApiResponse.error(400, 'El usuario no existe.', null));
        }

        // Comparar contraseñas
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json(ApiResponse.error(400, 'Credenciales incorrectas', null));
        }

        // Generar token de acceso
        const token = await createAccessToken({ 
            id: user._id, 
            email: user.email, 
            name: user.name, 
            lastName: user.lastName, 
            role: user.role});

        // Guardar el token en una cookie
        res.cookie('token', token, { httpOnly: true });

        return res.status(200).json(ApiResponse.success(200, 'Inicio de sesión exitoso.', { token, user }));
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json(ApiResponse.error(500, 'Error en el servidor.', null));
    }
};

/**
 * Cierre de sesión de usuario.
 * @param {*} req  
 * @param {*} res - Respuesta de la petición
 * @returns 
 */
export const logout = async (req, res) => {
    res.clearCookie('token');
    return res.status(200).json(ApiResponse.success(200, 'Cierre de sesión exitoso.', null));
};

/**
 * Perfil de usuario.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const profile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json(ApiResponse.error(404, 'Usuario no encontrado.', null));
        }

        const activeUser = {
            id: user._id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        };

        return res.status(200).json(ApiResponse.success(200, 'Perfil de usuario', activeUser));
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json(ApiResponse.error(500, 'Error en el servidor.', null));
    }
};

/**
 * Verificación de rol 'landlord' o 'admin'.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const isLandlord = (req, res, next) => {
    console.log('req.user:', req.user);
    if (req.user.role === 'landlord' || req.user.role === 'admin') {
        return next();
    } else {
        return res.status(403).json({ message: 'No estás autorizado para acceder a este recurso' });
    }
};

/**
 * Verificación de rol 'admin'.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const isAdmin = (req, res, next) => {
    console.log('req.user:', req.user   );
    if (req.user.role === 'admin') {
        return next();
    } else {
        return res.status(403).json({ message: 'No estás autorizado para acceder a este recurso' });
    }
};

/**
 * Manejo de olvido de contraseña.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json(ApiResponse.error(400, 'El correo es requerido.', null));
    }

    // Lógica para manejar el olvido de contraseña (por implementar)
    // Placeholder para la lógica de olvido de contraseña

    return res.status(200).json(ApiResponse.success(200, 'Proceso de recuperación de contraseña iniciado.', null));
};
