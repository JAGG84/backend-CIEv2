import mongoose from "mongoose";

const cuentasSchema = mongoose.Schema( {
    concepto: {
        type: String,
        trim: true,
        require: true
    },
    descripcion: {
        type: String,
        trim: true,
    },
    descripcion2: {
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

const Cuenta = mongoose.model('Cuenta', cuentasSchema);

export default Cuenta;