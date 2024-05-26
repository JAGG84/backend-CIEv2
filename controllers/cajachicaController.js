import CajaChica from "../models/CajaChica.js";
import Negocio from "../models/Negocio.js";
import Tipo from "../models/Tipo.js";
import Cajachica from "../models/CajaChica.js";
import Usuario from "../models/Usuario.js";

const obtenerCajasChicas = async (req, res) => {
    try {
        // Obtener parámetros de consulta
        const { negocios, orden } = req.params;

        // Crear un objeto de filtro basado en los parámetros proporcionados
        const filtro = {};

       
        if (negocios) {
            filtro.negocio = { $in: negocios.split(',') };
        }
        
        // Agregar la condición de filtro para tipoMovimiento
        filtro.tipoMovimiento = 'DETALLE';

        // Obtener todos los movimientos según el filtro y aplicar el orden
        let cajaschicas;
        if (orden === "desc") {
            cajaschicas = await Cajachica.find(filtro);
        } else {
            cajaschicas = await Cajachica.find(filtro);
        }
        //console.log(cajaschicas)

        res.json(cajaschicas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

const obtenerTotalCajaChica = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Imprimir el objeto req.params.id completo
      console.log(req.params.id);
  
      // Verificar si el parámetro id está presente y es válido
      if (!id || id.trim() === '' || id === 'undefined' || id === 0) {
        // Si no hay parámetro id, devolver total = 0
        return res.json({ total: 0 });
      }
  
      // Dividir id por comas para manejar múltiples ids
      const ids = id.split(',').map(item => item.trim());
  
      // Crear un objeto de filtro basado en los ids proporcionados
      const filtro = {
        negocio: { $in: ids },
        tipoMovimiento: 'CAJACHICA'
      };
  
      // Verificar si los ids son válidos en la tabla negocio
      const validNegocios = await Negocio.find({ _id: { $in: ids } });
  
      if (validNegocios.length === 0) {
        // Si no hay negocios válidos, devolver total = 0
        return res.json({ total: 0 });
      }
  
      // Obtener todos los movimientos según el filtro
      const cajaschicas = await Cajachica.find(filtro);
  
      // Calcular el total sumando los valores de total para cada id válido
      const total = cajaschicas.reduce((sum, caja) => sum + caja.total, 0);
  
      // Devolver la respuesta
      res.json({ total });
    } catch (error) {
      console.error(error);
      res.status(500).json({ total: 0, msg: "Error interno del servidor" });
    }
  };
  

const verificarAperturaCajaChica = async (req, res) => {
    try {
      const { negocio, importe } = req.body;
  
      // Verificar si hay registros en la tabla CajaChica con el mismo negocio
      const existeMovimientos = await CajaChica.find({ negocio: negocio });
  
      if (existeMovimientos.length === 0) {
        // Si no hay registros, crear uno nuevo con los datos proporcionados
        const nuevoRegistro = new CajaChica({
          negocio,
          total: importe,
          tipoMovimiento: 'CAJACHICA',
        });
  
        const cajachicaAlmacenado = await nuevoRegistro.save();
  
        res.json({ cajachicaAlmacenado });
      } else {
        // Si ya hay registros, no hacer nada
        res.status(409).json({ message: 'Ya hay un registro de caja chica para este negocio' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Hubo un error al procesar la solicitud.' });
    };
  };


const obtenerMovimientosPorId = async (req, res) => {
    try {
        // Obtener el ID y la fecha de la consulta
        const { id, fecha } = req.params;

        // Verificar si se proporcionó un ID y una fecha
        if (!id || !fecha) {
            return res.status(400).json({ message: 'El ID y la fecha son obligatorios.' });
        }

        // Buscar todos los movimientos con tipoMovimiento igual a "DETALLE" y que pertenezcan al ID y la fecha proporcionados
        const movimientos = await Cajachica.find({ tipoMovimiento: 'DETALLE', negocio: id, fecha: fecha });

        // Calcular la suma de todos los importes
        let sumaImportes = 0;
        movimientos.forEach(movimiento => {
            sumaImportes += movimiento.importe;
        });

        res.json({ totalImportes: sumaImportes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al procesar la solicitud.' });
    }
};



const nuevaCajaChica = async (req, res) => {
    console.log(req.body)
    

    const cajachica = new Cajachica(req.body);
    console.log(cajachica)
    cajachica.creador = req.body.autoriza;
    
    try {
        // Comprobar si el Negocio ya existe
        const existeNegocio = await Negocio.findOne({ _id: cajachica.negocio });
        console.log(existeNegocio);
        if (!existeNegocio) {
            const error = new Error("El Negocio no existe.");
            return res.status(404).json({ msg: error.message });
        }
        // Comprobar si el Tipo ya existe
        const existeTipo = await Tipo.findOne({ _id: cajachica.tipo });
        if (!existeTipo) {
            const error = new Error("El Tipo de Pago no existe.");
            return res.status(404).json({ msg: error.message });
        }

        const cajachicaAlmacenado = await cajachica.save()
        console.log(cajachicaAlmacenado)
        //console.log(data)
        res.json({ cajachicaAlmacenado });

    } catch (error) {
        console.log(error);
    }
};



const nuevoMovimientoCajaChica = async (req, res) => {
    const { negocio, fecha, importe, concepto, tipo, autoriza } = req.body;

    try {

        // Verificar si el negocio existe
        const negocioExistente = await Negocio.findById(negocio);
        if (!negocioExistente) {
            return res.status(400).json({ message: 'El Negocio indicado no existe.' });
        }

        // Verificar si el tipo existe
        const tipoExistente = await Tipo.findById(tipo);
        if (!tipoExistente) {
            return res.status(400).json({ message: 'El Tipo indicado no existe.' });
        }

        // Verificar si el usuario autoriza existe
        /*const usuarioExistente = await Usuario.findById(autoriza);
        if (!usuarioExistente) {
            return res.status(400).json({ message: 'El usuario que autoriza el movimiento no existe.' });
        }*/

        // Obtener el total actual de la caja chica para el negocio indicado
        const cajaChicaActual = await Cajachica.findOne({ negocio: negocio });
        if (!cajaChicaActual) {
            return res.status(400).json({ message: 'Primero debe asignar recursos a la caja chica de este negocio.' });
        }

        // Verificar si el importe es mayor al saldo disponible en la caja chica
        if (importe > cajaChicaActual.total) {
            return res.status(400).json({ message: 'La caja chica no dispone con el dinero suficiente para hacer este movimiento.' });
        }

        // Restar el importe al total actual de la caja chica
        const nuevoTotal = cajaChicaActual.total;

        // Actualizar el total en la base de datos
        cajaChicaActual.total = nuevoTotal;
        await cajaChicaActual.save();

        // Crear el nuevo movimiento en la caja chica
        const nuevoMovimiento = new Cajachica({
            negocio: negocio,
            fecha,
            importe,
            concepto,
            tipo: tipo,
            autoriza: autoriza,
            creador: req.usuario._id
        });

        const movimientoGuardado = await nuevoMovimiento.save();

        const { total, creador, tipoMovimiento, _id, updatedAt, __v, createdAt, ...response } = movimientoGuardado.toObject();

        res.status(201).json({ message: "Nuevo Movimiento en la Caja Chica Registrado correctamente.", movimiento: {negocio: movimientoGuardado.negocio, fecha: movimientoGuardado.fecha, importe: movimientoGuardado.importe, tipo: movimientoGuardado.tipo, autoriza: movimientoGuardado.autoriza} });

        //res.status(201).json({ movimiento: movimientoGuardado });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Hubo un error al procesar la solicitud.' });
    }
};


const obtenerCajaChica = async (req, res) => {
    const { id } = req.params;
    const cajachica = await Cajachica.findById(id);
    if (!cajachica) {
        const error = new Error("No encontrado");
        return res.status(404).json({ msg: error.message });
    }

    res.json(cajachica);
};
const editarCajaChica = async (req, res) => {
    const { id } = req.params;
    const cajachica = await Cajachica.findById(id);

    if (!cajachica) {
        const error = new Error("No encontrado");
        return res.status(404).json({ msg: error.message });
    }

    cajachica.negocio = req.body.negocio || cajachica.negocio;
    cajachica.bodega = req.body.bodega || cajachica.bodega;
    cajachica.descripcion = req.body.descripcion || cajachica.descripcion;
    cajachica.noSerie = req.body.noSerie || cajachica.noSerie;
    cajachica.fechaCompra = req.body.fechaCompra || cajachica.fechaCompra;
    cajachica.precioCompra = req.body.precioCompra || cajachica.precioCompra;
    cajachica.proveedor = req.body.proveedor || cajachica.proveedor;
    cajachica.tiempoVida = req.body.tiempoVida || cajachica.tiempoVida;
    cajachica.depreciacion = req.body.depreciacion || cajachica.depreciacion;
    cajachica.estimadoReemplazo = req.body.estimadoReemplazo || cajachica.estimadoReemplazo;
    cajachica.enOperacion = req.body.enOperacion || cajachica.enOperacion;
    cajachica.costoActual = req.body.costoActual || cajachica.costoActual;
    try {
        const cajachicaAlmacenada = await cajachica.save();
        res.json(cajachicaAlmacenada);
    } catch (error) {
        console.log(error);
    }
};
const eliminarCajaChica = async (req, res) => {
    const { id } = req.params;
    const cajachica = await Cajachica.findById(id);
    if (!cajachica) {
        const error = new Error("No encontrado");
        return res.status(404).json({ msg: error.message });
    }

    try {
        await cajachica.deleteOne();
        res.json({ msg: "Caja Chica eliminada" })
    } catch (error) {
        console.log(error);
    }
};

const cargarSaldo = async (req, res) => {
    const { id } = req.params;
    const { importe } = req.body;

    try {
        const cajachica = await Cajachica.findById(id);

        if (!cajachica) {
            const error = new Error("No encontrado");
            return res.status(404).json({ msg: error.message });
        }

        // Revisar si el importe es cero y si el importe recibido es diferente de cero
        if (cajachica.total === 0 && importe !== 0) {
            cajachica.total = importe;
        } else {
            // Si el importe no es cero, sumarlo al importe actual
            cajachica.total += importe;
        }

        const cajachicaAlmacenada = await cajachica.save();
        
        res.json({ message: "Importe Asignado", cajachica: {total: cajachicaAlmacenada.total} });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Hubo un error al procesar la solicitud.' });
    }
};

const modificarSaldo = async (req, res) => {
    const { id, negocio, total } = req.params;
    const { importe } = req.body;
    console.log(req.body)

    try {
        const cajachica = await Cajachica.findById(id);

        if (!cajachica) {
            const error = new Error("No encontrado");
            return res.status(404).json({ msg: error.message });
        }
        cajachica.total = req.body.total;

        const cajachicaAlmacenada = await cajachica.save();

        console.log("cajachicaAlmacenada")
        console.log(cajachicaAlmacenada)
        
        res.json({ message: "Presupuesto Asignado", cajachica: {total: cajachicaAlmacenada.total} });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Hubo un error al procesar la solicitud.' });
    }
};


export {
    obtenerCajasChicas,
    nuevaCajaChica,
    obtenerCajaChica,
    editarCajaChica,
    eliminarCajaChica,
    cargarSaldo,
    //nuevoMovimiento,
    modificarSaldo,
    verificarAperturaCajaChica,
    obtenerTotalCajaChica,
}