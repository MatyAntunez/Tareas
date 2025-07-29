const express = require('express');
const router = express.Router();
const { listarCategorias, crearCategoria } = require('../controllers/categoriaController');

router.get('/', listarCategorias);
router.post('/', crearCategoria);

module.exports = router;
