import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa createRoot desde react-dom/client
import App from './App';

// Obtén el elemento raíz del DOM
const rootElement = document.getElementById('root') || document.createElement('div');

// Crea el root con createRoot
const root = ReactDOM.createRoot(rootElement);

// Renderiza la aplicación
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);