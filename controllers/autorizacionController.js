import Autorizacion from "../models/Autorizacion.js";
import { emailSolicitudDeAutorizacion } from "../helpers/email.js";

const obtenerAutorizaciones = async (req, res) => {
    // Obtener parámetros de consulta
    const { autorizador, condicion1, estatus, autorizado, estado, orden } = req.query;

    // Crear un objeto de filtro basado en los parámetros proporcionados
    const filtro = {};

    if (autorizador) {
        filtro.autorizador = { $regex: new RegExp(autorizador, "i") };
    }

    if (condicion1) {
        // Si condicion1 es un número, busca una igualdad directa
        filtro.condicion1 = isNaN(condicion1) ? { $regex: new RegExp(condicion1, "i") } : parseInt(condicion1);
    }

    if (estatus !== undefined && estatus !== null) {
        // Si estatus es un booleano, asigna directamente
        filtro.estatus = typeof estatus === 'boolean' ? estatus : estatus.toLowerCase() === 'true';
    }

    if (autorizado) {
        filtro.autorizado = { $regex: new RegExp(autorizado, "i") };
    }

    if (estado) {
        filtro.estado = { $regex: new RegExp(estado, "i") };
    }
    let autorizacionQuery = Autorizacion.find(filtro);
    // Aplicar el orden según el parámetro recibido
    if (orden && orden.toLowerCase() === 'desc') {
        autorizacionQuery = autorizacionQuery.sort({ createdAt: -1 }); // Orden descendente por fecha de creación
    } else {
        autorizacionQuery = autorizacionQuery.sort({ createdAt: 1 }); // Orden ascendente por fecha de creación (predeterminado)
    }
    // Aplicar el filtro al buscar autorizaciones
    const autorizacion = await autorizacionQuery.exec();
    res.json(autorizacion);
};
const obtenerNotificaciones = async (req, res) => {
    try {
        // Obtener parámetros de consulta
        const { autorizador, estado } = req.query;

        // Crear un objeto de filtro basado en los parámetros proporcionados
        const filtro = {};

        if (autorizador) {
            filtro.autorizador = { $regex: new RegExp(autorizador, "i") };
        }

        if (estado !== undefined && estado !== null) {
            // Si estado es un booleano, asigna directamente
            filtro.estado = { $regex: new RegExp(estado, "i") };
        }

        // Contar el número de autorizaciones que cumplen con el filtro
        const cantidadNotificaciones = await Autorizacion.countDocuments(filtro);

        // Responder con la cantidad de notificaciones
        res.json({ cantidadNotificaciones });
    } catch (error) {
        console.error('Error en obtenerNotificaciones:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

const nuevaAutorizacion = async (req, res) => {

    const autorizacion = new Autorizacion(req.body);
    autorizacion.creador = req.usuario._id;

    try {
        const autorizacionAlmacenado = await autorizacion.save()

        // Enviar el email para autorizacion
        emailSolicitudDeAutorizacion({
            email: req.body.autorizador,
            nombre: req.usuario.nombre,
            justificacion: req.body.justificacion,
        });
        res.json({ autorizacionAlmacenado });

    } catch (error) {
        console.log(error);
    }
};
const obtenerAutorizacion = async (req, res) => {
    const { id } = req.params;
    const autorizacion = await Autorizacion.findById(id);
    if (!autorizacion) {
        const error = new Error("No encontrado");
        return res.status(404).json({ msg: error.message });
    }

    res.json(autorizacion);
};
const editarAutorizacion = async (req, res) => {
    const { id } = req.params;
    const autorizacion = await Autorizacion.findById(id);
    const ultimosDigitos = req.body.numeroCuenta ? req.body.numeroCuenta.toString() : '';

    if (!autorizacion) {
        const error = new Error("No encontrado");
        return res.status(404).json({ msg: error.message });
    }

    autorizacion.nombre = req.body.nombre || autorizacion.nombre;
    autorizacion.tipo = req.body.tipo || autorizacion.tipo;
    autorizacion.numeroCuenta = req.body.numeroCuenta || autorizacion.numeroCuenta;
    autorizacion.ultimosDigitosCuenta = ultimosDigitos.slice(-4) || autorizacion.ultimosDigitosCuenta
    autorizacion.monto = req.body.monto || autorizacion.monto;
    autorizacion.descripcion = req.body.descripcion || autorizacion.descripcion;

    try {
        const autorizacionAlmacenado = await autorizacion.save();
        res.json(bancoAlmacenado);
    } catch (error) {
        console.log(error);
    }
};

const rechazarSolicitud = async (req, res) => {
    const { id } = req.params;
    const autorizacion = await Autorizacion.findById(id);

    if (!autorizacion) {
        const error = new Error("No encontrado");
        return res.status(404).json({ msg: error.message });
    }

    autorizacion.estado = "RECHAZADO";
    autorizacion.estatus = false;


    try {
        const autorizacionAlmacenado = await autorizacion.save();
        res.json(autorizacionAlmacenado);
    } catch (error) {
        console.log(error);
    }
};

const autorizarSolicitud = async (req, res) => {
    const { id } = req.params;
    const autorizacion = await Autorizacion.findById(id);

    if (!autorizacion) {
        const error = new Error("No encontrado");
        return res.status(404).json({ msg: error.message });
    }

    autorizacion.estado = "AUTORIZADO";
    autorizacion.estatus = true;


    try {
        const autorizacionAlmacenado = await autorizacion.save();
        res.json(autorizacionAlmacenado);
    } catch (error) {
        console.log(error);
    }
};

const eliminarAutorizacion = async (req, res) => {
    const { id } = req.params;
    const autorizacion = await Autorizacion.findById(id);
    if (!autorizacion) {
        const error = new Error("No encontrado");
        return res.status(404).json({ msg: error.message });
    }

    try {
        await autorizacion.deleteOne();
        res.json({ msg: "Autorizacion eliminado" })
    } catch (error) {
        console.log(error);
    }
};

export {
    obtenerAutorizaciones,
    nuevaAutorizacion,
    obtenerAutorizacion,
    editarAutorizacion,
    eliminarAutorizacion,
    obtenerNotificaciones,
    rechazarSolicitud,
    autorizarSolicitud
}