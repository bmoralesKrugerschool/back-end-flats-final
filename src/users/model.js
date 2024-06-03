import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name:{ // Nombre del usurio
        type:String,
        required: true, // Es requerido
        trim:true // Elimina espacios al comienzo y al final
    },
    lastName: {
        type:String,
        required: true,
        trim:true 
    },
    emailmail: {
        type:String,
        required: true,
        trim:true,
        unique:true // No se puede repetir
    },
    password:{  
        type:String,
        required: true,
        trim:true
    }

    //Recordar que se debe de hacer teminos y codiciones

},{
    timestamps:true
});

export default mongoose.model('User',userSchema)