import mongoose from "mongoose";

const activoSchema = mongoose.Schema( {
    negocio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Negocio',
        require: true,
    },
    bodega: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bodega',
        require: true,
    },
    descripcion: {
        type: String,
        trim: true,
        require: false,
    },
    noSerie: {
        type: String,
        trim: true,
        require: false,
    },
    fechaCompra: {
        type: Date,
        trim: true,
        require: false,
    },
    precioCompra: {
        type: Number,
        default: 0,
        require: false,
    },
    proveedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proveedor',
        require: true,
    },
    tiempoVida: {
        type: Number,
        default: 0,
        require: false,
    },
    depreciacion: {
        type: Number,
        default: 0,
        require: false,
    },
    estimadoReemplazo: {
        type: Date,
        require: false,
    },
    enOperacion: {
        type: Number,
        default: 0,
        require: false,
    },
    costoActual: {
        type: Number,
        default: 0,
        require: false,
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
}, {
    timestamps: true
});

const Activo = mongoose.model('Activo', activoSchema);

export default Activo;