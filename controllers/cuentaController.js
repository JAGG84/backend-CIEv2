import Cuenta from "../models/Cuenta.js";
import Tipo from "../models/Tipo.js";
import Banco from "../models/Banco.js";

const obtenerCuentas = async (req, res) => {
    try {
        // Obtener parámetros de consulta
        let { concepto } = req.query;

        // Verificar si el parámetro concepto está codificado en la URL
        const tieneCodificacionURL = /%[0-9A-Fa-f]{2}|�/.test(concepto);

        // Decodificar el parámetro concepto si está codificado en la URL
        if (tieneCodificacionURL) {
            
            concepto = decodeURIComponent(concepto);
            concepto = concepto.split('�').join('Ó');
        }

        // Crear un objeto de filtro basado en los parámetros proporcionados
        const filtro = {};
        if (concepto) {
            filtro.concepto = { $regex: new RegExp(concepto, "i") };
        }

        // Aplicar el filtro al buscar cuentas
        const cuentas = await Cuenta.find(filtro);
        res.json(cuentas);
    } catch (error) {
        console.error("Error al obtener cuentas:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const nuevaCuenta = async (req, res) => {

    const cuenta = new Cuenta(req.body);
    cuenta.creador = req.usuario._id;
    try {
        const cuentaAlmacenado = await cuenta.save()
        res.json({cuentaAlmacenado});
    
    } catch (error) {
       console.log(error); 
    }
};
const obtenerCuenta = async (req, res) => {
   const {id} = req.params;
   const cuenta = await Cuenta.findById(id);
   if (!cuenta) {
    const error = new Error("No encontrado");
    return res.status(404).json({msg: error.message});
   } 

   res.json(cuenta);
};
const editarCuenta = async (req, res) => {
    const {id} = req.params;
    const cuenta = await Cuenta.findById(id);
    const ultimosDigitos = req.body.numeroCuenta? req.body.numeroCuenta.toString() : '';
    if (!cuenta) {
        const error = new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    } 

    
    
    cuenta.concepto = req.body.concepto;
    cuenta.descripcion = req.body.descripcion;
    cuenta.descripcion2 = req.body.descripcion2;

    try {
        const cuentaAlmacenado = await cuenta.save();
        res.json(cuentaAlmacenado);
    } catch (error) {
            console.log(error);
    }
};
const eliminarCuenta = async (req, res) => {
    const {id} = req.params;
    const cuenta = await Cuenta.findById(id);
    if (!cuenta) {
        const error = new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    } 

    try {
        await cuenta.deleteOne();
        res.json({msg: "Cuenta eliminada"})
    } catch (error) {
        console.log(error);
    }
};

export {
    obtenerCuentas,
    nuevaCuenta,
    obtenerCuenta,
    editarCuenta,
    eliminarCuenta
}