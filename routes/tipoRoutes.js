import express from "express";
import { obtenerTipos, nuevoTipo, obtenerTipo, editarTipo, eliminarTipo} from "../controllers/tipoController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, obtenerTipos).post(checkAuth, nuevoTipo);
router.route("/:id").get(checkAuth,obtenerTipo).put(checkAuth, editarTipo).delete(checkAuth,eliminarTipo);


export default router;