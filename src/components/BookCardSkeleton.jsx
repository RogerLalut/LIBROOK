import React from 'react';

const BookCardSkeleton = () => {
  return (
    <div className="card book-card h-100 border-0 shadow-sm skeleton">
      <div className="skeleton skeleton-img"></div>
      <div className="card-body d-flex flex-column bg-white">
        <div className="skeleton skeleton-text title"></div>
        <div className="skeleton skeleton-text w-50 mb-3"></div>
        
        <div className="mt-auto">
          <div className="skeleton skeleton-text w-25 mb-3" style={{ height: '1.5rem' }}></div>
          <div className="skeleton skeleton-text w-100" style={{ height: '2.5rem', borderRadius: '50px' }}></div>
        </div>
      </div>
    </div>
  );
};

export default BookCardSkeleton;
