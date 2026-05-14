import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchBooks } from '../services/api';
import { CartContext } from '../context/CartContext';
import BookCard from '../components/BookCard';
import BookCardSkeleton from '../components/BookCardSkeleton';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialFilter = searchParams.get('filter') || ''; 
  const initialFormat = searchParams.get('format') || 'all'; 
  
  const { getBookData } = useContext(CartContext);
  
  const [queryInput, setQueryInput] = useState(initialQuery);
  const debouncedQuery = useDebounce(queryInput, 500);

  const [displayQuery, setDisplayQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  
  const [activeLetter, setActiveLetter] = useState(null);
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [activeFormat, setActiveFormat] = useState(initialFormat);
  const [activeSort, setActiveSort] = useState('relevance');
  
  // Paginación de 25 en 25
  const [visibleCount, setVisibleCount] = useState(25);

  const loadLocalBooks = () => {
    return JSON.parse(localStorage.getItem('librook_my_books') || '[]');
  };

  useEffect(() => {
    if (debouncedQuery !== initialQuery) {
      if (debouncedQuery.trim()) {
        const newParams = Object.fromEntries(searchParams);
        newParams.q = debouncedQuery;
        setSearchParams(newParams);
      } else if (initialQuery) {
        setSearchParams({});
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  useEffect(() => {
    const executeSearch = async () => {
      let searchString = initialQuery;
      let displayStr = '';

      if (initialCategory) {
        searchString = `subject:${initialCategory}`;
        const dict = { fantasy: 'Fantasía', romance: 'Romance', science_fiction: 'Ciencia Ficción', history: 'Historia', programming: 'Programación', manga: 'Manga', horror: 'Terror', children: 'Infantil' };
        displayStr = `Categoría: ${dict[initialCategory] || initialCategory}`;
        setQueryInput('');
      } else if (initialFilter === 'bestseller' || initialFilter === 'ofertas') {
        searchString = initialFilter === 'bestseller' ? 'harry potter' : 'fiction';
        displayStr = initialFilter === 'bestseller' ? 'Más Vendidos' : 'Ofertas';
        setQueryInput('');
      } else if (initialQuery) {
        searchString = initialQuery;
        displayStr = initialQuery;
      } else {
        searchString = 'fiction'; 
        displayStr = 'Catálogo General';
        setQueryInput('');
      }

      setActiveFilter(initialFilter);
      setActiveFormat(initialFormat);
      setDisplayQuery(displayStr);
      setActiveLetter(null); 
      setVisibleCount(25); // Reset a 25 en cada búsqueda nueva
      setLoading(true);
      setError(null);
      
      try {
        let apiBooks = [];
        
        const cacheKey = `librook_cache_${searchString}`;
        const cachedData = localStorage.getItem(cacheKey);
        
        if (cachedData) {
          apiBooks = JSON.parse(cachedData);
        } else {
          const data = await searchBooks(searchString);
          apiBooks = data.docs || [];
          localStorage.setItem(cacheKey, JSON.stringify(apiBooks));
        }
        
        const localBooksRaw = loadLocalBooks().map(b => ({...b, isLocal: true}));
        let merged = [...apiBooks, ...localBooksRaw];

        const mergedWithProperties = merged.map(b => {
          const id = b.key || b.id;
          const data = getBookData(id, b.isLocal, b.isLocal ? b : null);
          return { 
            ...b, 
            condition: data.condition, 
            price: data.basePrice,
            isEbook: data.ebook.isEbook,
            ebookFormat: data.ebook.format,
            ebookSize: data.ebook.size
          };
        });

        setBooks(mergedWithProperties);
      } catch (err) {
        setError('Hubo un problema al buscar los libros. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    executeSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery, initialCategory, initialFilter, initialFormat]);

  // Libros filtrados ANTES de aplicar el límite de paginación
  const totallyFilteredBooks = useMemo(() => {
    let result = [...books];

    // Filtros...
    if (activeFilter === 'new') result = result.filter(b => b.condition === 'nuevo' && !b.isEbook);
    else if (activeFilter === 'used') result = result.filter(b => b.condition === 'usado' && !b.isEbook);

    if (activeFormat === 'fisico') result = result.filter(b => !b.isEbook);
    else if (activeFormat === 'digital') result = result.filter(b => b.isEbook);

    if (activeLetter) {
      result = result.filter(b => {
        const title = b.title || '';
        return title.toUpperCase().startsWith(activeLetter);
      });
    }

    if (activeSort === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (activeSort === 'price_desc') result.sort((a, b) => b.price - a.price);
    else if (activeSort === 'newest') result.sort((a, b) => (b.first_publish_year || 0) - (a.first_publish_year || 0));

    return result;
  }, [books, activeFilter, activeFormat, activeLetter, activeSort]);

  // Libros que realmente se renderizan en la grilla actual
  const visibleBooks = totallyFilteredBooks.slice(0, visibleCount);
  const hasMore = visibleCount < totallyFilteredBooks.length;

  const handleLoadMore = () => {
    setLoadingMore(true);
    // Simular un pequeño tiempo de carga de 500ms para efecto visual
    setTimeout(() => {
      setVisibleCount(prev => prev + 25);
      setLoadingMore(false);
    }, 500);
  };

  const handleLetterClick = (letter) => {
    setActiveLetter(prev => prev === letter ? null : letter);
    setVisibleCount(25); // Reset a 25 al cambiar letras
  };

  const updateParam = (key, value) => {
    const newParams = Object.fromEntries(searchParams);
    if (value) newParams[key] = value;
    else delete newParams[key];
    
    if (key === 'format' && value === 'digital') {
      delete newParams['filter'];
    }
    
    setSearchParams(newParams);
  };

  const renderSkeletons = () => (
    [...Array(12)].map((_, i) => (
      <div className="col" key={`skel-${i}`}>
        <BookCardSkeleton />
      </div>
    ))
  );

  return (
    <div className="container py-5">
      <div className="row justify-content-center mb-4">
        <div className="col-md-8 text-center">
          <h2 className="fw-bold mb-4 text-dark">Buscador de Libros</h2>
          <div className="d-flex shadow-sm rounded-pill overflow-hidden border bg-white">
            <input 
              type="text" 
              className="form-control border-0 px-4 py-3" 
              placeholder="Buscar por título, autor, o ISBN..." 
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
            />
            <button className="btn btn-magenta px-5 fw-bold" disabled={loading}>
              <i className="bi bi-search me-2"></i> Buscar
            </button>
          </div>
        </div>
      </div>

      <div className="row justify-content-center mb-4">
        <div className="col-12 text-center">
          <p className="text-muted small mb-2 fw-semibold">Filtro Alfabético (Acumulativo)</p>
          <div className="d-flex flex-wrap justify-content-center gap-1 mb-3">
            {ALPHABET.map(letter => (
              <button 
                key={letter} 
                className={`btn btn-sm rounded-1 px-2 fw-bold ${activeLetter === letter ? 'btn-magenta' : 'btn-outline-secondary'}`}
                onClick={() => handleLetterClick(letter)}
              >
                {letter}
              </button>
            ))}
          </div>
          
          <p className="text-muted small mb-2 fw-semibold mt-3">Estado Físico</p>
          <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
            <span className={`badge border p-2 cursor-pointer shadow-sm rounded-pill px-3 ${activeFilter === '' ? 'bg-dark text-white' : 'bg-white text-dark'}`} onClick={() => updateParam('filter', '')}>Todos</span>
            <span className={`badge border p-2 cursor-pointer shadow-sm rounded-pill px-3 ${activeFilter === 'new' ? 'bg-magenta text-white' : 'bg-white text-dark'}`} onClick={() => updateParam('filter', 'new')}>✨ Nuevos</span>
            <span className={`badge border p-2 cursor-pointer shadow-sm rounded-pill px-3 ${activeFilter === 'used' ? 'bg-magenta text-white' : 'bg-white text-dark'}`} onClick={() => updateParam('filter', 'used')}>📦 Usados</span>
          </div>

          <p className="text-muted small mb-2 fw-semibold mt-3">Formato de Libro</p>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <span className={`badge border p-2 cursor-pointer shadow-sm rounded-pill px-3 ${activeFormat === 'all' ? 'bg-dark text-white' : 'bg-white text-dark'}`} onClick={() => updateParam('format', 'all')}>Todos los Formatos</span>
            <span className={`badge border p-2 cursor-pointer shadow-sm rounded-pill px-3 ${activeFormat === 'fisico' ? 'bg-primary text-white' : 'bg-white text-dark'}`} onClick={() => updateParam('format', 'fisico')}><i className="bi bi-book"></i> Físicos</span>
            <span className={`badge border p-2 cursor-pointer shadow-sm rounded-pill px-3 ${activeFormat === 'digital' ? 'bg-info text-dark' : 'bg-white text-dark'}`} onClick={() => updateParam('format', 'digital')}><i className="bi bi-laptop"></i> E-Books Digitales</span>
          </div>
        </div>
      </div>

      <div className="bg-light p-3 rounded-4 shadow-sm border mb-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <div>
          <h5 className="fw-bold mb-0">
            {displayQuery} 
            {activeLetter && <span className="text-magenta ms-2">(Letra {activeLetter})</span>}
          </h5>
          <span className="text-muted small">Mostrando {visibleBooks.length} de {totallyFilteredBooks.length} resultados</span>
        </div>
        <div className="d-flex gap-3">
          <select className="form-select border-0 shadow-sm" style={{minWidth: '180px'}} value={activeSort} onChange={(e) => { setActiveSort(e.target.value); setVisibleCount(25); }}>
            <option value="relevance">Ordenar: Relevancia</option>
            <option value="price_asc">Precio: Menor a Mayor</option>
            <option value="price_desc">Precio: Mayor a Menor</option>
            <option value="newest">Más Recientes</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger text-center shadow-sm rounded-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
        </div>
      )}

      {/* Grid Animations via CSS */}
      <style jsx="true">{`
        .book-fade-in {
          animation: fadeIn 0.4s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mb-5">
        {loading ? renderSkeletons() : (
          visibleBooks.map((book, index) => (
            <div className="col book-fade-in" key={book.key || book.id || index}>
              <BookCard book={book} isLocal={book.isLocal} />
            </div>
          ))
        )}
      </div>

      {!loading && totallyFilteredBooks.length === 0 && !error && (
        <div className="text-center py-5 mt-4 bg-white rounded-4 shadow-sm border">
          <i className="bi bi-journal-x display-1 text-muted mb-3 d-block"></i>
          <h4 className="fw-bold text-dark">No se encontraron resultados</h4>
          <p className="text-muted">Ningún libro coincide con la combinación de filtros seleccionada.</p>
          <button className="btn btn-outline-magenta rounded-pill px-4 mt-2" onClick={() => {
            setActiveLetter(null);
            setSearchParams({});
          }}>
            Limpiar Todos los Filtros
          </button>
        </div>
      )}

      {/* Botón de Paginación */}
      {!loading && hasMore && totallyFilteredBooks.length > 0 && (
        <div className="text-center pb-5">
          <button 
            className="btn btn-outline-dark rounded-pill px-5 py-3 fw-bold shadow-sm"
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Cargando más libros...</>
            ) : (
              <><i className="bi bi-arrow-clockwise me-2"></i> Mostrar más libros</>
            )}
          </button>
          <p className="text-muted small mt-2">Estás viendo {visibleBooks.length} de {totallyFilteredBooks.length}</p>
        </div>
      )}
    </div>
  );
};

export default Search;
