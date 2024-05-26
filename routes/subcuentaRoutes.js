import express from "express";
import { obtenerSubcuentas, nuevaSubcuenta, obtenerSubcuenta, editarSubcuenta, eliminarSubcuenta} from "../controllers/subcuentaController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, obtenerSubcuentas).post(checkAuth, nuevaSubcuenta);
router.route("/:id").get(checkAuth,obtenerSubcuenta).put(checkAuth, editarSubcuenta).delete(checkAuth,eliminarSubcuenta);


export default router;