import express from "express";
import { obtenerBodegas, nuevaBodega, obtenerBodega, editarBodega, eliminarBodega} from "../controllers/bodegaControllers.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, obtenerBodegas).post(checkAuth, nuevaBodega);
router.route("/:id").get(checkAuth,obtenerBodega).put(checkAuth, editarBodega).delete(checkAuth,eliminarBodega);


export default router;