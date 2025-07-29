const express = require('express');
const router = express.Router();
const autenticarToken = require('../middleware/authMiddleware');
const { verificarRol } = require('../middleware/rolMiddleware');
const {
  listarUsuarios,
  crearUsuario,
  cambiarRolUsuario,
} = require('../controllers/usuarioController');
const { registrar } = require('../controllers/authController');


// Registro público
router.post('/registrar', registrar);


// Listar usuarios (solo admin)
router.get('/', autenticarToken, verificarRol('admin'), listarUsuarios);

// Crear usuario (puede estar sin auth o con la tuya, lo dejo igual)
router.post('/', autenticarToken, verificarRol('admin'), crearUsuario);

// Cambiar rol de usuario (solo admin)
router.put('/:id/rol', autenticarToken, verificarRol('admin'), cambiarRolUsuario);



module.exports = router;
