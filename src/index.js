import React from 'react';
import ReactDOM from 'react-dom/client';  // Используем React 18+ API для рендеринга
import App from './app/App';  // Импортируем компонент App
import './index.css';  // Подключаем стили

// Создаем корневой элемент и рендерим в нем компонент App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
