const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Usuario } = require('../models/index');  // Importamos modelo Sequelize

// Función para buscar usuario por email usando Sequelize
const buscarPorEmail = async (email) => {
  return await Usuario.findOne({ where: { email } });
};

// Función para crear un nuevo usuario con password hasheado
const crearUsuario = async (nombre, email, password) => {
  const password_hash = await bcrypt.hash(password, 10);
  return await Usuario.create({ nombre, email, password_hash });
};

async function registrar(req, res) {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }

  try {
    const existe = await buscarPorEmail(email);
    if (existe) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }

    const nuevoUsuario = await crearUsuario(nombre, email, password);

    res.status(201).json({ mensaje: 'Usuario creado con éxito', usuario: nuevoUsuario });
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    res.status(500).json({ mensaje: 'Error al registrar usuario', error: err.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const usuario = await buscarPorEmail(email);

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const coincide = await bcrypt.compare(password, usuario.password_hash);
    if (!coincide) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('Token generado:', token);


    res.json({ token });
  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    res.status(500).json({ mensaje: 'Error al iniciar sesión', error: err.message });
  }
}

module.exports = { registrar, login };
