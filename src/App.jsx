import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Search from './pages/Search';
import MyBooks from './pages/MyBooks';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import BookDetail from './pages/BookDetail';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  useEffect(() => {
    // Reset de fábrica solicitado por el usuario para limpiar cuelgues/usuarios corruptos
    if (!localStorage.getItem('librook_factory_reset_v2')) {
      localStorage.clear();
      localStorage.setItem('librook_factory_reset_v2', 'true');
      window.location.href = '/'; // Redirigir al inicio para evitar pantalla en blanco en /profile
    }
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route 
            path="/my-books" 
            element={
              <ProtectedRoute>
                <MyBooks />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
