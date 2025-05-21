import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from './CartContext';  // Импортируем хук для корзины
import { Link } from 'react-router-dom';  // Для ссылки на каталог
import './Cart.css';  // Подключаем стили для корзины
import { onFID, onLCP, onCLS } from 'web-vitals';  // Импортируем функции для замера метрик

const Cart = () => {
  const { cart, removeFromCart, changeQuantity } = useCart();  // Получаем данные и функции для корзины

  // Восстанавливаем корзину из localStorage при монтировании компонента
  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart')) || [];  // Читаем данные из localStorage
    if (cartData.length > 0) {
      // Если данные есть в localStorage, обновляем состояние корзины
      // Вы можете использовать контекст или просто сохранить локально
      // (например, через setCart, если нужно хранить локальное состояние)
    }
  }, []);

  // Сохраняем корзину в localStorage при каждом обновлении
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));  // Сохраняем корзину в localStorage
    } else {
      localStorage.removeItem('cart');  // Очищаем localStorage, если корзина пуста
    }
  }, [cart]);  // Обновляем localStorage при изменении состояния корзины

  // Мемоизация вычислений общей стоимости корзины
  const calculateTotal = useMemo(() => {
    let total = cart.reduce((acc, item) => {
      if (item.price && item.quantity) {
        return acc + (parseFloat(item.price) * item.quantity); // Убедитесь, что цена и количество корректны
      }
      return acc;
    }, 0);
    return total.toFixed(2);  // Возвращаем число с двумя знаками после запятой
  }, [cart]);  // Пересчитывается только при изменении корзины

  useEffect(() => {
    // Логируем в консоль текущие данные корзины и общую стоимость
    console.log("Текущая корзина:", cart);
    console.log("Общая стоимость после изменений:", calculateTotal);
  }, [cart, calculateTotal]);

  // Функции для замера Web Vitals
  useEffect(() => {
    // Замеры FID, LCP, CLS
    onFID((metric) => {
      console.log('FID на странице Cart:', metric.value);  // Логируем FID
    });

    // Убираем задержку для LCP, чтобы зафиксировать метрику сразу
    onLCP((metric) => {
      console.log('LCP на странице Cart:', metric.value);  // Логируем LCP
    });

    onCLS((metric) => {
      console.log('CLS на странице Cart:', metric.value);  // Логируем CLS
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

  // Функция для удаления товара из корзины
  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    // После удаления товара синхронизируем обновленную корзину с localStorage
    localStorage.setItem('cart', JSON.stringify(cart.filter(item => item.id !== productId)));
  };

  return (
    <div className="cart">
      <div className="cart-header">
        <h2>Корзина</h2>
        <Link to="/catalog" className="back-to-catalog">Вернуться в каталог</Link>
      </div>

      {cart.length === 0 ? (
        <p>Ваша корзина пуста.</p>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-details">
                <img src={item.image} alt={item.title} className="cart-item-image" />
                <div>
                  <h3 className="cart-item-title">{item.title}</h3>
                  <p className="cart-item-description">{item.description}</p>
                  <strong className="cart-item-price">{item.price} руб.</strong>
                </div>
              </div>
              <div className="cart-item-actions">
                <button onClick={() => changeQuantity(item.id, item.quantity - 1)} className="quantity-button">-</button>
                <span className="cart-item-quantity">{item.quantity}</span>
                <button onClick={() => changeQuantity(item.id, item.quantity + 1)} className="quantity-button">+</button>
                <button className="remove-item" onClick={() => handleRemoveItem(item.id)}>Удалить</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <div className="cart-footer">
          <p className="cart-total">Общая стоимость: {calculateTotal} руб.</p>
          <button className="checkout-button">Оформить заказ</button>
        </div>
      )}
    </div>
  );
};

export default React.memo(Cart);  // Оптимизация рендеринга компонента
