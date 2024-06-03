/**
 * Servidor de la aplicación
 */
import express from 'express';
import morgan from 'morgan';
import routerAuth from './../src/auth/router.js';
const app = express();
app.use(morgan('dev'));
app.use(routerAuth);
export default app;