import express from "express";
import { obtenerEmpleados, nuevoEmpleado, obtenerEmpleado, editarEmpleado, eliminarEmpleado} from "../controllers/empleadoControllers.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, obtenerEmpleados).post(checkAuth, nuevoEmpleado);
router.route("/:id").get(checkAuth,obtenerEmpleado).put(checkAuth, editarEmpleado).delete(checkAuth,eliminarEmpleado);


export default router;
