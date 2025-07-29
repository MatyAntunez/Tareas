function verificarRol(...rolesPermitidos) {
  return (req, res, next) => {
    const userRole = req.user?.rol;

    if (!userRole) {
      return res.status(401).json({ mensaje: 'Usuario no autenticado' });
    }

    if (!rolesPermitidos.includes(userRole)) {
      return res.status(403).json({ mensaje: 'No tienes permisos para esta acción' });
    }

    next();
  };
}

module.exports = { verificarRol };
