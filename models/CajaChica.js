import mongoose from "mongoose";

const cajachicaSchema = mongoose.Schema( {
    negocio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Negocio',
        require: true,
    },
    fecha: {
        type: Date,
        trim: true,
        require: true,
    },
    importe: {
        type: Number,
        default: 0,
        require: true,
    },
    total: {
        type: Number,
        default: 0,
        require: true,
    },
    tipo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tipo',
        require: false,
    },
    autoriza: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        require: false,
    },
    autorizaManual: {
        type: String,
        trim: true,
        require: false,
    },
    concepto: {
        type: String,
        trim: true,
        require: false,
    },
    tipoMovimiento:{
        type: String,
        required: true,
        enum: ["CAJACHICA", "MOVIMIENTO","DETALLE"],
        default: "DETALLE"
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
}, {
    timestamps: true
});

const Cajachica = mongoose.model('Cajachica', cajachicaSchema);

export default Cajachica;