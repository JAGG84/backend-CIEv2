import Tipo from "../models/Tipo.js";

const obtenerTipos = async (req, res) => {
    try {
        // Obtener parámetros de consulta
        let { tipodepago } = req.query;

        // Verificar si el parámetro tipodepago está codificado en la URL
        const tieneCodificacionURL = /%[0-9A-Fa-f]{2}/.test(tipodepago);

        // Decodificar el parámetro tipodepago si está codificado en la URL
        if (tieneCodificacionURL) {
            tipodepago = decodeURIComponent(tipodepago);
        }

        // Crear un objeto de filtro basado en los parámetros proporcionados
        const filtro = {};
        if (tipodepago) {
            filtro.tipodepago = { $regex: new RegExp(tipodepago, "i") };
        }

        // Aplicar el filtro al buscar tipos
        const tipos = await Tipo.find(filtro);
        res.json(tipos);
    } catch (error) {
        console.error("Error al obtener tipos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const nuevoTipo = async (req, res) => {

    const tipo = new Tipo(req.body);
    tipo.creador = req.usuario._id;
    try {
        const tipoAlmacenado = await tipo.save()
        res.json({tipoAlmacenado});
    } catch (error) {
       console.log(error); 
    }
};
const obtenerTipo = async (req, res) => {
   const {id} = req.params;
   const tipo = await Tipo.findById(id);
   if (!tipo) {
    const error = new Error("No encontrado");
    return res.status(404).json({msg: error.message});
   } 

   res.json(tipo);
};
const editarTipo = async (req, res) => {
    const {id} = req.params;
    const tipo = await Tipo.findById(id);
    if (!tipo) {
        const error = new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    } 

    tipo.tipodepago = req.body.tipodepago || tipo.tipodepago;
    tipo.banco = req.body.banco || tipo.banco;
    tipo.cuenta = req.body.cuenta || tipo.cuenta;
    tipo.descripcion = req.body.descripcion || tipo.descripcion;

    try {
        const tipoAlmacenado = await tipo.save();
        res.json(tipoAlmacenado);
    } catch (error) {
            console.log(error);
    }
};
const eliminarTipo = async (req, res) => {
    const {id} = req.params;
    const tipo = await Tipo.findById(id);
    if (!tipo) {
        const error = new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    } 

    try {
        await tipo.deleteOne();
        res.json({msg: "Tipo de Cuenta eliminada"})
    } catch (error) {
        console.log(error);
    }
};

export {
    obtenerTipos,
    nuevoTipo,
    obtenerTipo,
    editarTipo,
    eliminarTipo
}