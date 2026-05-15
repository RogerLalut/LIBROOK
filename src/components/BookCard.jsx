import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { FavoritesContext } from '../context/FavoritesContext';
import { useNavigate, Link } from 'react-router-dom';

const BookCard = ({ book, onEdit, onDelete, isLocal = false }) => {
  const { getBookData } = useContext(CartContext);
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
  const navigate = useNavigate();

  const id = isLocal ? book.id : book.key;
  const coverUrl = isLocal 
    ? (book.coverUrl || 'https://via.placeholder.com/300x400?text=Sin+Portada')
    : (book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : 'https://via.placeholder.com/300x400?text=Sin+Portada');
    
  const title = isLocal ? book.title : book.title;
  const author = isLocal ? book.author : (book.author_name ? book.author_name.join(', ') : 'Autor Desconocido');
  
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);
  const [condition, setCondition] = useState(book.condition || 'nuevo');
  const [ebookData, setEbookData] = useState({ isEbook: book.isEbook, format: book.ebookFormat, size: book.ebookSize });
  
  const favStatus = isFavorite(id);

  useEffect(() => {
    if (book.isEbook === undefined) {
      const data = getBookData(id, isLocal, isLocal ? book : null);
      setStock(data.stock);
      setPrice(data.basePrice);
      setCondition(data.condition);
      setEbookData(data.ebook);
    } else {
      const data = getBookData(id, isLocal, isLocal ? book : null);
      setStock(data.stock);
      setPrice(data.basePrice);
      setCondition(book.condition);
      setEbookData({ isEbook: book.isEbook, format: book.ebookFormat, size: book.ebookSize });
    }
  }, [id, getBookData, isLocal, book]);

  const getStockBadge = () => {
    if (ebookData.isEbook) return <span className="stock-badge bg-info text-dark shadow-sm fw-bold"><i className="bi bi-cloud-arrow-down-fill me-1"></i>Descarga Inmediata</span>;
    if (stock === 0) return <span className="stock-badge bg-danger text-white">Agotado</span>;
    if (stock <= 2) return <span className="stock-badge bg-warning text-dark">Pocas unidades</span>;
    return <span className="stock-badge bg-success text-white">Disponible</span>;
  };

  const getBadges = () => {
    if (ebookData.isEbook) {
      return (
        <div className="d-flex flex-wrap gap-1">
          <span className="badge bg-dark text-white border px-3"><i className="bi bi-laptop me-1"></i>E-Book Digital</span>
        </div>
      );
    }
    return (
      <div className="d-flex flex-wrap gap-1">
        <span className={`badge ${condition === 'nuevo' ? 'bg-primary' : 'bg-secondary'}`}>
          {condition === 'nuevo' ? 'Nuevo' : 'Usado'}
        </span>
      </div>
    );
  };

  const handleFavClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite({ ...book, id, coverUrl, title, author, isLocal });
  };

  const handleImgError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x400?text=Portada+No+Disponible';
  };

  return (
    <div className="card book-card h-100 border-0 shadow-sm">
      {getStockBadge()}
      <button className="fav-btn" onClick={handleFavClick}>
        <i className={`bi ${favStatus ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
      </button>
      
      <img 
        src={coverUrl} 
        className="card-img-top book-cover" 
        alt={title} 
        loading="lazy"
        onError={handleImgError}
      />
      
      <div className="card-body d-flex flex-column">
        <div className="mb-1" style={{ height: '48px', overflow: 'hidden' }}>
          <h5 className="card-title fw-bold text-dark mb-0" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} title={title}>{title}</h5>
        </div>
        <div className="mb-2" style={{ height: '20px', overflow: 'hidden' }}>
          <p className="card-text text-muted small mb-0 text-truncate" title={author}>{author}</p>
        </div>
        
        <div className="mb-3" style={{ height: '24px', overflow: 'hidden' }}>
          {getBadges()}
        </div>
        
        <div className="mt-auto">
          <p className="fw-bold text-magenta fs-5 mb-2">${price.toLocaleString()}</p>
          
          {isLocal && onEdit && onDelete ? (
            <div className="d-flex justify-content-between gap-2">
              <button className="btn btn-outline-primary btn-sm w-100" onClick={(e) => { e.stopPropagation(); onEdit(book); }}>
                <i className="bi bi-pencil-square"></i>
              </button>
              <button className="btn btn-outline-danger btn-sm w-100" onClick={(e) => { e.stopPropagation(); onDelete(book.id); }}>
                <i className="bi bi-trash"></i>
              </button>
              <Link to={`/book/${encodeURIComponent(id)}`} state={{ book: { ...book, isLocal, coverUrl, title, author, condition, ebookData } }} className="btn btn-magenta btn-sm w-100">
                Ver más
              </Link>
            </div>
          ) : (
            <Link to={`/book/${encodeURIComponent(id)}`} state={{ book: { ...book, isLocal, coverUrl, title, author, condition, ebookData } }} className="btn btn-magenta w-100 rounded-pill fw-bold mt-2">
              Ver más
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
