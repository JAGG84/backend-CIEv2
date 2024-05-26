import express from "express";
import { obtenerNegocios, nuevoNegocio, obtenerNegocio, editarNegocio, eliminarNegocio, obtenerNegociosPermitidos} from "../controllers/negocioController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, obtenerNegocios).post(checkAuth, nuevoNegocio);
router.route("/:id").get(checkAuth,obtenerNegocio).put(checkAuth, editarNegocio).delete(checkAuth,eliminarNegocio);
router.route("/email/:usuario").get(checkAuth,obtenerNegociosPermitidos)

export default router;
