import mongoose from "mongoose";

const subcuentasSchema = mongoose.Schema( {
    subconcepto: {
        type: String,
        trim: true,
        require: true,
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

const Subcuenta = mongoose.model('Subcuenta', subcuentasSchema);

export default Subcuenta;