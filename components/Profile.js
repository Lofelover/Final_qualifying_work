import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Для навигации между страницами
import './Profile.css'; // Импортируем стили для профиля
import { onFID, onLCP, onCLS } from 'web-vitals';  // Импортируем функции для замера метрик

const Profile = () => {
  const [user, setUser] = useState({
    name: 'Имя пользователя',  // Пример данных
    email: 'user@example.com',
  });

  const navigate = useNavigate();

  // Загружаем данные из localStorage или с сервера
  useEffect(() => {
    const storedUser = localStorage.getItem('profileData');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Загружаем из localStorage
    } else {
      // Если данных нет в localStorage, загружаем с сервера
      fetch('https://fakestoreapi.com/users/1') // Пример API для загрузки данных
        .then(response => response.json())
        .then(data => {
          setUser(data);
          localStorage.setItem('profileData', JSON.stringify(data)); // Сохраняем данные в localStorage
        })
        .catch(error => console.error('Error loading data:', error));
    }
  }, []); // Загружаем данные только при монтировании компонента

  // Функция для обработки изменений в форме
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  // Функция для сохранения изменений
  const handleSave = useCallback(() => {
    localStorage.setItem('profileData', JSON.stringify(user)); // Сохраняем данные в localStorage
    alert('Изменения сохранены');
  }, [user]);

  // Функция для изменения пароля
  const handleChangePassword = () => {
    alert('Поменяйте пароль через форму изменения пароля');
  };

  // Функция для перехода в каталог
  const handleGoToCatalog = () => {
    navigate('/catalog');  // Переход к каталогу
  };

  // Функции для замера Web Vitals
  useEffect(() => {
    // Замеры FID, LCP, CLS
    onFID((metric) => {
      console.log('FID на странице Profile:', metric.value);  // Логируем FID
    });
    onLCP((metric) => {
      console.log('LCP на странице Profile:', metric.value);  // Логируем LCP
    });
    onCLS((metric) => {
      console.log('CLS на странице Profile:', metric.value);  // Логируем CLS
    });
  }, []); // Эффект сработает при монтировании компонента

  // Добавление замера TTI (Time to Interactive)
  useEffect(() => {
    const calculateTTI = () => {
      const perfEntries = performance.getEntriesByType('navigation');
      const tti = perfEntries[0].loadEventEnd - perfEntries[0].startTime;

      console.log(`Time to Interactive (TTI): ${tti} миллисекунд`);
    };

    // Проверка, если страница уже загружена
    if (document.readyState === 'complete') {
      calculateTTI();  // Если страница уже загружена, вызываем сразу
    } else {
      // Добавляем обработчик для события "load"
      window.addEventListener('load', calculateTTI);
    }

    // Очистка обработчика события при размонтировании компонента
    return () => {
      window.removeEventListener('load', calculateTTI);
    };
  }, []);

  return (
    <div className="profile">
      <div className="profile-header">
        <h2>Профиль пользователя</h2>
        <button className="back-to-catalog" onClick={handleGoToCatalog}>Вернуться в каталог</button>
      </div>

      <div className="profile-info">
        {/* Добавим изображение профиля */}
        <div className="profile-picture">
          <img src="./mai.jpg" alt="Profile" className="profile-picture-img" />
        </div>

        <div className="profile-item">
          <label htmlFor="name">Имя:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={user.name}
            onChange={handleInputChange}
          />
        </div>

        <div className="profile-item">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
          />
        </div>

        <button className="save-button" onClick={handleSave}>
          Сохранить изменения
        </button>

        <button className="change-password-button" onClick={handleChangePassword}>
          Изменить пароль
        </button>
      </div>
    </div>
  );
};

export default React.memo(Profile);  // Оптимизация рендеринга компонента
