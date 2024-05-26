import mongoose from "mongoose";

const negociosSchema = mongoose.Schema( {
    nombre: {
        type: String,
        trim: true,
        require: true,
    },
    direccion: {
        type: String,
        trim: true,
        require: true,
    },
    telefono: {
        type: String,
        trim: true,
        require: true,
    },
    email: {
        type: String,
        trim: true,
        require: true,
        unique: true,
    },
    web: {
        type: String,
        trim: true,
    },
    actividad: {
        type: String,
        trim: true,
        require: true,
    },
    descripcion: {
        type: String,
        trim: true,
        require: true,
    },
    balance: {
        type: Number,
        trim: true,
        default: 0,
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
}, {
    timestamps: true
});

const Negocio = mongoose.model('Negocio', negociosSchema);

export default Negocio;