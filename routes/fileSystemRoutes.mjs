import express from "express";

import {
  listarArchivos,
  //obtenerArchivo,
  subirArchivos,
  actualizarArchivo,
  eliminarArchivo,
  crearNuevaCarpetas,
  listarUltimosArchivos,
  listarDirectorios,
} from '../controllers/fileSystemControllers.mjs';
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router
  .route("/")
  .get(checkAuth, listarArchivos)
  .post(checkAuth, subirArchivos);

router
  .route("/:nombre")
  /*.get(checkAuth, obtenerArchivo)*/
  .put(checkAuth, actualizarArchivo)
  .delete(checkAuth, eliminarArchivo);

router
    .route("/carpeta")
    .post(checkAuth, crearNuevaCarpetas);

router
    .route("/ultimos")
    .get(checkAuth, listarUltimosArchivos);

    router
    .route("/directorios")
    .get(checkAuth, listarDirectorios);


export default router;