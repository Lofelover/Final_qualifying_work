import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext';  // Импортируем хук для корзины
import { useNavigate } from 'react-router-dom';  // Для навигации между страницами
import './Catalog.css';  // Подключаем стили
import { onLCP, onFID, onCLS } from 'web-vitals';  // Импортируем функции для замера метрик

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const [isAdded, setIsAdded] = useState(false);  // Состояние для уведомления

  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Замеры Web Vitals - фиксируем только один раз при первом рендере
  useEffect(() => {
    // LCP (Largest Contentful Paint)
    onLCP((metric) => {
      console.log('LCP на странице Catalog:', metric.value);
    });

    // FID (First Input Delay)
    onFID((metric) => {
      console.log('FID на странице Catalog:', metric.value);
    });

    // CLS (Cumulative Layout Shift)
    onCLS((metric) => {
      console.log('CLS на странице Catalog:', metric.value);
    });
  }, []); // Эффект сработает при монтировании компонента

  // Получаем сохраненную страницу из localStorage, если она существует
  useEffect(() => {
    const lastPage = localStorage.getItem("lastCatalogPage");
    if (lastPage) {
      setCurrentPage(Number(lastPage));  // Восстанавливаем последнюю страницу
    }
  }, []);

  // Загружаем данные только один раз
  useEffect(() => {
    if (products.length === 0) {  // Загружаем только если товары еще не загружены
      fetch('https://fakestoreapi.com/products')
        .then((response) => response.json())
        .then((data) => {
          setProducts(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data: ', error);
          setLoading(false);
        });
    }
  }, [products]);

  // Фильтруем товары по запросу поиска
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Функция для добавления товара в корзину
  const handleAddToCart = (product) => {
    addToCart(product);  // Добавляем товар в корзину
    setIsAdded(true);  // Устанавливаем состояние, что товар добавлен
    localStorage.setItem("lastCatalogPage", currentPage);  // Сохраняем текущую страницу в localStorage
    console.log('Товар добавлен в корзину: ', product);

    // Убираем уведомление через 2 секунды
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

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
  }, []);  // Эффект для TTI

  return (
    <div>
      <h2 className="centered-heading">Список товаров</h2>

      {isAdded && <div className="notification">Товар добавлен в корзину!</div>} {/* Уведомление */}

      <input
        type="text"
        placeholder="Поиск товара..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div className="product-list">
          <ul>
            {currentProducts.map((product) => (
              <li key={product.id} className="product-item">
                <img src={product.image} alt={product.title} width="200" height="200" />
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <strong>{product.price} руб.</strong>
                <button onClick={() => handleAddToCart(product)}>Добавить в корзину</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="pagination">
        {Array(totalPages)
          .fill()
          .map((_, index) => (
            <button key={index} onClick={() => paginate(index + 1)}>
              {index + 1}
            </button>
          ))}
      </div>
      <button className="back-to-cart" onClick={() => navigate('/cart')}>
        Перейти в корзину
      </button>

    </div>
  );
};

export default Catalog;
