import Proyecto from "../models/Proyecto.js";
import Usuario from "../models/Usuario.js";

const obtenerProyectos = async (req, res) => {
  const proyectos = await Proyecto.find({
    $or: [
      { colaboradores: { $in: req.usuario } },
      { creador: { $in: req.usuario } },
    ],
  })
    // .where("creador")
    // .equals(req.usuario)
    .select("-tareas");
  res.json(proyectos);
};

const nuevoProyecto = async (req, res) => {
  console.log(req.body);
  console.log(req.usuario);

  const proyecto = new Proyecto(req.body);
  proyecto.creador = req.usuario._id;

  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const obtenerProyecto = async (req, res) => {
  const { id } = req.params;
  const proyecto = await Proyecto.findById(id)
    .populate("tareas")
    .populate("colaboradores", "nombre email");

  if (!proyecto) {
    const error = new Error("No encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (
    proyecto.creador.toString() !== req.usuario._id.toString() &&
    !proyecto.colaboradores.some(
      (colaborador) => colaborador._id.toString() === req.usuario._id.toString()
    )
  ) {
    const error = new Error("Acción no válida");
    return res.status(401).json({ msg: error.message });
  }

  // obtener tareas del proyecto
  // const tareas = await Tarea.find().where("proyecto").equals(proyecto._id);

  // res.status(200).json({ proyecto, tareas });
  res.status(200).json(proyecto);
};

const editarProyecto = async (req, res) => {
  const { id } = req.params;
  const proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    const error = new Error("No encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(401).json({ msg: error.message });
  }

  proyecto.nombre = req.body.nombre || proyecto.nombre;
  proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
  proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
  proyecto.cliente = req.body.cliente || proyecto.cliente;

  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const eliminarProyecto = async (req, res) => {
  const { id } = req.params;
  const proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    const error = new Error("No encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(401).json({ msg: error.message });
  }

  try {
    await proyecto.deleteOne();
    res.json({ msg: "Proyecto eliminado" });
  } catch (error) {
    console.log(error);
  }
};

const buscarColaborador = async (req, res) => {
  const { email } = req.body;

  const usuario = await Usuario.findOne({ email }).select(
    "-confirmado -token -createdAt -updatedAt -__v -password"
  );

  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  res.json(usuario);
};

const agregarColaborador = async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);

    if (!proyecto) {
      const error = new Error("Proyecto No encontrado");
      return res.status(404).json({ msg: error.message });
    }

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error("Acción no válida");
      return res.status(403).json({ msg: error.message });
    }

    const { email } = req.body;

    const usuario = await Usuario.findOne({ email }).select(
      "-confirmado -token -createdAt -updatedAt -__v -password"
    );

    if (!usuario) {
      const error = new Error("Usuario no encontrado");
      return res.status(404).json({ msg: error.message });
    }

    // El colaborador no es el admin del proyecto
    if (proyecto.creador.toString() === usuario._id.toString()) {
      const error = new Error(
        "El creador del proyecto no puede ser colaborador"
      );
      return res.status(403).json({ msg: error.message });
    }

    // revisar que no este agregado al proyecto
    if (proyecto.colaboradores.includes(usuario._id)) {
      const error = new Error("El usuario ya es colaborador");
      return res.status(403).json({ msg: error.message });
    }

    // ahora si se puede agregar
    proyecto.colaboradores.push(usuario._id);
    await proyecto.save();
    res.json({ msg: "colaborador agregado correctamente" });
  } catch (error) {
    res.json({ error });
  }
};

const eliminarColaborador = async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);

    if (!proyecto) {
      const error = new Error("Proyecto No encontrado");
      return res.status(404).json({ msg: error.message });
    }

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error("Acción no válida");
      return res.status(403).json({ msg: error.message });
    }

    proyecto.colaboradores.pull(req.body.id);
    await proyecto.save();
    res.json({ msg: "colaborador eliminado correctamente" });
  } catch (error) {
    res.json({ error });
  }
};

// const obtenerTareas = async (req, res) => {
//   const { id } = req.params;

//   const existeProyecto = await Proyecto.findById(id);

//   if (!existeProyecto) {
//     const error = new Error("No encontrado");
//     return res.status(404).json({ msg: error.message });
//   }

//   // tienes que ser el creador del proyecto o colaborador

//   const tareas = await Tarea.find().where("proyecto").equals(id);

//   res.json(tareas);
// };

export {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  buscarColaborador,
  agregarColaborador,
  eliminarColaborador,
};
