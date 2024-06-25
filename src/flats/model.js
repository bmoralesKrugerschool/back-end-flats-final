import mongoose from "mongoose";
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
    }   
},{
    timestamps: true
});

export default mongoose.model('Flats',flatSchema)