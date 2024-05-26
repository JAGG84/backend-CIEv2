import express from "express";
import { obtenerMovimientos, nuevoMovimiento, obtenerMovimiento, editarMovimiento, eliminarMovimiento, eliminarMovimientosPorNegocio, obtenerMovimientosPorNegocios} from "../controllers/movimientoController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, obtenerMovimientos).post(checkAuth, nuevoMovimiento);
router.route("/:id").get(checkAuth,obtenerMovimiento).put(checkAuth, editarMovimiento).delete(checkAuth,eliminarMovimiento);
router.delete('/negocio/:negocioId', checkAuth, eliminarMovimientosPorNegocio);
router.get('/por-negocios/:negocios', checkAuth, obtenerMovimientosPorNegocios);


export default router;