import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { db } from './firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export default function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [editingBook, setEditingBook] = useState(null);

  const booksCollection = collection(db, 'books');

  // Fetch books from Firestore
  const fetchBooks = async () => {
    try {
      const querySnapshot = await getDocs(booksCollection);
      const booksList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBooks(booksList);
    } catch (error) {
      console.error('Error fetching books:', error);
      Alert.alert('Error', 'No se pudieron cargar los libros.');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Add a new book
  const addBook = async () => {
    if (!title || !author || !year) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      const newBook = { title, author, year };
      await addDoc(booksCollection, newBook);
      fetchBooks();
      setTitle('');
      setAuthor('');
      setYear('');
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  // Edit an existing book
  const editBook = async () => {
    if (!title || !author || !year) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      const bookRef = doc(db, 'books', editingBook.id);
      await updateDoc(bookRef, { title, author, year });
      fetchBooks();
      setTitle('');
      setAuthor('');
      setYear('');
      setEditingBook(null);
    } catch (error) {
      console.error('Error editing book:', error);
    }
  };

  // Delete a book
  const deleteBook = async (id) => {
    try {
      const bookRef = doc(db, 'books', id);
      await deleteDoc(bookRef);
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  // Select a book for editing
  const selectBookForEditing = (book) => {
    setEditingBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setYear(book.year);
  };

  // Render book details
  const renderBook = ({ item }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => Alert.alert('Detalles del libro', `Título: ${item.title}\nAutor: ${item.author}\nAño: ${item.year}`)}
    >
      <Text style={styles.bookTitle}>{item.title}</Text>
      <View style={styles.bookActions}>
        <Button title="Editar" onPress={() => selectBookForEditing(item)} />
        <Button title="Eliminar" color="red" onPress={() => deleteBook(item.id)} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gestión de Libros</Text>
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Autor"
        value={author}
        onChangeText={setAuthor}
      />
      <TextInput
        style={styles.input}
        placeholder="Año"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
      />
      <Button
        title={editingBook ? 'Guardar Cambios' : 'Agregar Libro'}
        onPress={editingBook ? editBook : addBook}
      />
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={renderBook}
        style={styles.bookList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  bookList: {
    marginTop: 20,
  },
  bookItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});