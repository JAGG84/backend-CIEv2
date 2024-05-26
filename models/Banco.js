import mongoose from "mongoose";

const bancosSchema = mongoose.Schema( {
    nombre: {
        type: String,
        trim: true,
        require: true,
    },
    tipo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tipo',
    },
    numeroCuenta: {
        type: String,
        trim: true,
        require: true,
    },
    ultimosDigitosCuenta: {
        type: String,
        trim: true,
        require: true,
    },
    monto: {
        type: String,
        trim: true,
    },
    descripcion: {
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

const Banco = mongoose.model('Banco', bancosSchema);

export default Banco;