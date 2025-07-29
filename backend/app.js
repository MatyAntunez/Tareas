require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/authRoutes');
const autenticarToken = require('./src/middleware/authMiddleware');
const { conectarDB } = require('./src/models/index');

const categoriaRoutes = require('./src/routes/categoriaRoutes');
const tareaRoutes = require('./src/routes/tareaRoutes');
const usuarioRoutes = require('./src/routes/usuarioRoutes'); // <--- agregado

const app = express();

app.use(cors());
app.use(express.json());

conectarDB();


app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('API funcionando 🚀'));

app.get('/api/protegido', autenticarToken, (req, res) => {
  res.json({ mensaje: 'Accediste a una ruta protegida', usuario: req.user });
});

app.use('/api/categorias', categoriaRoutes);
app.use('/api/tareas', tareaRoutes);
app.use('/api/usuarios', usuarioRoutes); // <--- agregado

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});