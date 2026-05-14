import { useState, useEffect } from 'react';

export const useBooks = () => {
  const [myBooks, setMyBooks] = useState([]);

  useEffect(() => {
    const storedBooks = localStorage.getItem('librook_my_books');
    if (storedBooks) {
      setMyBooks(JSON.parse(storedBooks));
    }
  }, []);

  const saveBooks = (books) => {
    setMyBooks(books);
    localStorage.setItem('librook_my_books', JSON.stringify(books));
  };

  const addBook = (book) => {
    const newBook = { ...book, id: Date.now().toString() };
    saveBooks([...myBooks, newBook]);
  };

  const updateBook = (updatedBook) => {
    const updatedBooks = myBooks.map(book => 
      book.id === updatedBook.id ? updatedBook : book
    );
    saveBooks(updatedBooks);
  };

  const deleteBook = (id) => {
    const updatedBooks = myBooks.filter(book => book.id !== id);
    saveBooks(updatedBooks);
  };

  return { myBooks, addBook, updateBook, deleteBook };
};
