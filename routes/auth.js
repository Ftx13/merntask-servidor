const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const {
  autenticarUsuario,
  usuarioAutenticado
} = require('../controllers/authController');
//iniciar sesison
router.post('/', autenticarUsuario);
//
router.get('/', auth, usuarioAutenticado);

module.exports = router;
