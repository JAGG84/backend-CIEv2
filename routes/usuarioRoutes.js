import express from "express";

const router = express.Router();

import { perfil ,nuevoPassword ,comprobarToken, olvidePassword, confirmar, registrar, autenticar, obtenerTodosLosPerfiles } from '../controllers/usuarioController.js';

import checkAuth from "../middleware/checkAuth.js";
// Autenticacion, Resgistro y Confirmación de Usuarios
router.post("/", registrar);
router.post("/login", autenticar);
router.get("/confirmar/:token", confirmar);
router.post("/olvide-password", olvidePassword);
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword)
router.get("/perfil", checkAuth, perfil);
router.get("/perfil/todos", checkAuth, obtenerTodosLosPerfiles);

export default router;