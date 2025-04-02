import express from 'express';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';

const router = express.Router();

// GET /books - Devuelve todos los libros
router.get('/books', async (req, res) => {
  try {
    const booksCollection = collection(db, 'books');
    const querySnapshot = await getDocs(booksCollection);
    const books = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(books);
  } catch (error) {
    console.error('Error al obtener los libros:', error);
    res.status(500).json({ error: 'Error al obtener los libros' });
  }
});

// GET /books/:id - Devuelve un libro por su ID
router.get('/books/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const bookRef = doc(db, 'books', id);
      const bookSnap = await getDoc(bookRef);
  
      if (bookSnap.exists()) {
        res.status(200).json({ id: bookSnap.id, ...bookSnap.data() });
      } else {
        res.status(404).json({ error: 'Libro no encontrado' });
      }
    } catch (error) {
      console.error('Error al obtener el libro:', error);
      res.status(500).json({ error: 'Error al obtener el libro' });
    }
  });
  

  // POST /books - Crea un nuevo libro
router.post('/books', async (req, res) => {
    const { title, author, year } = req.body;
  
    // Validar datos
    if (!title || !author || !year) {
      return res.status(400).json({ error: 'Faltan datos obligatorios: title, author, year' });
    }
  
    try {
      const booksCollection = collection(db, 'books');
      const newBook = { title, author, year };
      const docRef = await addDoc(booksCollection, newBook);
      res.status(201).json({ id: docRef.id, ...newBook });
    } catch (error) {
      console.error('Error al crear el libro:', error);
      res.status(500).json({ error: 'Error al crear el libro' });
    }
  });
  

  router.put('/books/:id', async (req, res) => {
    const { id } = req.params;
    const { title, author, year } = req.body;
  
    // Validar datos
    if (!title && !author && !year) {
      return res.status(400).json({ error: 'Debes proporcionar al menos un campo para actualizar: title, author, year' });
    }
    try {
        const bookRef = doc(db, 'books', id);
        const bookSnap = await getDoc(bookRef);
      
        if (!bookSnap.exists()) {
          return res.status(404).json({ error: 'Libro no encontrado' });
        }
      
        const updatedBook = {};
        if (title) updatedBook.title = title;
        if (author) updatedBook.author = author;
        if (year) updatedBook.year = year;
      
        await updateDoc(bookRef, updatedBook);
        res.status(200).json({ id, ...updatedBook });
      } catch (error) {
        console.error('Error al actualizar el libro:', error);
        res.status(500).json({ error: 'Error al actualizar el libro' });
      }
  });
// DELETE /books/:id - Elimina un libro por su ID
router.delete('/books/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const bookRef = doc(db, 'books', id);
      const bookSnap = await getDoc(bookRef);
  
      if (!bookSnap.exists()) {
        return res.status(404).json({ error: 'Libro no encontrado' });
      }
  
      await deleteDoc(bookRef);
      res.status(200).json({ message: `Libro con ID ${id} eliminado correctamente` });
    } catch (error) {
      console.error('Error al eliminar el libro:', error);
      res.status(500).json({ error: 'Error al eliminar el libro' });
    }
  });


export default router;