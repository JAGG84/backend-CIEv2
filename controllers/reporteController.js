import Movimiento from "../models/Movimiento.js";
import Cuenta from "../models/Cuenta.js";

const obtenerReporte = async (req, res) => {
    console.log(req.query)
    
    try {
        // Obtener parámetros de la consulta
        let { inicio, fin, negocio, cuenta, subcuenta, concepto, proveedor, tipo, banco } = req.query;

        // Construir el objeto de filtro
        const filtro = {};
        if (inicio && fin) {
            filtro.fecha = { $gte: new Date(inicio), $lte: new Date(fin) };
        }
        if (negocio) {
            filtro.negocio = negocio;
        }
        if (cuenta) {
            filtro.cuenta = cuenta;
        }
        if (subcuenta) {
            filtro.subcuenta = subcuenta;
        }
        if (concepto) {
            filtro.concepto = concepto;
        }
        if (proveedor) {
            filtro.proveedor = proveedor;
        }
        if (tipo) {
            filtro.tipo = tipo;
        }
        if (banco) {
            let existeBanco = await Cuenta.findOne({ banco: banco }).select('_id banco');
            console.log(existeBanco);
        
            if (existeBanco) {
                filtro.cuenta = existeBanco._id;
                console.log(existeBanco._id);
                console.log(cuenta);
            } else {
                //console.log("Aquí!!!");
                return res.json([]);
            }
        }

        // Obtener los movimientos filtrados
        let movimientos = await Movimiento.find(filtro);

        // Verificar si hay resultados
        if (movimientos.length === 0) {
            return res.json(movimientos);
        }

        // Enviar los movimientos como respuesta
        res.json(movimientos);
    } catch (error) {
        //console.log(error);

        // Manejar errores específicos y enviar mensajes estructurados
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ error: 'ID de objeto no válido.' });
        }

        // Otras verificaciones de errores específicos pueden agregarse según sea necesario

        // Si no se maneja específicamente, enviar un mensaje de error genérico
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
    
};

export {
    obtenerReporte,
}
