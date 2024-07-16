import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
const flatSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    areaSize: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    dateAvailable: {
        type: Date,
        required: true,
        default: Date.now
    },
    hasAc: {
        type: Boolean,
        required: true
    },
    rentPrice: {
        type: Number,
        required: true
    },
    streetName: {
        type: String,
        required: true
        
    },
    streetNumber: {
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    yearBuilt: {
        type: Number,
        required: true
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
        required: true
    },
    bedrooms: {
        type: Number,
        required: true
    },
    parkingLot:{
        type: Number,
        required: true
    },
    petsAllowed: {
        type: Boolean
    }
},{
    timestamps: true
});
flatSchema.plugin(mongoosePaginate);

export default mongoose.model('Flats',flatSchema)