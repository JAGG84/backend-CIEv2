import express from "express";
import { obtenerActivos, nuevoActivo, obtenerActivo, editarActivo, eliminarActivo} from "../controllers/activoControllers.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, obtenerActivos).post(checkAuth, nuevoActivo);
router.route("/:id").get(checkAuth,obtenerActivo).put(checkAuth, editarActivo).delete(checkAuth,eliminarActivo);


export default router;