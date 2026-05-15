import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FavoritesContext } from '../context/FavoritesContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { favorites } = useContext(FavoritesContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Has cerrado sesión");
    navigate('/login');
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const navigateToCategory = (query) => {
    navigate(`/search?category=${query}`);
  };

  return (
    <nav className="navbar navbar-expand-lg glass-nav py-2 border-bottom">
      <div className="container">
        <Link className="navbar-brand fw-bold text-magenta d-flex align-items-center me-4" to="/">
          <img src="/logo.png" alt="LIBROOK Logo" height="40" className="me-2" style={{ objectFit: 'contain' }} />
          <span className="fs-4">LIBROOK</span>
        </Link>
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item">
              <Link className="nav-link fw-semibold text-dark" to="/search">Catálogo</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold text-dark" to="/search?filter=new">Nuevos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold text-dark" to="/search?filter=used">Usados</Link>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link fw-semibold text-dark dropdown-toggle cursor-pointer" id="categoriesDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Categorías
              </a>
              <ul className="dropdown-menu shadow border-0 rounded-3" aria-labelledby="categoriesDropdown">
                <li><button className="dropdown-item" onClick={() => navigateToCategory('fantasy')}>Fantasía</button></li>
                <li><button className="dropdown-item" onClick={() => navigateToCategory('romance')}>Romance</button></li>
                <li><button className="dropdown-item" onClick={() => navigateToCategory('science_fiction')}>Ciencia Ficción</button></li>
                <li><button className="dropdown-item" onClick={() => navigateToCategory('history')}>Historia</button></li>
                <li><button className="dropdown-item" onClick={() => navigateToCategory('programming')}>Programación</button></li>
                <li><button className="dropdown-item" onClick={() => navigateToCategory('manga')}>Manga</button></li>
                <li><button className="dropdown-item" onClick={() => navigateToCategory('horror')}>Terror</button></li>
                <li><button className="dropdown-item" onClick={() => navigateToCategory('children')}>Infantil</button></li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold text-magenta" to="/search?filter=ofertas"><i className="bi bi-tags-fill me-1"></i> Ofertas</Link>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item mx-lg-2 position-relative">
              <Link className="nav-link text-dark" to="/favorites" title="Lista de Deseos">
                <i className="bi bi-heart fs-5"></i>
                {favorites.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                    {favorites.length}
                  </span>
                )}
              </Link>
            </li>

            <li className="nav-item mx-lg-2 position-relative">
              <Link className="nav-link text-dark" to="/cart" title="Carrito General">
                <i className="bi bi-cart3 fs-5"></i>
                {totalItems > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-magenta">
                    {totalItems}
                  </span>
                )}
              </Link>
            </li>

            {user ? (
              <li className="nav-item dropdown ms-lg-3">
                <a className="nav-link dropdown-toggle text-dark d-flex align-items-center cursor-pointer" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="rounded-circle shadow-sm me-2" style={{ width: '35px', height: '35px', backgroundColor: '#f8f9fa' }} />
                  ) : (
                    <i className="bi bi-person-circle fs-4 me-2 text-magenta"></i>
                  )}
                  <span className="fw-semibold">{user.name}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-2" aria-labelledby="userDropdown">
                  <li><Link className="dropdown-item py-2" to="/profile?tab=perfil"><i className="bi bi-person me-2"></i> Mi Perfil</Link></li>
                  <li><Link className="dropdown-item py-2" to="/profile?tab=compras"><i className="bi bi-bag-check me-2"></i> Mis Compras</Link></li>
                  <li><Link className="dropdown-item py-2" to="/profile?tab=arriendos"><i className="bi bi-calendar-check me-2"></i> Mis Arriendos</Link></li>
                  <li><Link className="dropdown-item py-2" to="/favorites"><i className="bi bi-heart me-2"></i> Favoritos</Link></li>
                  <li><Link className="dropdown-item py-2" to="/profile?tab=configuracion"><i className="bi bi-gear me-2"></i> Configuración</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button onClick={handleLogout} className="dropdown-item text-danger py-2"><i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión</button></li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item ms-lg-3 mb-2 mb-lg-0">
                  <Link className="btn btn-outline-magenta px-4 rounded-pill w-100 fw-bold" to="/login">Ingresar</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
