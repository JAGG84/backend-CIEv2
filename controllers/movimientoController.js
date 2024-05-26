import Movimiento from "../models/Movimiento.js";
import Cuenta from "../models/Cuenta.js";
import Subcuenta from "../models/Subcuenta.js";
import Negocio from "../models/Negocio.js";
import Proveedor from "../models/Proveedor.js";
import Concepto from "../models/Concepto.js";
//import Banco from "../models/Banco.js";

const obtenerMovimientos = async (req, res) => {
    try {
        // Obtener parámetros de consulta
        const { fechas, negocios, cuentas, subcuentas, conceptos, proveedores, tipos, mes, anio, orden } = req.query;

        // Crear un objeto de filtro basado en los parámetros proporcionados
        const filtro = {};

        if (fechas) {
            filtro.fecha = { $in: fechas.split(',') };
        }
        if (negocios) {
            filtro.negocio = { $in: negocios.split(',') };
        }
        if (cuentas) {
            filtro.cuenta = { $in: cuentas.split(',') };
        }
        if (subcuentas) {
            filtro.subcuenta = { $in: subcuentas.split(',') };
        }
        if (conceptos) {
            filtro.concepto = { $in: conceptos.split(',') };
        }
        if (proveedores) {
            filtro.proveedor = { $in: proveedores.split(',') };
        }
        if (tipos) {
            filtro.tipo = { $in: tipos.split(',') };
        }

        if (anio && mes) {
            // Separar los años y meses en un array
            const aniosmesesSeleccionados = anio.split(',');
        
            // Crear un array de objetos de filtro para cada año y mes seleccionado
            const filtroAniosMeses = aniosmesesSeleccionados.flatMap(anio => {
                const mesesSeleccionados = mes.split(',');
                return mesesSeleccionados.map(mes => ({
                    fecha: {
                        $gte: new Date(`${anio}-${mes}-01`),
                        $lt: new Date(`${anio}-${parseInt(mes, 10) + 1}-01`)
                    }
                }));
            });
        
            // Combinar los filtros de cada año y mes con un operador $or
            filtro.$or = filtroAniosMeses;
        
        } else if (anio) {
            // Separar los años en un array
            const aniosSeleccionados = anio.split(',');
        
            // Crear un array de objetos de filtro para cada año seleccionado
            const filtroAnios = aniosSeleccionados.map(a => ({
                fecha: {
                    $gte: new Date(`${a}-01-01`),
                    $lt: new Date(`${parseInt(a, 10) + 1}-01-01`)
                }
            }));
        
            // Combinar los filtros de cada año con un operador $or
            filtro.$or = filtroAnios;
        
        } else if (mes) {
            // Separar los meses en un array
            const mesesSeleccionados = mes.split(',');
        
            // Crear un array de objetos de filtro para cada mes seleccionado
            const filtroMeses = mesesSeleccionados.map(m => ({
                fecha: {
                    $gte: new Date(anio || new Date().getFullYear(), parseInt(m, 10) - 1, 1),
                    $lt: new Date(anio || new Date().getFullYear(), parseInt(m, 10), 1)
                }
            }));
        
            // Combinar los filtros de cada mes con un operador $or
            filtro.$or = filtro.$or || [];
            filtro.$or.push(...filtroMeses);
        }

        for (const condicion of filtro.$or) {
            console.log(condicion.fecha);
        }

        // Obtener todos los movimientos según el filtro y aplicar el orden
        let movimientos;
        if (orden === "desc") {
            movimientos = await Movimiento.find(filtro).sort({ fecha: -1 });
        } else {
            movimientos = await Movimiento.find(filtro).sort({ fecha: 1 });
        }

        res.json(movimientos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};






const nuevoMovimiento = async (req, res) => {
    console.log(req)

    const movimiento = new Movimiento(req.body);
    console.log(movimiento)
    movimiento.creador = req.usuario._id;
    try {
        // Comprobar si el Negocio ya existe
        const existeNegocio = await Negocio.findOne({ _id: movimiento.negocio });
        console.log(existeNegocio);
        if (!existeNegocio) {
            const error = new Error("El Negocio no existe.");
            return res.status(404).json({ msg: error.message });
        }
        // Comprobar si la Cuenta ya existe
        /*const existeCuenta = await Cuenta.findOne({ _id: movimiento.concepto });
        if (!existeCuenta) {
            const error = new Error("La cuenta no existe.");
            return res.status(404).json({ msg: error.message });
        }*/
        // Comprobar si la Subcuenta ya existe
        /*const existeSubcuenta = await Subcuenta.findOne({ _id: movimiento.subconcepto });
        if (!existeSubcuenta) {
            const error = new Error("La subcuenta no existe.");
            return res.status(404).json({ msg: error.message });
        }*/
        // Comprobar si la Concepto ya existe
        /*const existeConcepto = await Concepto.findOne({ _id: movimiento.concepto });
        if (!existeConcepto) {
            const error = new Error("El concepto no existe.");
            return res.status(404).json({ msg: error.message });
        }*/
        // Comprobar si la Proveedor ya existe
        /*const existeProveedor = await Proveedor.findOne({ _id: movimiento.proveedor });
        if (!existeProveedor) {
            const error = new Error("El proveedor no existe.");
            return res.status(404).json({ msg: error.message });
        }*/
        const movimientoAlmacenado = await movimiento.save()
        console.log(movimientoAlmacenado)
        //console.log(data)
        res.json({ movimientoAlmacenado });

    } catch (error) {
        console.log(error);
    }
};
const obtenerMovimiento = async (req, res) => {
    const { id } = req.params;
    const movimiento = await Movimiento.findById(id);
    if (!movimiento) {
        const error = new Error("No encontrado");
        return res.status(404).json({ msg: error.message });
    }

    res.json(movimiento);
};
const obtenerMovimientosPorNegocios = async (req, res) => {
    try {
        const { negocios } = req.params;

        // Verificar si negocios está presente en la solicitud
        if (!negocios || negocios.length === 0) {
            return res.status(400).json({ msg: "Se requiere al menos un negocio en la solicitud" });
        }

        // Convertir la cadena de IDs de negocios en un arreglo
        const arregloNegocios = negocios.split(',');

        // Buscar los movimientos que tengan un negocio incluido en el arreglo de negocios
        const movimientos = await Movimiento.find({ negocio: { $in: arregloNegocios } });

        if (movimientos.length === 0) {
            return res.status(404).json({ msg: "No se encontraron movimientos para los negocios proporcionados" });
        }

        res.json(movimientos);
    } catch (error) {
        console.error("Error al obtener movimientos por negocios:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};


const editarMovimiento = async (req, res) => {
    const { id } = req.params;
    const movimiento = await Movimiento.findById(id);
    if (!movimiento) {
        const error = new Error("No encontrado");
        return res.status(404).json({ msg: error.message });
    }

    movimiento.fecha = req.body.fecha || movimiento.fecha;
    movimiento.negocio = req.body.negocio || movimiento.negocio;
    movimiento.cuenta = req.body.cuenta || movimiento.cuenta;
    movimiento.subcuenta = req.body.subcuenta || movimiento.subcuenta;
    movimiento.concepto = req.body.concepto || movimiento.concepto;
    movimiento.proveedor = req.body.proveedor || movimiento.proveedor;
    movimiento.tipo = req.body.tipo || movimiento.tipo;
    movimiento.chequeFactura = req.body.chequeFactura || movimiento.chequeFactura;
    movimiento.comentarios = req.body.comentarios || movimiento.comentarios;
    movimiento.ingreso = req.body.ingreso || movimiento.ingreso;
    movimiento.egreso = req.body.egreso || movimiento.egreso;
    movimiento.saldo = req.body.saldo || movimiento.saldo;
    movimiento.balance = req.body.balance || movimiento.balance;

    try {
        // Comprobar si el Negocio ya existe
        const existeNegocio = await Negocio.findOne({ _id: movimiento.negocio });
        console.log(existeNegocio);
        if (!existeNegocio) {
            const error = new Error("El Negocio no existe.");
            return res.status(404).json({ msg: error.message });
        }
        // Comprobar si la Cuenta ya existe
        const existeCuenta = await Cuenta.findOne({ _id: movimiento.cuenta });
        if (!existeCuenta) {
            const error = new Error("La cuenta no existe.");
            return res.status(404).json({ msg: error.message });
        }
        // Comprobar si la Subcuenta ya existe
        const existeSubcuenta = await Subcuenta.findOne({ _id: movimiento.subcuenta });
        if (!existeSubcuenta) {
            const error = new Error("La subcuenta no existe.");
            return res.status(404).json({ msg: error.message });
        }
        // Comprobar si la Concepto ya existe
        const existeConcepto = await Concepto.findOne({ _id: movimiento.concepto });
        if (!existeConcepto) {
            const error = new Error("El concepto no existe.");
            return res.status(404).json({ msg: error.message });
        }
        // Comprobar si la Proveedor ya existe
        /*const existeProveedor = await Proveedor.findOne({ _id: movimiento.proveedor });
        if (!existeProveedor) {
            const error = new Error("El proveedor no existe.");
            return res.status(404).json({ msg: error.message });
        }*/
        const movimientoAlmacenado = await movimiento.save();
        res.json(movimientoAlmacenado);
    } catch (error) {
        console.log(error);
    }
};
const eliminarMovimiento = async (req, res) => {
    const { id } = req.params;
    const movimiento = await Movimiento.findById(id);
    if (!movimiento) {
        const error = new Error("No encontrado");
        return res.status(404).json({ msg: error.message });
    }

    try {
        if (movimiento.ingreso) {
            const regresar = movimiento.balance - movimiento.ingreso;
            movimiento.balance = regresar;
        }
        if (movimiento.egreso) {
            const regresar = movimiento.balance + movimiento.egreso;
            movimiento.balance = regresar;
        }
        // Actualizar el campo 'balance' en el modelo Negocio
        const actualizar = await Negocio.updateOne({ _id: movimiento.negocio }, { $set: { balance: movimiento.balance } });
        console.log(actualizar);
        await movimiento.deleteOne();
        res.json({ msg: "Movimiento eliminado" })
    } catch (error) {
        console.log(error);
    }
};
const eliminarMovimientosPorNegocio = async (req, res) => {
    const { negocioId } = req.params;

    try {
        // Borrar todos los movimientos con el mismo ID de negocio
        const result = await Movimiento.deleteMany({ negocio: negocioId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: "No se encontraron movimientos para eliminar" });
        }

        res.json({ msg: "Movimientos eliminados" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};


export {
    obtenerMovimientos,
    obtenerMovimiento,
    nuevoMovimiento,
    editarMovimiento,
    eliminarMovimiento,
    eliminarMovimientosPorNegocio,
    obtenerMovimientosPorNegocios,
}