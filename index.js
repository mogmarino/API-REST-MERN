import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";

const app = express();
app.use(express.json());
dotenv.config();

conectarDB();

// configurar CORS
// blacklist , whitelist permitidos al conectarse

const whitelist = ["http://localhost:5173"];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      // puede consultar la API
      callback(null, true);
    } else {
      // NO ESTA PERMITIDO EL REQUEST
      callback(new Error("Error de cors"));
    }
  },
};

app.use(cors(corsOptions));

// Routing - use responde a todos los verbos http
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
