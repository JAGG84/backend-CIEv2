import Configuracion from "../models/Configuracion.js";

const obtenerConfiguraciones = async (req, res) => {
    const configuracion = await Configuracion.find();
    res.json(configuracion);
};
const nuevaConfiguracion = async (req, res) => {

    const configuracion = new Configuracion(req.body);
    configuracion.creador = req.usuario._id;
    try {
        const configuracionAlmacenado = await configuracion.save()
        res.json({configuracionAlmacenado});
    
    } catch (error) {
       console.log(error); 
    }
};
const obtenerConfiguracion = async (req, res) => {
   const {id} = req.params;
   const configuracion = await Configuracion.findById(id);
   if (!configuracion) {
    const error = new Error("No encontrado");
    return res.status(404).json({msg: error.message});
   } 

   res.json(configuracion);
};
const editarConfiguracion = async (req, res) => {
    const {id} = req.params;
    const configuracion = await Configuracion.findById(id);
    
    if (!configuracion) {
        const error = new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    } 

    configuracion.nombre = req.body.nombre || configuracion.nombre;
    configuracion.logotipo = req.body.logotipo || configuracion.logotipo;

    try {
        const configuracionAlmacenado = await configuracion.save();
        res.json(configuracionAlmacenado);
    } catch (error) {
            console.log(error);
    }
};
  
const eliminarConfiguracion = async (req, res) => {
    const {id} = req.params;
    const configuracion = await Configuracion.findById(id);
    if (!configuracion) {
        const error = new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    } 

    try {
        await configuracion.deleteOne();
        res.json({msg: "Configuracion eliminada"})
    } catch (error) {
        console.log(error);
    }
};

export {
    obtenerConfiguraciones,
    nuevaConfiguracion,
    obtenerConfiguracion,
    editarConfiguracion,
    eliminarConfiguracion
}