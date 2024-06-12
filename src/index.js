/**
 * Encargado de arrancar la aplicación
 * porque se coloca js en el import xq es un archivo que es creado por nosotros
 * y no es un modulo de node.
 */

import app from './app.js';
import { connectDB } from './db.js';


connectDB();
const server = process.env.PORT || 3006;
app.listen(server, () => {
    console.log('Servidor iniciado en http://localhost:'+ server);
  }   );