import { useState, useEffect } from 'react';

export const useBooks = () => {
  const [myBooks, setMyBooks] = useState([]);

  const getLoggedUser = () => JSON.parse(localStorage.getItem('librook_current_user') || 'null');

  useEffect(() => {
    const storedBooks = localStorage.getItem('librook_my_books');
    const user = getLoggedUser();
    
    if (storedBooks && user) {
      const allBooks = JSON.parse(storedBooks);
      // Filtro de seguridad: el correo es la primary key
      const userBooks = allBooks.filter(book => book.userEmail === user.email);
      setMyBooks(userBooks);
    }
  }, []);

  const saveBooks = (newAllBooks) => {
    localStorage.setItem('librook_my_books', JSON.stringify(newAllBooks));
    const user = getLoggedUser();
    if (user) {
      setMyBooks(newAllBooks.filter(book => book.userEmail === user.email));
    }
  };

  const addBook = (book) => {
    const allBooks = JSON.parse(localStorage.getItem('librook_my_books') || '[]');
    const user = getLoggedUser();
    // Vinculamos la publicación a la cuenta actual
    const newBook = { ...book, id: Date.now().toString(), userEmail: user?.email, sellerName: user?.name };
    saveBooks([...allBooks, newBook]);
  };

  const editBook = (id, updatedFields) => {
    const allBooks = JSON.parse(localStorage.getItem('librook_my_books') || '[]');
    const updatedBooks = allBooks.map(book => 
      book.id === id ? { ...book, ...updatedFields } : book
    );
    saveBooks(updatedBooks);
  };

  const deleteBook = (id) => {
    const allBooks = JSON.parse(localStorage.getItem('librook_my_books') || '[]');
    const updatedBooks = allBooks.filter(book => book.id !== id);
    saveBooks(updatedBooks);
  };

  return { myBooks, addBook, editBook, deleteBook, updateBook: editBook };
};
