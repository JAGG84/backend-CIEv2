import mongoose from "mongoose";

const proveedoresSchema = mongoose.Schema( {
    nombre: {
        type: String,
        trim: true,
        require: true,
    },
    direccion: {
        type: String,
        trim: true,
        require: false,
    },
    telefono: {
        type: String,
        trim: true,
        require: false,
    },
    email: {
        type: String,
        trim: true,
        require: false,
        unique: true,
    },
    web: {
        type: String,
        trim: true,
    },
    actividad: {
        type: String,
        trim: true,
        require: false,
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

const Proveedor = mongoose.model('Proveedor', proveedoresSchema);

export default Proveedor;