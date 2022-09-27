import express from "express";
import {
  registrar,
  auntenticar,
  confirmar,
  olvidePass,
  comprobarToken,
  nuevoPassword,
  perfil,
} from "../controllers/usuarioController.js";
import checkAuth from "../middleware/checkAuth.js";
const router = express.Router();

// Autenticacion, registro y confirmacion de usuarios

router.post("/", registrar); //crea un nuevo usuario
router.post("/login", auntenticar);
router.get("/confirmar/:token", confirmar);
router.post("/olvide-password", olvidePass);
// router.get("/olvide-password/:token", comprobarToken);
// router.post("/olvide-password/:token", nuevoPassword);

router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

router.get("/perfil", checkAuth, perfil);

export default router;
