import mongoose from "mongoose";
const flatSchema = new mongoose.Schema({
    
    realStateType: {
        type: String,
        enum: ['house', 'apartment','studio', 'loft'],
        required: true
    },
    areaSize: {
        type: Number
    },
    city: {
        type: String,
        required: true
    },
    sellType:{
        type: String,
        enum: ['rent', 'sale', 'lease'],
        required: true
    },
    dateAvailable: {
        type: Date,
        default: Date.now
    },
    publishedData: {
        type: Date,
        default: Date.now
    },
    hasAc: {
        type: Boolean
        
    },
    rentPrice: {
        type: Number
    },
    streetName: {
        type: String
        
    },
    streetNumber: {
        type: String
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    yearBuilt: {
        type: Number,
    },
    img: {
        type: Object,
        default:'https://res.cloudinary.com/dv7hsw3kg/image/upload/v1629890099/avatars/avatar-1_ayx1tj.png'
    },
    status: {
        type: Boolean,
        default: true
    },
    bathroom: {
        type: Number,
    },
    bedrooms: {
        type: Number
    },
    parkingLot:{
        type: Number
    },
    petsAllowed: {
        type: Boolean
    }
},{
    timestamps: true
});

export default mongoose.model('Flats',flatSchema)