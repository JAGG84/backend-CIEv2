import Subcuenta from "../models/Subcuenta.js";
import Tipo from "../models/Tipo.js";
import Cuenta from "../models/Cuenta.js";
import Banco from "../models/Banco.js";
//import { ConnectionStates } from "mongoose";

const obtenerSubcuentas = async (req, res) => {
    try {
        // Obtener parámetros de consulta
        let { subconcepto } = req.query;
        console.log(subconcepto)

        // Verificar si el parámetro subconcepto está codificado en la URL
        const tieneCodificacionURL = /%[0-9A-Fa-f]{2}|�/.test(subconcepto);

        // Decodificar el parámetro subconcepto si está codificado en la URL
        if (tieneCodificacionURL) {
            subconcepto = decodeURIComponent(subconcepto);
            subconcepto = subconcepto.split('�').join('Ó');
            console.log(subconcepto)
        }

        // Crear un objeto de filtro basado en los parámetros proporcionados
        const filtro = {};
        if (subconcepto) {
            filtro.subconcepto = { $regex: new RegExp(subconcepto, "i") };
        }

        // Aplicar el filtro al buscar subcuentas
        const subcuentas = await Subcuenta.find(filtro);
        
        res.json(subcuentas);
    } catch (error) {
        console.error("Error al obtener subcuentas:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
const nuevaSubcuenta = async (req, res) => {

    const subcuenta = new Subcuenta(req.body);
    subcuenta.creador = req.usuario._id;
    try {
        const subcuentaAlmacenado = await subcuenta.save()
        res.json({subcuentaAlmacenado});
    
    } catch (error) {
       console.log(error); 
    }
};
const obtenerSubcuenta = async (req, res) => {
   const {id} = req.params;
   const subcuenta = await Subcuenta.findById(id);
   if (!subcuenta) {
    const error = new Error("No encontrado");
    return res.status(404).json({msg: error.message});
   } 

   res.json(subcuenta);
};
const editarSubcuenta = async (req, res) => {
    const {id} = req.params;
    const subcuenta = await Subcuenta.findById(id);
    if (!subcuenta) {
        const error = new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    } 

    subcuenta.subconcepto = req.body.subconcepto;
    subcuenta.descripcion = req.body.descripcion;
    subcuenta.descripcion2 = req.body.descripcion2;

    try {
        const subcuentaAlmacenado = await subcuenta.save();
        res.json(subcuentaAlmacenado);
    } catch (error) {
            console.log(error);
    }
};
const eliminarSubcuenta = async (req, res) => {
    const {id} = req.params;
    const subcuenta = await Subcuenta.findById(id);
    if (!subcuenta) {
        const error = new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    } 

    try {
        await subcuenta.deleteOne();
        res.json({msg: "Cuenta eliminada"})
    } catch (error) {
        console.log(error);
    }
};

export {
    obtenerSubcuentas,
    nuevaSubcuenta,
    obtenerSubcuenta,
    editarSubcuenta,
    eliminarSubcuenta
}