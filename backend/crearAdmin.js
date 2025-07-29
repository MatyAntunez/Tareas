// crearAdmin.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Usuario } = require('./src/models');

async function crearAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10); // Cambia la contraseña si querés

    const [usuario, creado] = await Usuario.findOrCreate({
      where: { email: 'admin@example.com' },
      defaults: {
        nombre: 'Admin',
        email: 'admin@example.com',
        password_hash: hashedPassword,
        rol: 'admin', // Asegurate que 'rol' existe y acepta 'admin'
      },
    });

    if (creado) {
      console.log('✅ Usuario administrador creado correctamente.');
    } else {
      console.log('ℹ️ El usuario ya existía.');
    }
  } catch (error) {
    console.error('❌ Error al crear el usuario administrador:', error);
  }
}

crearAdmin();
