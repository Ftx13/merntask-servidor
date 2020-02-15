const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { check } = require('express-validator');
//crea un usuario
router.post(
  '/',
  [
    check('nombre', 'El nombre es requerido')
      .not()
      .isEmpty(),
    check('email', 'Agrega un email valido').isEmail(),
    check('password', 'Password minimo 6 caracteres').isLength({ min: 6 })
  ],
  usuarioController.crearUsuario
);

module.exports = router;
