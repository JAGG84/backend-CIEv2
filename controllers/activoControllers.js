import Activo from "../models/Activo.js";

const obtenerActivos = async (req, res) => {
     // Obtener parámetros de consulta
     const { nombre } = req.query;

     // Crear un objeto de filtro basado en los parámetros proporcionados
     const filtro = {};
     if (nombre) {
         filtro.nombre = { $regex: new RegExp(nombre, "i") };
     }
     // Aplicar el filtro al buscar Activos
    const activo = await Activo.find(filtro);
    res.json(activo);
};
const nuevoActivo = async (req, res) => {

    const activo = new Activo(req.body);
    activo.creador = req.usuario._id;
    //console.log(activo)
    try {
        const activoAlmacenado = await activo.save()
        res.json({activoAlmacenado});
    
    } catch (error) {
       console.log(error); 
    }
};
const obtenerActivo = async (req, res) => {
   const {id} = req.params;
   const activo = await Activo.findById(id);
   if (!activo) {
    const error = new Error("No encontrado");
    return res.status(404).json({msg: error.message});
   } 

   res.json(activo);
};
const editarActivo = async (req, res) => {
    const {id} = req.params;
    const activo = await Activo.findById(id);
    
    if (!activo) {
        const error = new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    } 

    activo.negocio = req.body.negocio || activo.negocio;
    activo.bodega = req.body.bodega || activo.bodega;
    activo.descripcion = req.body.descripcion || activo.descripcion;
    activo.noSerie = req.body.noSerie || activo.noSerie;
    activo.fechaCompra = req.body.fechaCompra || activo.fechaCompra;
    activo.precioCompra = req.body.precioCompra || activo.precioCompra;
    activo.proveedor = req.body.proveedor || activo.proveedor;
    activo.tiempoVida = req.body.tiempoVida || activo.tiempoVida;
    activo.depreciacion = req.body.depreciacion || activo.depreciacion;
    activo.estimadoReemplazo = req.body.estimadoReemplazo || activo.estimadoReemplazo;
    activo.enOperacion = req.body.enOperacion || activo.enOperacion;
    activo.costoActual = req.body.costoActual || activo.costoActual;
    try {
        const activoAlmacenado = await activo.save();
        res.json(activoAlmacenado);
    } catch (error) {
            console.log(error);
    }
};
const eliminarActivo = async (req, res) => {
    const {id} = req.params;
    const activo = await Activo.findById(id);
    if (!activo) {
        const error = new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    } 

    try {
        await activo.deleteOne();
        res.json({msg: "Activo eliminado"})
    } catch (error) {
        console.log(error);
    }
};

export {
    obtenerActivos,
    nuevoActivo,
    obtenerActivo,
    editarActivo,
    eliminarActivo
}