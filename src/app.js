/**
 * Servidor de la aplicación
 */
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import routerAuth from './auth/router.js';
import routerFlats from './flats/router.js';
import routerFavorites from './favorite/router.js';
import cors from 'cors';
import routerUsers from './users/router.js'; 
import fileUpload from 'express-fileupload';
const app = express();
app.use(cors(
    {
        origin: 'http://localhost:5173'
    }

));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './uploads'
}));

app.use('/api/v1/user',routerAuth); //RUTA GENERAL DE USUARIO
app.use('/api/v1/flats',routerFlats); //RUTA GENERAL DE LOS FLATS
app.use('/api/v1/users',routerUsers); //RUTA GENERAL DE LOS USUARIOS
app.use('/api/v1/favorites',routerFavorites); //RUTA GENERAL DE LOS USUARIOS
export default app;