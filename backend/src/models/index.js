const { Sequelize } = require('sequelize');
const UsuarioModel = require('./Usuario');
const CategoriaModel = require('./Categoria');
const TareaModel = require('./Tarea');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

// Modelos
const Usuario = UsuarioModel(sequelize);
const Categoria = CategoriaModel(sequelize);
const Tarea = TareaModel(sequelize);

// Relaciones
Usuario.hasMany(Tarea, { foreignKey: 'usuarioId', as: 'tareas' });
Tarea.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

Categoria.hasMany(Tarea, { foreignKey: 'categoriaId', as: 'tareas' });
Tarea.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' });




const conectarDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos exitosa.');

    await sequelize.sync({ alter: true }); // sincroniza modelos con la DB
    console.log('✅ Modelos sincronizados.');
  } catch (error) {
    console.error('❌ Error al conectar o sincronizar:', error);
  }
};

module.exports = {
  sequelize,
  Usuario,
  Categoria,
  Tarea,
  conectarDB
};
