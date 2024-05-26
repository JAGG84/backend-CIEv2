import mongoose from "mongoose";

const bodegaSchema = mongoose.Schema( {
    negocio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Negocio',
        require: true,
    },
    bodega: {
        type: String,
        trim: true,
        require: true,
    },
    descripcion: {
        type: String,
        trim: true,
        require: false,
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
}, {
    timestamps: true
});

const Bodega = mongoose.model('Bodega', bodegaSchema);

export default Bodega;