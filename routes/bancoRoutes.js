import express from "express";
import { obtenerBancos, nuevoBanco, obtenerBanco, editarBanco, eliminarBanco} from "../controllers/bancoControllers.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, obtenerBancos).post(checkAuth, nuevoBanco);
router.route("/:id").get(checkAuth,obtenerBanco).put(checkAuth, editarBanco).delete(checkAuth,eliminarBanco);


export default router;