import Regla from "../models/Regla.js";

const obtenerReglas = async (req, res) => {
// Obtener parámetros de consulta
const { autorizador, condicion1 } = req.query;

// Crear un objeto de filtro basado en los parámetros proporcionados
const filtro = {};

if (autorizador) {
    filtro.autorizador = { $regex: new RegExp(autorizador, "i") };
}

if (condicion1) {
    // Si condicion1 es un número, busca una igualdad directa
    filtro.condicion1 = isNaN(condicion1) ? { $regex: new RegExp(condicion1, "i") } : parseInt(condicion1);
}
     // Aplicar el filtro al buscar reglas
    const regla = await Regla.find(filtro);
    res.json(regla);
};
const nuevaRegla = async (req, res) => {

    const regla = new Regla(req.body);
    regla.creador = req.usuario._id;
    const ultimosDigitos = regla.numeroCuenta? regla.numeroCuenta.toString() : '';
    regla.ultimosDigitosCuenta = ultimosDigitos.slice(-4);
    
    try {
        // Comprobar si el codigo ya existe
        const existeNumeroCuenta = await Regla.findOne({numeroCuenta: regla.numeroCuenta});
        if (existeNumeroCuenta) {
            const error = new Error("El Número de Cuenta ya existe.");
            return res.status(404).json({msg: error.message});
        }
        const reglaAlmacenado = await regla.save()
        res.json({reglaAlmacenado});
    
    } catch (error) {
       console.log(error); 
    }
};
const obtenerRegla = async (req, res) => {
   const {id} = req.params;
   const regla = await Regla.findById(id);
   if (!regla) {
    const error = new Error("No encontrado");
    return res.status(404).json({msg: error.message});
   } 

   res.json(regla);
};
const editarRegla = async (req, res) => {
    const {id} = req.params;
    const regla = await Regla.findById(id);
    const ultimosDigitos = req.body.numeroCuenta? req.body.numeroCuenta.toString() : '';
    
    if (!regla) {
        const error = new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    } 

    regla.nombre = req.body.nombre || regla.nombre;
    regla.tipo = req.body.tipo || regla.tipo;
    regla.numeroCuenta = req.body.numeroCuenta || regla.numeroCuenta;
    regla.ultimosDigitosCuenta = ultimosDigitos.slice(-4) || regla.ultimosDigitosCuenta
    regla.monto = req.body.monto || regla.monto;
    regla.descripcion = req.body.descripcion || regla.descripcion;

    try {
        const reglaAlmacenado = await regla.save();
        res.json(bancoAlmacenado);
    } catch (error) {
            console.log(error);
    }
};
const eliminarRegla = async (req, res) => {
    const {id} = req.params;
    const regla = await Regla.findById(id);
    if (!regla) {
        const error = new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    } 

    try {
        await regla.deleteOne();
        res.json({msg: "Regla eliminado"})
    } catch (error) {
        console.log(error);
    }
};

export {
    obtenerReglas,
    nuevaRegla,
    obtenerRegla,
    editarRegla,
    eliminarRegla
}