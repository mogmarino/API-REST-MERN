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

const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      // console.log(origin);
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

const servidor = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// socket.io
import { Server } from "socket.io";

const io = new Server(servidor, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

io.on("connection", (socket) => {
  console.log("Conectado a socket.io");

  // definir los eventos de socket.io
  socket.on("abrir proyecto", (proyecto) => {
    // console.log("Desde el proyecto ", proyecto);
    socket.join(proyecto);

    // repuesta hacia un cliente especifico
    // socket
    //   .to("6349709540268c7577fcc91f")
    //   .emit("respuesta", { author: "mogmarino" });
  });

  socket.on("nueva tarea", (tarea) => {
    console.log(tarea);
    const proyecto = tarea.proyecto;
    console.log(proyecto);
    socket.to(proyecto).emit("tarea agregada", tarea);
  });
});
