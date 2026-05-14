import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FavoritesContext } from '../context/FavoritesContext';
import { AuthContext } from '../context/AuthContext';
import { sanitizeInput } from '../utils/security';
import toast from 'react-hot-toast';

const BookDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, getDiceBearAvatar } = useContext(AuthContext);
  const { addToCart, getBookData } = useContext(CartContext);
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);

  const book = location.state?.book;

  const [rentDuration, setRentDuration] = useState('rent-1');
  const [submittingReview, setSubmittingReview] = useState(false);

  if (!book) {
    return (
      <div className="container py-5 text-center">
        <h2>Libro no encontrado</h2>
        <button className="btn btn-magenta mt-3" onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  const id = book.id || book.key;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [stock, setStock] = useState(0);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [basePrice, setBasePrice] = useState(0);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [condition, setCondition] = useState(book.condition || 'nuevo');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [ebookData, setEbookData] = useState(book.ebookData || { isEbook: false });

  const favStatus = isFavorite(id);
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [reviews, setReviews] = useState([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [reviewError, setReviewError] = useState(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!book.condition || book.isEbook === undefined) {
      const data = getBookData(id, book.isLocal, book.isLocal ? book : null);
      setStock(data.stock);
      setBasePrice(data.basePrice);
      setCondition(data.condition);
      setEbookData(data.ebook);
    } else {
      const data = getBookData(id, book.isLocal, book.isLocal ? book : null);
      setStock(data.stock);
      setBasePrice(data.basePrice);
      setCondition(book.condition);
      setEbookData(book.ebookData || data.ebook);
    }

    const allReviews = JSON.parse(localStorage.getItem('librook_reviews') || '{}');
    if (allReviews[id]) {
      setReviews(allReviews[id]);
    } else {
      setReviews([{
        user: 'Lector Anónimo',
        rating: 4,
        comment: 'Un libro excelente, me atrapó desde la primera página. Muy recomendado.',
        date: new Date().toLocaleDateString(),
        avatar: getDiceBearAvatar('Lector Anónimo')
      }]);
    }
  }, [id, getBookData, book, getDiceBearAvatar]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Debes iniciar sesión para dejar una reseña.');
      return;
    }

    const safeComment = sanitizeInput(newReview.comment);
    if (!safeComment) {
      setReviewError("La reseña no puede estar vacía o contener solo caracteres inválidos.");
      return;
    }
    if (safeComment.length > 500) {
      setReviewError("La reseña no puede tener más de 500 caracteres.");
      return;
    }
    
    setSubmittingReview(true);
    setReviewError(null);

    setTimeout(() => {
      const reviewObj = {
        user: user.name || user.email.split('@')[0],
        rating: Number(newReview.rating),
        comment: safeComment,
        date: new Date().toLocaleDateString(),
        avatar: user.avatar 
      };

      const updatedReviews = [reviewObj, ...reviews];
      setReviews(updatedReviews);
      
      const allReviews = JSON.parse(localStorage.getItem('librook_reviews') || '{}');
      allReviews[id] = updatedReviews;
      localStorage.setItem('librook_reviews', JSON.stringify(allReviews));
      
      setNewReview({ rating: 5, comment: '' });
      setSubmittingReview(false);
      toast.success('¡Reseña publicada!');
    }, 400);
  };

  const rent1WeekPrice = Math.round(basePrice * 0.2);
  const rent2WeekPrice = Math.round(basePrice * 0.35);

  const getStockLabel = () => {
    if (ebookData.isEbook) return <span className="badge bg-info text-dark shadow-sm fs-6"><i className="bi bi-cloud-arrow-down-fill me-1"></i>Descarga Digital Inmediata</span>;
    if (stock === 0) return <span className="badge bg-danger fs-6">Agotado</span>;
    if (stock <= 2) return <span className="badge bg-warning text-dark fs-6">Pocas unidades ({stock})</span>;
    return <span className="badge bg-success fs-6">Disponible ({stock})</span>;
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <i key={i} className={`bi ${i < rating ? 'bi-star-fill text-warning' : 'bi-star text-secondary'}`}></i>
    ));
  };

  const handleRentSubmit = () => {
    addToCart({...book, id, condition, ebookData}, rentDuration);
  };

  const getReviewAvatar = (rev) => {
    if (user && rev.user === user.name) return user.avatar;
    return rev.avatar || getDiceBearAvatar(rev.user);
  };

  return (
    <div className="container py-5">
      <button className="btn btn-light mb-4 shadow-sm border" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left me-2"></i>Volver
      </button>

      <div className="row g-5 bg-white p-4 p-md-5 rounded-4 shadow-sm border mb-5">
        <div className="col-lg-4 text-center position-relative">
          <img src={book.coverUrl} alt={book.title} className="book-cover-large img-fluid rounded" style={{maxHeight: '450px', objectFit: 'cover'}} />
          <button className="fav-btn" style={{ top: '15px', right: '15px', width: '45px', height: '45px', fontSize: '1.2rem' }} onClick={() => toggleFavorite({...book, id})}>
            <i className={`bi ${favStatus ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
          </button>
        </div>
        
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h1 className="fw-bold display-6 mb-0 text-dark">{book.title}</h1>
          </div>
          <h4 className="text-muted mb-4">{book.author}</h4>
          
          <div className="d-flex flex-wrap gap-3 mb-4">
            {getStockLabel()}
            
            {!ebookData.isEbook && (
              <span className={`badge ${condition === 'nuevo' ? 'bg-primary' : 'bg-secondary'} fs-6`}><i className="bi bi-box-seam me-1"></i> {condition === 'nuevo' ? 'Nuevo' : 'Usado'}</span>
            )}
            
            <span className="badge bg-light text-dark border fs-6"><i className="bi bi-tag me-1"></i> {book.category || 'General'}</span>
            
            {ebookData.isEbook && (
              <>
                <span className="badge bg-dark text-white border fs-6"><i className="bi bi-laptop me-1"></i> E-Book</span>
                <span className="badge bg-light text-dark border fs-6"><i className="bi bi-file-earmark-text me-1"></i> {ebookData.format}</span>
                <span className="badge bg-light text-dark border fs-6"><i className="bi bi-hdd me-1"></i> {ebookData.size}</span>
              </>
            )}
          </div>

          <p className="lead text-secondary mb-5" style={{ lineHeight: '1.8' }}>
            Una obra fascinante que te atrapará de principio a fin. Este libro ha sido aclamado por la crítica y es un infaltable en la biblioteca de cualquier apasionado por la lectura.
          </p>

          <div className="row g-4 align-items-end">
            <div className={`col-md-${ebookData.isEbook ? '12' : '6'} ${!ebookData.isEbook ? 'border-end' : ''}`}>
              <h5 className="fw-bold mb-3"><i className={`bi ${ebookData.isEbook ? 'bi-laptop' : 'bi-bag-fill'} text-primary me-2`}></i>{ebookData.isEbook ? 'Comprar Edición Digital' : 'Comprar Físico'}</h5>
              <p className="fs-2 fw-bold text-magenta mb-3">${basePrice.toLocaleString()}</p>
              <button 
                className={`btn ${ebookData.isEbook ? 'btn-info text-dark' : 'btn-primary'} rounded-pill px-4 w-100 fw-bold py-3 ${(!ebookData.isEbook && stock === 0) ? 'disabled' : ''}`}
                onClick={() => addToCart({...book, id, condition, ebookData}, 'buy')}
                disabled={!ebookData.isEbook && stock === 0}
              >
                <i className={`bi ${ebookData.isEbook ? 'bi-cloud-download' : 'bi-cart-plus'} me-2`}></i> {ebookData.isEbook ? 'Comprar E-Book' : 'Agregar al carrito'}
              </button>
            </div>
            
            {!ebookData.isEbook && (
              <div className="col-md-6">
                <h5 className="fw-bold mb-3"><i className="bi bi-calendar-check-fill text-warning me-2"></i>Arrendar Físico</h5>
                <div className="mb-3">
                  <select className="form-select bg-light border-warning" value={rentDuration} onChange={(e) => setRentDuration(e.target.value)}>
                    <option value="rent-1">1 Semana - ${rent1WeekPrice.toLocaleString()}</option>
                    <option value="rent-2">2 Semanas - ${rent2WeekPrice.toLocaleString()}</option>
                  </select>
                </div>
                <button 
                  className={`btn btn-outline-warning text-dark border-2 rounded-pill w-100 fw-bold py-3 ${stock === 0 ? 'disabled' : ''}`}
                  onClick={handleRentSubmit}
                  disabled={stock === 0}
                >
                  <i className="bi bi-journal-plus me-2"></i> Agregar Arriendo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="row mt-5 mb-5">
        <div className="col-lg-8 mx-auto">
          <h3 className="fw-bold mb-4 border-bottom pb-3">Reseñas de Lectores</h3>
          
          {user && (
            <div className="bg-light p-4 rounded-4 mb-5 border d-flex gap-3">
              <img src={user.avatar} alt="Mi Avatar" className="rounded-circle shadow-sm" style={{ width: '50px', height: '50px', backgroundColor: '#f8f9fa' }} />
              <div className="flex-grow-1">
                <h5 className="fw-bold mb-3">Deja tu reseña, {user.name}</h5>
                <form onSubmit={handleReviewSubmit} noValidate>
                  <div className="mb-3">
                    <label className="form-label text-muted fw-semibold">Puntuación</label>
                    <select className="form-select border-0 shadow-sm" value={newReview.rating} onChange={(e) => setNewReview({...newReview, rating: e.target.value})}>
                      <option value="5">5 Estrellas - Excelente</option>
                      <option value="4">4 Estrellas - Muy bueno</option>
                      <option value="3">3 Estrellas - Bueno</option>
                      <option value="2">2 Estrellas - Regular</option>
                      <option value="1">1 Estrella - Malo</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <textarea 
                      className={`form-control border-0 shadow-sm ${reviewError ? 'is-invalid' : ''}`} 
                      rows="3" 
                      placeholder="¿Qué te pareció este libro?" 
                      value={newReview.comment}
                      onChange={(e) => { setNewReview({...newReview, comment: e.target.value}); setReviewError(null); }}
                    ></textarea>
                    {reviewError && <div className="invalid-feedback fw-bold">{reviewError}</div>}
                  </div>
                  <button type="submit" className="btn btn-dark rounded-pill px-4 fw-bold" disabled={submittingReview}>
                    {submittingReview ? <><span className="spinner-border spinner-border-sm me-2"></span>Publicando...</> : "Publicar Reseña"}
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="d-flex flex-column gap-3">
            {reviews.map((rev, idx) => (
              <div key={idx} className="review-card p-4 rounded-4 shadow-sm d-flex gap-3">
                <img src={getReviewAvatar(rev)} alt="Avatar" className="rounded-circle shadow-sm" style={{ width: '45px', height: '45px', backgroundColor: '#f8f9fa' }} />
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h6 className="fw-bold mb-0 text-dark">{rev.user}</h6>
                    <span className="text-muted small">{rev.date}</span>
                  </div>
                  <div className="mb-2">
                    {renderStars(rev.rating)}
                  </div>
                  <p className="mb-0 text-secondary">{rev.comment}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};

export default BookDetail;
