import express from "express";
import { obtenerAutorizaciones, nuevaAutorizacion, obtenerNotificaciones, rechazarSolicitud, autorizarSolicitud, obtenerAutorizacion, editarAutorizacion, eliminarAutorizacion} from "../controllers/autorizacionController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, obtenerAutorizaciones).post(checkAuth, nuevaAutorizacion);
router.route("/notificacione").get(checkAuth, obtenerNotificaciones)
router.route("/rechazar/:id").patch(checkAuth, rechazarSolicitud)
router.route("/autorizar/:id").patch(checkAuth, autorizarSolicitud)
router.route("/:id").get(checkAuth,obtenerAutorizacion).put(checkAuth, editarAutorizacion).delete(checkAuth,eliminarAutorizacion);


export default router;