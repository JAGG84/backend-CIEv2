import Empleado from "../models/Empleado.js";

const obtenerEmpleados = async (req, res) => {
    // Obtener parámetros de consulta
    const { nombre } = req.query;

    // Crear un objeto de filtro basado en los parámetros proporcionados
    const filtro = {};
    if (nombre) {
        filtro.nombre = { $regex: new RegExp(nombre, "i") };
    }
    // Aplicar el filtro al buscar bancos
    const empleados = await Empleado.find(filtro);
    res.json(empleados);
};
const nuevoEmpleado = async (req, res) => {
    console.log(req)
    const empleado = new Empleado(req.body);
    empleado.creador = req.usuario._id;
    try {
        const empleadoAlmacenado = await empleado.save()
        res.json({empleadoAlmacenado});
    } catch (error) {
       console.log(error); 
    }
};
const obtenerEmpleado = async (req, res) => {
   const {id} = req.params;
   const empleado = await Empleado.findById(id);
   if (!empleado) {
    const error = new Error("No encontrado");
    return res.status(404).json({msg: error.message});
   } 

   res.json(empleado);
};
const editarEmpleado = async (req, res) => {
    const {id} = req.params;
    const empleado = await Empleado.findById(id);
    if (!empleado) {
        const error = new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    } 

    empleado.fechaIngreso = req.body.fechaIngreso || empleado.fechaIngreso;
    empleado.nombres = req.body.nombres || empleado.nombres;
    empleado.apellidos = req.body.apellidos || empleado.apellidos;
    empleado.curp = req.body.curp || empleado.curp;
    empleado.fechaNacimiento = req.body.fechaNacimiento || empleado.fechaNacimiento;
    empleado.puesto = req.body.puesto || empleado.puesto;
    empleado.celular = req.body.celular || empleado.celular;
    empleado.telcasa = req.body.telcasa || empleado.telcasa;
    empleado.direccion = req.body.direccion || empleado.direccion;
    empleado.email = req.body.email || empleado.email;
    empleado.contacto = req.body.contacto || empleado.contacto;
    empleado.celularContacto = req.body.celularContacto || empleado.celularContacto;
    empleado.salario = req.body.salario || empleado.salario;

    try {
        const empleadoAlmacenado = await empleado.save();
        res.json(empleadoAlmacenado);
    } catch (error) {
            console.log(error);
    }
};
const eliminarEmpleado = async (req, res) => {
    const {id} = req.params;
    const empleado = await Empleado.findById(id);
    if (!empleado) {
        const error = new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    } 

    try {
        await empleado.deleteOne();
        res.json({msg: "Empleado eliminado"})
    } catch (error) {
        console.log(error);
    }
};

export {
    obtenerEmpleados,
    nuevoEmpleado,
    obtenerEmpleado,
    editarEmpleado,
    eliminarEmpleado
}