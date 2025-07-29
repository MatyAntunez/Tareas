const express = require('express');
const router = express.Router();
const autenticarToken = require('../middleware/authMiddleware');
const { verificarRol } = require('../middleware/rolMiddleware');
const {
  listarTareas,
  crearTarea,
  actualizarTarea,
  eliminarTarea
} = require('../controllers/tareaController');

const { Tarea, Categoria, Usuario } = require('../models');


router.get('/', autenticarToken, listarTareas);
router.post('/', autenticarToken, verificarRol('comun', 'premium'), crearTarea);
router.delete('/:id', autenticarToken, verificarRol('comun', 'premium'), eliminarTarea);
router.put('/:id', autenticarToken, verificarRol('comun', 'admin'), actualizarTarea);

router.delete('/:id', autenticarToken, verificarRol('premium'), eliminarTarea);
// router.delete('/:id', autenticarToken, verificarRol('premium', 'admin'), eliminarTarea);


router.get('/:id', autenticarToken, verificarRol('comun', 'premium'), async (req, res) => {
  const { id } = req.params;
  try {
    const tarea = await Tarea.findByPk(id, {
      include: [{ model: Categoria, as: 'categoria' }, { model: Usuario, as: 'usuario' }]
    });
    if (!tarea) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    
    // Verificar que el usuario puede acceder a esta tarea (opcional)
    if (tarea.usuarioId !== req.user.id) {
      return res.status(403).json({ mensaje: 'No tienes permiso para ver esta tarea' });
    }

    res.json(tarea);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener tarea' });
  }
});



module.exports = router;
