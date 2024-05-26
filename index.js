import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import negocioRoutes from "./routes/negocioRoutes.js";
import proveedorRoutes from "./routes/proveedorRoutes.js";
import tipoRoutes from "./routes/tipoRoutes.js";
import cuentaRoutes from "./routes/cuentaRoutes.js";
import subcuentaRoutes from "./routes/subcuentaRoutes.js";
import conceptoRoutes from "./routes/conceptoRoutes.js";
import bancoRoutes from "./routes/bancoRoutes.js";
import movimientoRoutes from "./routes/movimientoRoute.js";
import prestamoRoutes from "./routes/prestamoRoutes.js";
import reporteRoutes from "./routes/reporteRoutes.js";
import configuracionRoutes from "./routes/configuracionRoutes.js"
import empleadoRoutes from "./routes/empleadoRoutes.js"
import autorizacionRoutes from "./routes/autorizacionRoutes.js"
import reglaRoutes from "./routes/reglaRoutes.js"
import fileSystemRoutes from "./routes/fileSystemRoutes.mjs";
import bodegaRoutes from "./routes/bodegaRoutes.js";
import activoRoutes from "./routes/activoRoutes.js";
import cajachicaRoutes from "./routes/cajachicaRoutes.js";

const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

// Configurar CORS
const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      // Puede consultar la API
      callback(null, true);
    } else {
      // No esta permitido
      callback(new Error("Error de Cors"));
    }
  },
};

app.use(cors());

//Routing
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/negocios", negocioRoutes);
app.use("/api/proveedores", proveedorRoutes);
app.use("/api/tipos", tipoRoutes);
app.use("/api/cuentas", cuentaRoutes);
app.use("/api/subcuentas", subcuentaRoutes);
app.use("/api/conceptos", conceptoRoutes);
app.use("/api/bancos", bancoRoutes);
app.use("/api/movimientos", movimientoRoutes);
app.use("/api/prestamos", prestamoRoutes);
app.use("/api/reportes", reporteRoutes);
app.use("/api/configuraciones", configuracionRoutes);
app.use("/api/empleados", empleadoRoutes);
app.use("/api/autorizaciones", autorizacionRoutes);
app.use("/api/reglas", reglaRoutes);
app.use("/api/fileSystem", fileSystemRoutes);
app.use("/api/bodegas", bodegaRoutes);
app.use("/api/activos", activoRoutes);
app.use("/api/cajachica", cajachicaRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
