const { Tarea, Categoria, Usuario } = require('../models');

// Listar todas las tareas con filtros y paginación
async function listarTareas(req, res) {
  try {
    const { page = 1, limit = 10, completada, categoriaId } = req.query;

    const where = {};
    if (completada !== undefined) {
      where.completada = completada === 'true';
    }
    if (categoriaId) {
      where.categoriaId = categoriaId;
    }

    const offset = (page - 1) * limit;

    const { count, rows: tareas } = await Tarea.findAndCountAll({
      where,
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Usuario, as: 'usuario' }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    res.json({
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      tareas,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener tareas' });
  }
}

// Crear una tarea nueva
async function crearTarea(req, res) {
  console.log('usuario autenticado:', req.user);
  const { titulo, descripcion, completada, categoriaId } = req.body;
  const usuarioId = req.user.id;

  if (!titulo) {
    return res.status(400).json({ mensaje: 'El título es obligatorio' });
  }

  try {
    const tarea = await Tarea.create({
      titulo,
      descripcion,
      completada,
      usuarioId,
      categoriaId,
    });
    res.status(201).json(tarea);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al crear tarea' });
  }
}

// Actualizar tarea

// Actualizar tarea
async function actualizarTarea(req, res) {
  console.log('Token decodificado en req.user:', req.user);
  console.log('Body recibido:', req.body);
  const { id } = req.params;
  const { titulo, descripcion, completada, categoriaId } = req.body;

  try {
    const tarea = await Tarea.findByPk(id);
    if (!tarea) return res.status(404).json({ mensaje: 'Tarea no encontrada' });

    if (tarea.usuarioId !== req.user.id) {
      return res.status(403).json({ mensaje: 'No tienes permiso para modificar esta tarea' });
    }

    // Solo actualiza si se envían nuevos valores
    if (titulo !== undefined) tarea.titulo = titulo;
    if (descripcion !== undefined) tarea.descripcion = descripcion;
    if (completada !== undefined) tarea.completada = completada;
    if (categoriaId !== undefined) tarea.categoriaId = categoriaId;

    await tarea.save();

    res.json(tarea);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al actualizar tarea' });
  }
}

// Eliminar tarea
async function eliminarTarea(req, res) {
  const { id } = req.params;

  try {
    const tarea = await Tarea.findByPk(id);
    if (!tarea) return res.status(404).json({ mensaje: 'Tarea no encontrada' });

    // Si no es admin y no es dueño, denegar
    if (req.user.rol !== 'admin' && tarea.usuarioId !== req.user.id) {
      return res.status(403).json({ mensaje: 'No tienes permiso para eliminar esta tarea' });
    }

    await tarea.destroy();
    res.json({ mensaje: 'Tarea eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al eliminar tarea' });
  }
}




module.exports = {
  listarTareas,
  crearTarea,
  actualizarTarea,
  eliminarTarea,
};
