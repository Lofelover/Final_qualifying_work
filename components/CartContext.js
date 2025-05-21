import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Загружаем корзину из localStorage, если она существует
  const loadCartFromLocalStorage = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    return savedCart ? savedCart : [];
  };

  // Используем состояние для корзины
  const [cart, setCart] = useState(loadCartFromLocalStorage);

  // Сохраняем корзину в localStorage при каждом обновлении состояния корзины
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart)); // Сохраняем корзину в localStorage
    }
  }, [cart]);

  const addToCart = (product) => {
    const productIndex = cart.findIndex(item => item.id === product.id);

    if (productIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[productIndex].quantity += 1;
      setCart(updatedCart); // Обновляем корзину с новым количеством
    } else {
      setCart([...cart, { ...product, quantity: 1 }]); // Добавляем новый товар с количеством 1
    }

    console.log("Текущая корзина:", cart);
    console.log("Общая стоимость после добавления товара:", calculateTotal());
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart); // Обновляем корзину после удаления товара

    console.log("Общая стоимость после удаления товара:", calculateTotal());
  };

  const changeQuantity = (productId, quantity) => {
    const updatedCart = cart.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: Math.max(1, quantity) }; // Обновляем количество, но не ниже 1
      }
      return item;
    });
    setCart(updatedCart); // Обновляем корзину после изменения количества

    console.log("Общая стоимость после изменения количества:", calculateTotal());
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2); // Вычисляем общую стоимость
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, changeQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
