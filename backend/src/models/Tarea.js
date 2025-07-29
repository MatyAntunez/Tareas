const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Tarea = sequelize.define('Tarea', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    completada: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Foreign key a Usuario, la vamos a definir abajo
    },
    categoriaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // Foreign key a Categoria, opcional
    },
  }, {
    tableName: 'tareas',
    timestamps: true, // para createdAt, updatedAt
  });

  return Tarea;
};
