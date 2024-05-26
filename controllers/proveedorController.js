import Proveedor from "../models/Proveedor.js";

const obtenerProveedores = async (req, res) => {
    try {
        // Obtener parámetros de consulta
        let { nombre } = req.query;

        // Verificar si el parámetro nombre está codificado en la URL
        const tieneCodificacionURL = /%[0-9A-Fa-f]{2}/.test(nombre);

        // Decodificar el parámetro nombre si está codificado en la URL
        if (tieneCodificacionURL) {
            nombre = decodeURIComponent(nombre);
        }

        // Crear un objeto de filtro basado en los parámetros proporcionados
        const filtro = {};
        if (nombre) {
            filtro.nombre = { $regex: new RegExp(nombre, "i") };
        }

        // Aplicar el filtro al buscar proveedores
        const proveedores = await Proveedor.find(filtro);
        res.json(proveedores);
    } catch (error) {
        console.error("Error al obtener proveedores:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const nuevoProveedor = async (req, res) => {

    const proveedor = new Proveedor(req.body);
    proveedor.creador = req.usuario._id;
    try {
        const proveedorAlmacenado = await proveedor.save()
        res.json({proveedorAlmacenado});
    } catch (error) {
       console.log(error); 
    }
};
const obtenerProveedor = async (req, res) => {
   const {id} = req.params;
   const proveedor = await Proveedor.findById(id);
   if (!proveedor) {
    const error = new Error("No encontrado");
    return res.status(404).json({msg: error.message});
   } 

   res.json(proveedor);
};
const editarProveedor = async (req, res) => {
    const {id} = req.params;
    const proveedor = await Proveedor.findById(id);
    if (!proveedor) {
        const error = new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    } 

    proveedor.nombre = req.body.nombre || proveedor.nombre;
    proveedor.direccion = req.body.direccion || proveedor.direccion;
    proveedor.telefono = req.body.telefono || proveedor.telefono;
    proveedor.email = req.body.email || proveedor.email;
    proveedor.web = req.body.web || proveedor.web;
    proveedor.actividad = req.body.actividad || proveedor.actividad;
    proveedor.descripcion = req.body.descripcion || proveedor.descripcion;

    try {
        const proveedorAlmacenado = await proveedor.save();
        res.json(proveedorAlmacenado);
    } catch (error) {
            console.log(error);
    }
};
const eliminarProveedor = async (req, res) => {
    const {id} = req.params;
    const proveedor = await Proveedor.findById(id);
    if (!proveedor) {
        const error = new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    } 

    try {
        await proveedor.deleteOne();
        res.json({msg: "Proveedor eliminado"})
    } catch (error) {
        console.log(error);
    }
};

export {
    obtenerProveedores,
    nuevoProveedor,
    obtenerProveedor,
    editarProveedor,
    eliminarProveedor
}