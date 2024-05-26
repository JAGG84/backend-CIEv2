import express from "express";
import { obtenerProveedores, nuevoProveedor, obtenerProveedor, editarProveedor, eliminarProveedor} from "../controllers/proveedorController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, obtenerProveedores).post(checkAuth, nuevoProveedor);
router.route("/:id").get(checkAuth,obtenerProveedor).put(checkAuth, editarProveedor).delete(checkAuth,eliminarProveedor);


export default router;
