import express from "express";
import { obtenerConceptos, nuevoConcepto, obtenerConcepto, editarConcepto, eliminarConcepto} from "../controllers/conceptoController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, obtenerConceptos).post(checkAuth, nuevoConcepto);
router.route("/:id").get(checkAuth,obtenerConcepto).put(checkAuth, editarConcepto).delete(checkAuth,eliminarConcepto);


export default router;