import mongoose from "mongoose";

const autorizacionesSchema = mongoose.Schema( {
    autorizador: {
        type: [String],
        trim: true,
        require: true,
    },
    autorizado: {
        type: String,
        trim: true,
        require: true,
    },
    regla: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Regla'
    },
    condicion1: {
        type: Number,
        default: 35
    },
    condicion2: {
        type: Boolean,
        default: false,
    },
    condicion3: {
        type: String,
        trim: true,
    },
    condicion4: {
        type: Date,
        trim: true,
    },
    justificacion: {
        type: String,
        trim: true,
    },
    estado: {
        type: String,
        required: true,
        enum: ["AUTORIZADO", "RECHAZADO","PENDIENTE"],
        default: "PENDIENTE"
    },
    estatus: {
        type: Boolean,
        default: false,
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
}, {
    timestamps: true
});

const Autorizacion = mongoose.model('Autorizacion', autorizacionesSchema);

export default Autorizacion;