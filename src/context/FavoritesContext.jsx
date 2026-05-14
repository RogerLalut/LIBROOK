import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavs = localStorage.getItem('librook_favorites');
    if (storedFavs) {
      setFavorites(JSON.parse(storedFavs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('librook_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (book) => {
    const id = book.id || book.key;
    const isFav = favorites.find(fav => (fav.id || fav.key) === id);

    if (isFav) {
      setFavorites(favorites.filter(fav => (fav.id || fav.key) !== id));
      toast.success("Eliminado de tu lista de deseos");
    } else {
      setFavorites([...favorites, book]);
      toast.success("¡Agregado a tu lista de deseos!");
    }
  };

  const isFavorite = (bookId) => {
    return favorites.some(fav => (fav.id || fav.key) === bookId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
