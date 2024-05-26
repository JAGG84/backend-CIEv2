import Banco from "../models/Banco.js";

const obtenerBancos = async (req, res) => {
     // Obtener parámetros de consulta
     const { nombre } = req.query;

     // Crear un objeto de filtro basado en los parámetros proporcionados
     const filtro = {};
     if (nombre) {
         filtro.nombre = { $regex: new RegExp(nombre, "i") };
     }
     // Aplicar el filtro al buscar bancos
    const banco = await Banco.find(filtro);
    res.json(banco);
};
const nuevoBanco = async (req, res) => {

    const banco = new Banco(req.body);
    banco.creador = req.usuario._id;
    const ultimosDigitos = banco.numeroCuenta? banco.numeroCuenta.toString() : '';
    banco.ultimosDigitosCuenta = ultimosDigitos.slice(-4);
    
    try {
        // Comprobar si el codigo ya existe
        const existeNumeroCuenta = await Banco.findOne({numeroCuenta: banco.numeroCuenta});
        if (existeNumeroCuenta) {
            const error = new Error("El Número de Cuenta ya existe.");
            return res.status(404).json({msg: error.message});
        }
        const bancoAlmacenado = await banco.save()
        res.json({bancoAlmacenado});
    
    } catch (error) {
       console.log(error); 
    }
};
const obtenerBanco = async (req, res) => {
   const {id} = req.params;
   const banco = await Banco.findById(id);
   if (!banco) {
    const error = new Error("No encontrado");
    return res.status(404).json({msg: error.message});
   } 

   res.json(banco);
};
const editarBanco = async (req, res) => {
    const {id} = req.params;
    const banco = await Banco.findById(id);
    const ultimosDigitos = req.body.numeroCuenta? req.body.numeroCuenta.toString() : '';
    
    if (!banco) {
        const error = new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    } 

    banco.nombre = req.body.nombre || banco.nombre;
    banco.tipo = req.body.tipo || banco.tipo;
    banco.numeroCuenta = req.body.numeroCuenta || banco.numeroCuenta;
    banco.ultimosDigitosCuenta = ultimosDigitos.slice(-4) || banco.ultimosDigitosCuenta
    banco.monto = req.body.monto || banco.monto;
    banco.descripcion = req.body.descripcion || banco.descripcion;

    try {
        const bancoAlmacenado = await banco.save();
        res.json(bancoAlmacenado);
    } catch (error) {
            console.log(error);
    }
};
const eliminarBanco = async (req, res) => {
    const {id} = req.params;
    const banco = await Banco.findById(id);
    if (!banco) {
        const error = new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    } 

    try {
        await banco.deleteOne();
        res.json({msg: "Banco eliminado"})
    } catch (error) {
        console.log(error);
    }
};

export {
    obtenerBancos,
    nuevoBanco,
    obtenerBanco,
    editarBanco,
    eliminarBanco
}