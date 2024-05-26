import Prestamo from "../models/Prestamo.js";

const obtenerPrestamos = async (req, res) => {
    try {
        let filtro = {}; // Inicializar filtro vacío

        // Agregar condición para estado verdadero o falso
        filtro.estado = { $in: [true, false] };

        // Verificar si el parámetro filtro es 'negocios' o 'empleados'
        if (req.query.filtro === 'negocios') {
            filtro.negocio = { $ne: null };
        } else if (req.query.filtro === 'empleados') {
            filtro.empleado = { $ne: null };
        }

        // Consultar la base de datos y ordenar de manera descendente por fecha de creación
        const prestamos = await Prestamo.find(filtro).sort({ createdAt: -1 });

        res.json(prestamos);
    } catch (error) {
        console.error('Error al obtener préstamos:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};


const nuevoPrestamo = async (req, res) => {

    const prestamo = new Prestamo(req.body);
    prestamo.creador = req.usuario._id;
    try {
        const prestamoAlmacenado = await prestamo.save()
        console.log(prestamoAlmacenado);
        res.json({prestamoAlmacenado});
    } catch (error) {
       console.log(error); 
    }
};
const obtenerPrestamo = async (req, res) => {
   const {id} = req.params;
   const prestamo = await Prestamo.findById(id);
   if (!prestamo) {
    const error = new Error("No encontrado");
    return res.status(404).json({msg: error.message});
   } 

   res.json(prestamo);
};
const editarPrestamo = async (req, res) => {
    const {id} = req.params;
    const prestamo = await Prestamo.findById(id);
    if (!prestamo) {
        const error = new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    } 



    prestamo.fechaMovimiento = req.body.fechaMovimiento || prestamo.fechaMovimiento;
    prestamo.negocio = req.body.negocio || prestamo.negocio;
    prestamo.cuenta = req.body.cuenta || prestamo.cuenta;
    prestamo.empleado = req.body.empleado || prestamo.empleado;
    prestamo.monto = req.body.monto || prestamo.monto;
    prestamo.interes = req.body.interes || prestamo.interes;
    prestamo.parcialidades = req.body.parcialidades || prestamo.parcialidades;
    prestamo.abonado = req.body.abonado || prestamo.abonado;
    prestamo.saldo = req.body.saldo || prestamo.saldo;
    prestamo.fechaInicio = req.body.fechaInicio || prestamo.fechaInicio;
    prestamo.fechaFin = req.body.fechaFin || prestamo.fechaFin;
    prestamo.utilidad = prestamo.monto * (prestamo.interes / 100) * (prestamo.parcialidades / 2)

    if (prestamo.saldo <= 0 || req.body.saldo <= 0) {
        prestamo.estado = false;
        prestamo.saldo = 0;
    } else {
        prestamo.estado = true; // O asigna el valor que corresponda cuando el saldo es mayor que cero
    }

    try {
        const prestamoAlmacenado = await prestamo.save();
        console.log(prestamoAlmacenado)
        res.json(prestamoAlmacenado);
    } catch (error) {
            console.log(error);
    }
};
const eliminarPrestamo = async (req, res) => {
    const {id} = req.params;
    const prestamo = await Prestamo.findById(id);
    if (!prestamo) {
        const error = new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    } 

    try {
        await prestamo.deleteOne();
        res.json({msg: "Prestamo eliminado"})
    } catch (error) {
        console.log(error);
    }
};

export {
    obtenerPrestamos,
    nuevoPrestamo,
    obtenerPrestamo,
    editarPrestamo,
    eliminarPrestamo
}