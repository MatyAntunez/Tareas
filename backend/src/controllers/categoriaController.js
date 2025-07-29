const { Categoria } = require('../models');

async function listarCategorias(req, res) {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener categorías' });
  }
}

async function crearCategoria(req, res) {
  const { nombre, descripcion } = req.body;
  if (!nombre) return res.status(400).json({ mensaje: 'Nombre es obligatorio' });

  try {
    const categoria = await Categoria.create({ nombre, descripcion });
    res.status(201).json(categoria);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al crear categoría' });
  }
}

module.exports = { listarCategorias, crearCategoria };
