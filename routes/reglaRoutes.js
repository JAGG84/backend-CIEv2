import express from "express";
import { obtenerReglas, nuevaRegla, obtenerRegla, editarRegla, eliminarRegla} from "../controllers/reglaController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, obtenerReglas).post(checkAuth, nuevaRegla);
router.route("/:id").get(checkAuth,obtenerRegla).put(checkAuth, editarRegla).delete(checkAuth,eliminarRegla);


export default router;