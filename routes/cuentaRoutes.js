import express from "express";
import { obtenerCuentas, nuevaCuenta, obtenerCuenta, editarCuenta, eliminarCuenta} from "../controllers/cuentaController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, obtenerCuentas).post(checkAuth, nuevaCuenta);
router.route("/:id").get(checkAuth,obtenerCuenta).put(checkAuth, editarCuenta).delete(checkAuth,eliminarCuenta);


export default router;