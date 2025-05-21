import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from '../components/CartContext';

// Ленивая загрузка компонентов
const Catalog = React.lazy(() => import('../components/Catalog'));
const Cart = React.lazy(() => import('../components/Cart'));
const Profile = React.lazy(() => import('../components/Profile'));

// Компонент для обработки ошибок (опционально)
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Ошибка загрузки компонента:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error">Произошла ошибка. Попробуйте перезагрузить страницу.</div>;
    }
    return this.props.children;
  }
}

const App = () => {
  return (
    <CartProvider>
      <Router>
        <ErrorBoundary> {/* Обработка ошибок при загрузке */}
          <Suspense fallback={<div className="loading">Загрузка...</div>}>
            <Routes>
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Router>
    </CartProvider>
  );
};

export default App;