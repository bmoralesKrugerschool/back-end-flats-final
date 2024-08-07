/**
 * @autor: Morales David
 */
import UserModel from '../users/model.js';
import bcryptjs from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';
import ApiResponse from '../../utils/apiResponse.js';
import {updateImg} from '../libs/cloudDinary.js';
import fs from 'fs-extra';
import crypto from 'crypto';

import VerificationCode from '../code/model.js';

import { sendVerificationEmail } from '../libs/emailService.js';
import e from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

/**
 * Registro de usuario para la aplicación.
 * @param {*} req - Cuerpo de la petición
 * @param {*} res - Respuesta de la petición
 * @returns 
 */
export const register = async (req, res) => {
    const { firstName, lastName, email, password, role, status, birthDate } = req.body;
    
    // Validación de campos obligatorios
    if (!firstName || !lastName || !email || !password || !role || !status || !birthDate ) {
        return res.status(400).json(ApiResponse.error(400, 'All fields are required!.', null));
    }

    console.log('MensajesA',req.files);
    

    try {
        // Verificar si el usuario ya existe
        const existingUser = await UserModel.findOne({ email });
        let foto = null;
        if (existingUser) {
            return res.status(400).json(ApiResponse.error(400, 'El correo ya está registrado.', null));
        }

       
        const idUser = extractUsername(email);
        console.log('idUser',idUser);
        // Subir imagen a Cloudinary
        if(req.files){
            const imagenes = {
                tempFilePath: req.files.photos.tempFilePath,
                user: idUser
            }
            const result = await updateImg(imagenes);
            await fs.remove(req.files.photos.tempFilePath);
            console.log('result',result);
            foto = {
                url: result.secure_url,
                public_id: result.public_id
            };
            
        }

        console.log('Mensajes',req.body.photos);
        

        // Encriptar la contraseña
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Crear nuevo usuario
        const newUser = new UserModel({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            status,
            birthDate,
            photos: foto,
        });

        // Guardar el usuario en la base de datos
        const savedUser = await newUser.save();

        // Generar token de acceso
        const token = await createAccessToken({ 
            id: savedUser._id, 
            email: savedUser.email,
            lastName: savedUser.lastName,
            firstName: savedUser.firstName,
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
        return res.status(400).json(ApiResponse.error(400, 'All fields are required!.'));
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
            firstName: user.firstName, 
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
            firstName: user.firstName,
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

/**
 * ENVIA CORREO CON EL CÓDIGO DE VERIFICACIÓN
 *  @param {*} req 
 *  @param {*} res
 */
export const sendVerificationCode = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json(ApiResponse.error(400, 'Email is required.', null));
    }

    const userExists = await UserModel .findOne({  email });

    console.log('userExists',userExists);

    if (!userExists) {
        return res.status(400).json(ApiResponse.error(400, 'User does not exist.', null));
    }

    const code = crypto.randomBytes(3).toString('hex'); // Genera un código de 6 caracteres
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // El código expira en 10 minutos

    const verificationCode = new VerificationCode({
        email,
        code,
        expiresAt,
    });

    await verificationCode.save();
    await sendVerificationEmail(email, code);
    return res.status(200).json(ApiResponse.error(400, 'Verification code sent to email.', null));
};

/**
 * 
 * SE REALIZA LA VERIFICACIÓN DEL CÓDIGO Y SE ACTUALIZA LA CONTRASEÑA
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const verifyCodeAndResetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
        return res.status(400).json(ApiResponse.error(400, 'Email, code, and new password are required.', null));
    }

    const verificationCode = await VerificationCode.findOne({ email, code });

    if (!verificationCode) {
        return res.status(400).json(ApiResponse.error(400, 'Invalid verification code.', null));
        
    }

    const userExists = await UserModel.findOne({ email });  

    if (!userExists) {
        return res.status(400).json(ApiResponse.error(400, 'User does not exist.', null));
    }



    if (verificationCode.expiresAt < new Date()) {
        return res.status(400).json(ApiResponse.error(400, 'Verification code expired.', null));
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    await UserModel.updateOne({ email }, { password: hashedPassword });
    await VerificationCode.deleteOne({ email, code });
    return res.status(200).json(ApiResponse.error(200, 'Password reset successful.', null));
};

/// extras
/**
 * Extraer el nombre de usuario de una dirección de correo electrónico.
 * @param {string} email - Dirección de correo electrónico
 * @returns {string} - Nombre de usuario sin caracteres especiales
 */
const extractUsername = (email) => {
    const username = email.split('@')[0]; // Extrae la parte antes del @
    const cleanUsername = username.replace(/[^a-zA-Z0-9]/g, ''); // Elimina caracteres especiales
    const randomNumber = Math.floor(100 + Math.random() * 900); // Genera un número aleatorio de 3 dígitos
    return `${cleanUsername}${randomNumber}`; // Añade el número aleatorio al final
}