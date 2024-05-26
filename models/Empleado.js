import mongoose from "mongoose";

const empleadosSchema = mongoose.Schema( {
    negocio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Negocio'
    },
    fechaIngreso: {
        type: Date,
        require: true,
    },
    nombres: {
        type: String,
        trim: true,
        require: true,
    },
    apellidos: {
        type: String,
        trim: true,
        require: true,
    },
    curp: {
        type: String,
        trim: true,
        unique: true,
        require: true
        
    },
    fechaNacimiento: {
        type: Date,
        require: true,
    },
    puesto: {
        type: String,
        trim: true,
        require: true,
    },
    celular: {
        type: String,
        trim: true,
        require: true,
    },
    telcasa: {
        type: String,
        trim: true,
        require: true,
    },
    direccion: {
        type: String,
        trim: true,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,

    },
    contacto: {
        type: String,
        trim: true,
        require: true,
    },
    celularContacto: {
        type: String,
        trim: true,
        require: true,
    },
    salario: {
        type: String,
        trim: true,
        require: true,
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
}, {
    timestamps: true
});

const Empleado = mongoose.model('Empleado', empleadosSchema);

export default Empleado;