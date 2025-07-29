const pool = require('./db');

async function crearTarea({ titulo, descripcion, fecha_limite, categoria_id, usuario_id }) {
  const result = await pool.query(
    `INSERT INTO tareas (titulo, descripcion, fecha_limite, categoria_id, usuario_id)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [titulo, descripcion, fecha_limite, categoria_id, usuario_id]
  );
  return result.rows[0];
}

async function obtenerTareas(usuario_id, { page = 1, limit = 10, completada, categoria_id }) {
  const offset = (page - 1) * limit;
  let baseQuery = `SELECT * FROM tareas WHERE usuario_id = $1`;
  const params = [usuario_id];
  let paramIndex = 2;

  if (completada !== undefined) {
    baseQuery += ` AND completada = $${paramIndex++}`;
    params.push(completada);
  }

  if (categoria_id) {
    baseQuery += ` AND categoria_id = $${paramIndex++}`;
    params.push(categoria_id);
  }

  baseQuery += ` ORDER BY fecha_creacion DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
  params.push(limit, offset);

  const result = await pool.query(baseQuery, params);
  return result.rows;
}

async function obtenerTareaPorId(id, usuario_id) {
  const result = await pool.query(
    `SELECT * FROM tareas WHERE id = $1 AND usuario_id = $2`,
    [id, usuario_id]
  );
  return result.rows[0];
}

async function actualizarTarea(id, usuario_id, { titulo, descripcion, fecha_limite, completada, categoria_id }) {
  const result = await pool.query(
    `UPDATE tareas SET titulo=$1, descripcion=$2, fecha_limite=$3, completada=$4, categoria_id=$5
     WHERE id=$6 AND usuario_id=$7 RETURNING *`,
    [titulo, descripcion, fecha_limite, completada, categoria_id, id, usuario_id]
  );
  return result.rows[0];
}

async function eliminarTarea(id, usuario_id) {
  const result = await pool.query(
    `DELETE FROM tareas WHERE id = $1 AND usuario_id = $2 RETURNING *`,
    [id, usuario_id]
  );
  return result.rows[0];
}

module.exports = {
  crearTarea,
  obtenerTareas,
  obtenerTareaPorId,
  actualizarTarea,
  eliminarTarea,
};
