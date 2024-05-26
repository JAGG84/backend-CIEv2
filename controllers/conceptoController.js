import Concepto from "../models/Concepto.js";
/*import Cuenta from "../models/Cuenta.js";
import Tipo from "../models/Tipo.js";*/

const obtenerConceptos = async (req, res) => {
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

        // Aplicar el filtro al buscar conceptos
        const concepto = await Concepto.find(filtro);
        res.json(concepto);
    } catch (error) {
        console.error("Error al obtener conceptos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const nuevoConcepto = async (req, res) => {

    const concepto = new Concepto(req.body);
    concepto.creador = req.usuario._id;
    try {
        const conceptoAlmacenado = await concepto.save()
        res.json({ conceptoAlmacenado });

    } catch (error) {
        console.log(error);
    }
};
const obtenerConcepto = async (req, res) => {
    const { id } = req.params;
    const concepto = await Concepto.findById(id);
    if (!concepto) {
        const error = new Error("No encontrado");
        return res.status(404).json({ msg: error.message });
    }

    res.json(concepto);
};
const editarConcepto = async (req, res) => {
    const { id } = req.params;
    const concepto = await Concepto.findById(id);
    if (!concepto) {
        const error = new Error("No encontrado");
        return res.status(404).json({ msg: error.message });
    }
    concepto.nombre = req.body.nombre;
    concepto.descripcion = req.body.descripcion;

    try {
        const conceptoAlmacenado = await concepto.save();
        res.json(conceptoAlmacenado);
    } catch (error) {
        console.log(error);
    }
};
const eliminarConcepto = async (req, res) => {
    const { id } = req.params;
    const concepto = await Concepto.findById(id);
    if (!concepto) {
        const error = new Error("No encontrado");
        return res.status(404).json({ msg: error.message });
    }

    try {
        await concepto.deleteOne();
        res.json({ msg: "Cuenta eliminada" })
    } catch (error) {
        console.log(error);
    }
};

export {
    obtenerConceptos,
    nuevoConcepto,
    obtenerConcepto,
    editarConcepto,
    eliminarConcepto
}