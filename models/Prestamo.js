import mongoose from "mongoose";

const prestamosSchema = mongoose.Schema( {
    fechaMovimiento: {
        type: Date,
        require: true,
        default: Date.now()
    },
    negocio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Negocio',
        required: false 
    },
    cuenta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cuenta',
        require: true
    },
    empleado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Empleado',
        required: false 
    },
    monto: {
        type: Number,
        default: 0,
        require: true
    },
    interes: {
        type: Number,
        default: 0,
        require: true
    },
    parcialidades: {
        type: Number,
        default: 0,
        require: true
    },
    abonado: {
        type: Number,
        default: 0,
        require: true
    },
    saldo: {
        type: Number,
        default: 0,
        require: true
    },
    utilidad: {
        type: Number,
        default: 0,
        require: true
    },
    fechaInicio: {
        type: Date,
        require: true,
        default: Date.now()
    },
    fechaFin: {
        type: Date,
        require: true,
        default: Date.now()
    },
    estado: {
        type: Boolean,
        default: true,
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
}, {
    timestamps: true
});

const Prestamo = mongoose.model('Prestamo', prestamosSchema);

export default Prestamo;