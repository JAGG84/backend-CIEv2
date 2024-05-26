import Negocio from "../models/Negocio.js";
import Usuario from "../models/Usuario.js";

const obtenerNegocios = async (req, res) => {
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

        // Aplicar el filtro al buscar negocios
        const negocios = await Negocio.find(filtro);
        res.json(negocios);
    } catch (error) {
        console.error("Error al obtener negocios:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
const obtenerNegociosPermitidos = async (req, res) => {
    try {
        // Obtener los negocios permitidos del usuario a partir del parámetro de ruta (en este caso, el correo electrónico)
        const email = req.params.usuario;
        const usuario = await Usuario.findOne({ email });

        // Verificar si el usuario existe y si tiene negocios permitidos
        if (!usuario || !usuario.negociosPermitidos || usuario.negociosPermitidos.length === 0) {
            return res.status(404).json({ mensaje: "No se encontraron negocios permitidos para este usuario" });
        }

        // Filtrar los negocios permitidos del usuario para obtener solo aquellos que están en el arreglo `negocios`
        const negociosPermitidos = usuario.negociosPermitidos.filter(negociosPermitidos => negociosPermitidos.includes(negociosPermitidos));

        // Consultar los detalles de los negocios permitidos (esto depende de la estructura de tu modelo de negocio)
        const detallesNegociosPermitidos = await Negocio.find({ _id: { $in: negociosPermitidos } });

        res.json(detallesNegociosPermitidos);
    } catch (error) {
        console.error("Error al obtener negocios permitidos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};


const nuevoNegocio = async (req, res) => {

    const negocio = new Negocio(req.body);
    negocio.creador = req.usuario._id;
    try {
        const negocioAlmacenado = await negocio.save()
        res.json({negocioAlmacenado});
    } catch (error) {
       console.log(error); 
    }
};
const obtenerNegocio = async (req, res) => {
   const {id} = req.params;
   const negocio = await Negocio.findById(id);
   if (!negocio) {
    const error = new Error("No encontrado");
    return res.status(404).json({msg: error.message});
   } 

   res.json(negocio);
};
const editarNegocio = async (req, res) => {
    const {id} = req.params;
    const negocio = await Negocio.findById(id);
    if (!negocio) {
        const error = new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    } 

    negocio.nombre = req.body.nombre || negocio.nombre;
    negocio.direccion = req.body.direccion || negocio.direccion;
    negocio.telefono = req.body.telefono || negocio.telefono;
    negocio.email = req.body.email || negocio.email;
    negocio.web = req.body.web || negocio.web;
    negocio.actividad = req.body.actividad || negocio.actividad;
    negocio.descripcion = req.body.descripcion || negocio.descripcion;

    try {
        const negocioAlmacenado = await negocio.save();
        res.json(negocioAlmacenado);
    } catch (error) {
            console.log(error);
    }
};
const eliminarNegocio = async (req, res) => {
    const {id} = req.params;
    const negocio = await Negocio.findById(id);
    if (!negocio) {
        const error = new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    } 

    try {
        await negocio.deleteOne();
        res.json({msg: "El negocio se eliminó"})
    } catch (error) {
        console.log(error);
    }
};

export {
    obtenerNegocios,
    obtenerNegociosPermitidos,
    nuevoNegocio,
    obtenerNegocio,
    editarNegocio,
    eliminarNegocio
}