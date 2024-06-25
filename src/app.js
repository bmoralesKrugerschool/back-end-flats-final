/**
 * Servidor de la aplicación
 */
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import routerAuth from './auth/router.js';
import routerFlats from './flats/router.js';
//import routerUsers from './users/router.js 
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/user',routerAuth); //RUTA GENERAL DE USUARIO
app.use('/api/v1/flats',routerFlats); //RUTA GENERAL DE LOS FLATS

export default app;