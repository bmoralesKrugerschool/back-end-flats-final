import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    name:{ //Nombre del usurio
        type:String,
        required: true, //Es requerido
        trim:true, //Elimina espacios al comienzo y al final
        lowercase: true //Convierte a minúsculas
    },
    lastName: {
        type:String,
        required: true,
        trim:true
    },
    email: {
        type:String,
        required: [true, 'El correo es requerido'],
        trim:true,
        unique:true
    },
    password:{  
        type:String,
        required: [true, 'La contraseña es requerida'],
        trim:true,
        minlength: 6,
    },
    role:{ //Rol del usuario o permiso que tiene 
        type:String,
        enum:['admin','landlord','renter'],
        default:'landlord'
    },
    status:{ //Estado del usuario
        type:Boolean,
        default:true
    },
    birthDate:{ //Fecha de nacimiento
        type:Date,
        required:[true, 'La fecha de nacimiento es requerida']
    }

},{
    timestamps: true
});

export default mongoose.model('User',userSchema)