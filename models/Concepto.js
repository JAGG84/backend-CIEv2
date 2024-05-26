import mongoose from "mongoose";

const conceptosSchema = mongoose.Schema( {
    nombre: {
        type: String,
        trim: true,
        require: true,
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

const Concepto = mongoose.model('Concepto', conceptosSchema);

export default Concepto;