import express from "express";
import {
  registrar,
  auntenticar,
  confirmar,
  olvidePass,
  comprobarToken,
} from "../controllers/usuarioController.js";
const router = express.Router();

// Autenticacion, registro y confirmacion de usuarios

router.post("/", registrar); //crea un nuevo usuario
router.post("/login", auntenticar);
router.get("/confirmar/:token", confirmar);
router.post("/olvide-password", olvidePass);
router.get("/olvide-password/:token", comprobarToken);

export default router;
