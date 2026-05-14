import axios from 'axios';

const BASE_URL = 'https://openlibrary.org/search.json';

export const searchBooks = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw new Error('Failed to fetch books from OpenLibrary API');
  }
};
