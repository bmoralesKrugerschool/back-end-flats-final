import mongoose from 'mongoose';


const favoriteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',  // Referencia al modelo User
            required: true,
        },
        flats: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Flats', // Referencia al modelo Flat
            required: true,
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Favorite', favoriteSchema);
