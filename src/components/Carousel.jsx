import React, { useEffect, useRef, useState } from 'react';
import BookCard from './BookCard';
import BookCardSkeleton from './BookCardSkeleton';

const Carousel = ({ items, loading, title }) => {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // AutoPlay Effect
  useEffect(() => {
    let interval;
    if (!isHovered && !loading && items.length > 0) {
      interval = setInterval(() => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          // Si llega al final, vuelve al inicio
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
            scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' }); // Ancho aprox de una card
          }
        }
      }, 3000); // Mueve cada 3 segundos
    }
    return () => clearInterval(interval);
  }, [isHovered, loading, items]);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className="carousel-container position-relative py-3" 
         onMouseEnter={() => setIsHovered(true)} 
         onMouseLeave={() => setIsHovered(false)}>
      
      {/* Navigation Arrows */}
      {!loading && items.length > 0 && (
        <>
          <button 
            className="btn btn-light rounded-circle shadow position-absolute z-3" 
            style={{ left: '-20px', top: '50%', transform: 'translateY(-50%)', width: '45px', height: '45px' }}
            onClick={scrollLeft}
          >
            <i className="bi bi-chevron-left fw-bold"></i>
          </button>
          
          <button 
            className="btn btn-light rounded-circle shadow position-absolute z-3" 
            style={{ right: '-20px', top: '50%', transform: 'translateY(-50%)', width: '45px', height: '45px' }}
            onClick={scrollRight}
          >
            <i className="bi bi-chevron-right fw-bold"></i>
          </button>
        </>
      )}

      {/* Track */}
      <div 
        ref={scrollRef}
        className="d-flex gap-4 overflow-hidden px-2 py-3" 
        style={{ scrollBehavior: 'smooth', scrollSnapType: 'x mandatory' }}
      >
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} style={{ flex: '0 0 280px', width: '280px', minWidth: '280px', maxWidth: '280px', scrollSnapAlign: 'start' }} className="h-100">
              <BookCardSkeleton />
            </div>
          ))
        ) : (
          items.map((book, idx) => (
            <div key={book.key || book.id || idx} style={{ flex: '0 0 280px', width: '280px', minWidth: '280px', maxWidth: '280px', scrollSnapAlign: 'start', transition: 'transform 0.3s' }} className="carousel-item-hover h-100">
              <BookCard book={book} isLocal={book.isLocal} />
            </div>
          ))
        )}
      </div>

      <style jsx="true">{`
        .carousel-item-hover:hover {
          transform: translateY(-5px);
        }
        .carousel-container {
          padding-left: 20px;
          padding-right: 20px;
        }
      `}</style>
    </div>
  );
};

export default Carousel;
