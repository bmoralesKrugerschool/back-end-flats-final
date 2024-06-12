/**
 * Servidor de la aplicación
 */
import express from 'express';
import morgan from 'morgan';
import routerAuth from './auth/router.js';
//import routerUsers from './users/router.js 
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/v1',routerAuth);

export default app;