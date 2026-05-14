import React, { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import BookCard from '../components/BookCard';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const { favorites } = useContext(FavoritesContext);

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 text-dark"><i className="bi bi-heart-fill text-danger me-2"></i> Mi Lista de Deseos</h2>
      
      {favorites.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
          <i className="bi bi-heartbreak display-1 text-muted mb-3 d-block"></i>
          <h4 className="text-muted">Aún no tienes libros en tu lista</h4>
          <p className="text-secondary mb-4">Explora nuestro catálogo y guarda los libros que te gustaría leer después.</p>
          <Link to="/search" className="btn btn-magenta rounded-pill px-4">Explorar Catálogo</Link>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {favorites.map((book, index) => (
            <div className="col" key={book.id || book.key || index}>
              <BookCard book={book} isLocal={book.isLocal} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
