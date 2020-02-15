const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) => {
  //revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  try {
    // Crear un proyecto
    const proyecto = await Proyecto(req.body);
    // obtener creador via jwt
    proyecto.creador = req.usuario.id;
    // guardar proyecto
    proyecto.save();
    res.json(proyecto);
  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }
};

exports.obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({
      creador: -1
    });
    res.json({ proyectos });
  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }
};

exports.actualizarProyecto = async (req, res) => {
  //revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  //extraer la informacion del proyecto
  const { nombre } = req.body;
  const renombrarProyecto = {};
  if (nombre) {
    renombrarProyecto.nombre = nombre;
  }
  try {
    //revisar el ID
    let proyecto = await Proyecto.findById(req.params.id);
    //si el proyecto no existe
    if (!proyecto) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }
    //si no es el creador
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'No Autorizado' });
    }
    // actualizar
    proyecto = await Proyecto.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: renombrarProyecto },
      { new: true }
    );
    res.json({ proyecto });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error en el servidor');
  }
};

exports.eliminarProyecto = async (req, res) => {
  try {
    //revisar el ID
    let proyecto = await Proyecto.findById(req.params.id);
    //si el proyecto no existe
    if (!proyecto) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }
    //si no es el creador
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'No Autorizado' });
    }
    // actualizar
    proyecto = await Proyecto.findByIdAndRemove({ _id: req.params.id });
    res.json({ msg: 'Proyecto Eliminado' });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error en el servidor');
  }
};
