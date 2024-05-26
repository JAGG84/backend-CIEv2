import express from "express";
import { obtenerReporte} from "../controllers/reporteController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, obtenerReporte);

export default router;