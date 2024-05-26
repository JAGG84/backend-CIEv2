import mongoose from "mongoose";

const reglasSchema = mongoose.Schema( {
    autorizador: {
        type: String,
        trim: true,
        require: true,
        unique: true,
    },
    regla: {
        type: String,
        trim: true,
    },
    condicion1: {
        type: Number,
        default: 0,
    },
    condicion3: {
        type: Boolean,
        default: false,
    },
    condicion2: {
        type: String,
        trim: true,
    },
    estatus: {
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

const Regla = mongoose.model('Regla', reglasSchema);

export default Regla;