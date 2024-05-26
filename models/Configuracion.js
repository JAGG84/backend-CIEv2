import mongoose from "mongoose";

const configuracionesSchema = mongoose.Schema( {
    nombre: {
        type: String,
        trim: true,
        require: true,
    },
    logotipo: {
        type: String,
        trim: true,
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
}, {
    timestamps: true
});

const Configuracion = mongoose.model('Configuracion', configuracionesSchema);

export default Configuracion;