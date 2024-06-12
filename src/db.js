import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();

export const connectDB = async () => {
  try {
    console.log("Conexión:::: || ----",process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
    });

    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};