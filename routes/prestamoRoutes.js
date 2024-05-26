import express from "express";
import { obtenerPrestamos, nuevoPrestamo, obtenerPrestamo, editarPrestamo, eliminarPrestamo} from "../controllers/prestamoController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

//router.route("/prestamos").get(checkAuth, obtenerPrestamos);
//router.route("/prestamos").post(checkAuth, nuevoPrestamo);
router.route("/").get(checkAuth, obtenerPrestamos).post(checkAuth, nuevoPrestamo);
router.route("/:id").get(checkAuth,obtenerPrestamo).put(checkAuth, editarPrestamo).delete(checkAuth,eliminarPrestamo);


export default router;
