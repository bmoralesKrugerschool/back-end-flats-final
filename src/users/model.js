import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    name:{ //Nombre del usurio
        type:String,
        required: true, //Es requerido
        trim:true, //Elimina espacios al comienzo y al final
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
        minlength: 8 //Mínimo 8 caracteres,
    },
    role:{ //Rol del usuario o permiso que tiene 
        type:String,
        enum:['admin','landlord','renter'],
        default:'landlord'
    },
    status:{ //Estado del usuario
        type:Boolean,
        default:true //false bloqueado, true activo
    },
    birthDate:{ //Fecha de nacimiento
        type:Date,
        required:[true, 'La fecha de nacimiento es requerida']
    },
    photos:{ //Imagen del usuario    
        type:String,
        default:'https://res.cloudinary.com/dv7hsw3kg/image/upload/v1629890099/avatars/avatar-1_ayx1tj.png'
    },



},{
    timestamps: true
});

export default mongoose.model('User',userSchema)