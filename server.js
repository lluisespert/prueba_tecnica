import express from 'express';
import booksRouter from './routes/books.js';

const app = express();
const PORT = 3000;

// Middleware para manejar JSON
app.use(express.json());

// Rutas
app.use('/api', booksRouter);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});