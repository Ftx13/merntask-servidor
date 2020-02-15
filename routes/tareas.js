const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');
const {
  crearTarea,
  obtenerTareas,
  actualizarTarea,
  eliminarTarea
} = require('../controllers/tareaController');

//crear tarea
router.post(
  '/',
  auth,
  [
    check('nombre', 'El nombre es requerido')
      .not()
      .isEmpty(),
    check('proyecto', 'El proyecto es obligatario')
      .not()
      .isEmpty()
  ],
  crearTarea
);

//obtener tarea via proyecto
router.get('/', auth, obtenerTareas);

//actualizar tarea
router.put('/:id', auth, actualizarTarea);

//eliminar tarea
router.delete('/:id', auth, eliminarTarea);

module.exports = router;
