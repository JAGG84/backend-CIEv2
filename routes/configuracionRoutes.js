import express from "express";
import { obtenerConfiguraciones, nuevaConfiguracion, obtenerConfiguracion, editarConfiguracion, eliminarConfiguracion} from "../controllers/configuracionController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, obtenerConfiguraciones).post(checkAuth, nuevaConfiguracion);
router.route("/:id").get(checkAuth,obtenerConfiguracion).put(checkAuth, editarConfiguracion).delete(checkAuth,eliminarConfiguracion);


export default router;