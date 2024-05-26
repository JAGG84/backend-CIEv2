import mongoose from "mongoose";

const tiposSchema = mongoose.Schema( {
    tipodepago: {
        type: String,
        trim: true,
        require: true,
    },
    banco: {
        type: String,
        trim: true,
    },
    cuenta: {
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

const Tipo = mongoose.model('Tipo', tiposSchema);

export default Tipo;