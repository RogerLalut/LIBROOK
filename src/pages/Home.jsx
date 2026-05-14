import React, { useState, useEffect, useContext } from 'react';
import { searchBooks } from '../services/api';
import { CartContext } from '../context/CartContext';
import BookCard from '../components/BookCard';
import BookCardSkeleton from '../components/BookCardSkeleton';
import Carousel from '../components/Carousel';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const [bestsellers, setBestsellers] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { getBookData } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        // Obtenemos un mix de libros para inicializar las secciones
        const [bestData, recData, newData] = await Promise.all([
          searchBooks('harry potter'),
          searchBooks('fiction'),
          searchBooks('programming')
        ]);
        
        // Inicializar propiedades inmediatamente
        const initBooks = (books) => books.slice(0, 10).map(b => {
          const data = getBookData(b.key, false);
          return { 
            ...b, 
            condition: data.condition, 
            price: data.basePrice,
            isEbook: data.ebook.isEbook,
            ebookFormat: data.ebook.format,
            ebookSize: data.ebook.size
          };
        });

        setBestsellers(initBooks(bestData.docs || []));
        setRecommended(initBooks(recData.docs || []));
        setNewReleases(initBooks(newData.docs || []));
        
      } catch (error) {
        console.error("Error al cargar la página principal", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categories = [
    { name: 'Fantasía', icon: 'bi-moon-stars', query: 'fantasy' },
    { name: 'Ciencia Ficción', icon: 'bi-rocket', query: 'science_fiction' },
    { name: 'Romance', icon: 'bi-heart', query: 'romance' },
    { name: 'Historia', icon: 'bi-bank', query: 'history' },
    { name: 'Programación', icon: 'bi-laptop', query: 'programming' },
    { name: 'Manga', icon: 'bi-book-half', query: 'manga' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-dark text-white py-5 position-relative overflow-hidden" style={{ minHeight: '400px' }}>
        <div className="container position-relative z-2 py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <span className="badge bg-magenta px-3 py-2 rounded-pill mb-3 fs-6">Nueva Temporada</span>
              <h1 className="display-4 fw-bold mb-3">Encuentra tu próxima gran aventura</h1>
              <p className="lead mb-4 opacity-75">Millones de libros físicos y E-Books digitales te esperan. Compra, arrienda o vende tus libros en un solo lugar.</p>
              
              <div className="d-flex shadow-lg rounded-pill overflow-hidden bg-white p-1" style={{ maxWidth: '500px' }}>
                <input 
                  type="text" 
                  className="form-control border-0 px-4 py-2 bg-transparent" 
                  placeholder="¿Qué quieres leer hoy?" 
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/search?q=${e.target.value}`)}
                />
                <button className="btn btn-magenta rounded-pill px-4 fw-bold" onClick={() => navigate('/search')}>
                  <i className="bi bi-search"></i>
                </button>
              </div>
              <div className="mt-3 text-white-50 small">
                <i className="bi bi-star-fill text-warning me-1"></i> +50,000 usuarios confían en nosotros
              </div>
            </div>
          </div>
        </div>
        {/* Background Decorative Graphic */}
        <div className="position-absolute top-0 end-0 h-100 w-50 opacity-25 d-none d-lg-block" style={{
          background: 'radial-gradient(circle at 70% 50%, var(--primary-magenta) 0%, transparent 60%)'
        }}></div>
      </section>

      {/* Featured Categories */}
      <section className="py-5 bg-light">
        <div className="container">
          <h3 className="fw-bold mb-4 text-center">Explorar Categorías</h3>
          <div className="row g-3 justify-content-center">
            {categories.map((cat, idx) => (
              <div className="col-6 col-md-4 col-lg-2" key={idx}>
                <div 
                  className="card text-center border-0 shadow-sm h-100 category-card cursor-pointer"
                  onClick={() => navigate(`/search?category=${cat.query}`)}
                >
                  <div className="card-body py-4">
                    <i className={`bi ${cat.icon} display-5 text-magenta mb-3`}></i>
                    <h6 className="fw-bold mb-0 text-dark">{cat.name}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recomendados Para Ti (Carrusel Automático) */}
      <section className="py-5 overflow-hidden">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 className="fw-bold mb-1">Recomendados para ti</h2>
              <p className="text-muted mb-0">Basado en tus intereses y compras recientes</p>
            </div>
            <Link to="/search" className="btn btn-outline-magenta rounded-pill d-none d-md-block">Ver todo <i className="bi bi-arrow-right"></i></Link>
          </div>
          
          <Carousel items={recommended} loading={loading} />
          
          <div className="text-center mt-3 d-md-none">
            <Link to="/search" className="btn btn-outline-magenta rounded-pill w-100">Ver todo</Link>
          </div>
        </div>
      </section>

      {/* Libros Digitales E-Books */}
      <section className="py-5 bg-dark text-white">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-md-8">
              <span className="badge bg-info text-dark mb-2 px-3 py-2 rounded-pill"><i className="bi bi-cloud-download me-1"></i> Nueva Sección</span>
              <h2 className="fw-bold">Explora E-Books Digitales</h2>
              <p className="opacity-75">Lleva tu biblioteca a todas partes. Compra y descarga al instante.</p>
            </div>
            <div className="col-md-4 text-md-end">
              <Link to="/search?format=digital" className="btn btn-outline-light rounded-pill px-4">Ver Catálogo Digital</Link>
            </div>
          </div>
          
          <Carousel items={newReleases.filter(b => b.isEbook).length > 0 ? newReleases.filter(b => b.isEbook) : newReleases} loading={loading} />
        </div>
      </section>

      {/* Bestsellers Físicos */}
      <section className="py-5 mb-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 className="fw-bold mb-1">🔥 Los Más Vendidos</h2>
              <p className="text-muted mb-0">Los libros físicos más populares del momento</p>
            </div>
          </div>
          
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div className="col" key={`bs-skel-${i}`}>
                  <BookCardSkeleton />
                </div>
              ))
            ) : (
              bestsellers.slice(0, 5).map((book, idx) => (
                <div className="col" key={`bs-${idx}`}>
                  <BookCard book={book} isLocal={false} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
