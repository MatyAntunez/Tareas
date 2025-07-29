const { Usuario } = require('../models');

async function listarUsuarios(req, res) {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nombre', 'email', 'rol'],
    });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al listar usuarios' });
  }
}

async function crearUsuario(req, res) {
  const { nombre, email, password, rol } = req.body;

  // Validar campos obligatorios
  if (!nombre || !email || !password) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }

  // Validar rol válido, si no se pasa se asigna 'comun'
  const rolesValidos = ['comun', 'premium', 'admin'];
  const rolAsignado = rol && rolesValidos.includes(rol) ? rol : 'comun';

  try {
    // Si el usuario hace la petición (req.user) y no es admin, no puede asignar roles especiales
    if (req.user && req.user.rol !== 'admin' && rolAsignado !== 'comun') {
      return res.status(403).json({ mensaje: 'No tienes permiso para asignar este rol' });
    }

    // Verificar si ya existe el email
    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }

    // Hashear password
    const password_hash = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password_hash,
      rol: rolAsignado,
    });

    res.status(201).json({ mensaje: 'Usuario creado con éxito', usuario: nuevoUsuario });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al crear usuario', error: err.message });
  }
}


async function cambiarRolUsuario(req, res) {
  const { id } = req.params;
  const { rol } = req.body;

  const rolesValidos = ['comun', 'premium', 'admin'];
  if (!rolesValidos.includes(rol)) {
    return res.status(400).json({ mensaje: 'Rol inválido' });
  }

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    usuario.rol = rol;
    await usuario.save();

    res.json({ mensaje: 'Rol actualizado correctamente', usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar rol' });
  }
}


module.exports = {
  listarUsuarios,
  crearUsuario,
  cambiarRolUsuario,
};
