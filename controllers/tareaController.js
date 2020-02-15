const Proyecto = require('../models/Proyecto');
const Tarea = require('../models/Tarea');
const { validationResult } = require('express-validator');

exports.crearTarea = async (req, res) => {
  //revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    //extraer el proyecto
    const { proyecto } = req.body;
    //comprobar si existe
    const existeProyecto = await Proyecto.findById(proyecto);
    if (!existeProyecto) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }
    // revisar si el proyecto pertence al usuario
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'No Autorizado' });
    }
    //creamos la tarea
    const tarea = new Tarea(req.body);
    await tarea.save();
    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }
};

exports.obtenerTareas = async (req, res) => {
  try {
    //extraer el proyecto
    const { proyecto } = req.query;

    //comprobar si existe
    const existeProyecto = await Proyecto.findById(proyecto);
    if (!existeProyecto) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }
    // revisar si el proyecto pertence al usuario
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'No Autorizado' });
    }
    // obtener las tareas via proyecto
    const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
    res.json({ tareas });
  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }
};

exports.actualizarTarea = async (req, res) => {
  try {
    //extraer del body
    const { proyecto, nombre, estado } = req.body;
    //comprobar si existe tarea
    let tarea = await Tarea.findById(req.params.id);
    if (!tarea) {
      return res.status(404).json({ msg: 'No existe tarea' });
    }
    //comprobar si existe
    const existeProyecto = await Proyecto.findById(proyecto);
    // revisar si el proyecto pertence al usuario
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'No Autorizado' });
    }
    // crear un objeto con la nueva información
    const renombrarTarea = {};
    renombrarTarea.nombre = nombre;
    renombrarTarea.estado = estado;
    //guardar tarea

    tarea = await Tarea.findByIdAndUpdate(
      { _id: req.params.id },
      renombrarTarea,
      { new: true }
    );
    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }
};

exports.eliminarTarea = async (req, res) => {
  try {
    //extraer del body
    const { proyecto } = req.query;
    //comprobar si existe tarea
    let tarea = await Tarea.findById(req.params.id);
    if (!tarea) {
      return res.status(404).json({ msg: 'No existe tarea' });
    }
    //comprobar si existe
    const existeProyecto = await Proyecto.findById(proyecto);
    // revisar si el proyecto pertence al usuario
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'No Autorizado' });
    }
    // eliminar
    await Tarea.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: 'Tarea eliminada' });
  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }
};
