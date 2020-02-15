const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');
const {
  crearProyecto,
  obtenerProyectos,
  actualizarProyecto,
  eliminarProyecto
} = require('../controllers/proyectoController');

//crea proyecto
router.post(
  '/',
  auth,
  [
    check('nombre', 'El nombre es necesario')
      .not()
      .isEmpty()
  ],
  crearProyecto
);

//obtener all proyectos del creador
router.get('/', auth, obtenerProyectos);

//actualizar proyecto via ID
router.put(
  '/:id',
  auth,
  [
    check('nombre', 'El nombre es necesario')
      .not()
      .isEmpty()
  ],
  actualizarProyecto
);

//actualizar proyecto via ID
router.delete('/:id', auth, eliminarProyecto);

module.exports = router;
