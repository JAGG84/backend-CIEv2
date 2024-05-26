import express from "express";
import { obtenerCajasChicas, nuevaCajaChica, obtenerCajaChica, editarCajaChica, eliminarCajaChica, cargarSaldo, modificarSaldo, verificarAperturaCajaChica, obtenerTotalCajaChica} from "../controllers/cajachicaController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, obtenerCajasChicas).post(checkAuth, nuevaCajaChica);
router.route("/:id").get(checkAuth,obtenerCajaChica).put(checkAuth, editarCajaChica).delete(checkAuth,eliminarCajaChica).patch(checkAuth, cargarSaldo);
router.route("/activar").post(checkAuth, verificarAperturaCajaChica);
router.route("/presupuesto/:id").patch(checkAuth, modificarSaldo);
router.route("/total/:id?").get(checkAuth, obtenerTotalCajaChica);


export default router;
