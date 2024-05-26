import Bodega from "../models/Bodega.js";

const obtenerBodegas = async (req, res) => {
     // Obtener parámetros de consulta
     const { bodega } = req.query;

     // Crear un objeto de filtro basado en los parámetros proporcionados
     const filtro = {};
     if (bodega) {
         filtro.bodega = { $regex: new RegExp(bodega, "i") };
     }
     // Aplicar el filtro al buscar bodegas
    const bodegas = await Bodega.find(filtro);
    res.json(bodegas);
};
const nuevaBodega = async (req, res) => {

    const bodega = new Bodega(req.body);
    bodega.creador = req.usuario._id;
    
    try {
        const bodegaAlmacenado = await bodega.save()
        res.json({bodegaAlmacenado});
    
    } catch (error) {
       console.log(error); 
    }
};
const obtenerBodega = async (req, res) => {
   const {id} = req.params;
   const bodega = await Bodega.findById(id);
   if (!bodega) {
    const error = new Error("No encontrado");
    return res.status(404).json({msg: error.message});
   } 

   res.json(bodega);
};
const editarBodega = async (req, res) => {
    const {id} = req.params;
    const bodega = await Bodega.findById(id);
    
    if (!bodega) {
        const error = new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    } 

    bodega.negocio = req.body.negocio || bodega.negocio;
    bodega.bodega = req.body.bodega || bodega.bodega;
    bodega.descripcion = req.body.descripcion || bodega.descripcion;

    try {
        const bodegaAlmacenado = await bodega.save();
        res.json(bodegaAlmacenado);
    } catch (error) {
            console.log(error);
    }
};
const eliminarBodega = async (req, res) => {
    const {id} = req.params;
    const bodega = await Bodega.findById(id);
    if (!bodega) {
        const error = new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    } 

    try {
        await bodega.deleteOne();
        res.json({msg: "Bodega eliminado"})
    } catch (error) {
        console.log(error);
    }
};

export {
    obtenerBodegas,
    nuevaBodega,
    obtenerBodega,
    editarBodega,
    eliminarBodega
}