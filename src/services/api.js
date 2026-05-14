import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = 'https://openlibrary.org/search.json';

// Crear una instancia de axios configurada
const apiInstance = axios.create({
  timeout: 20000, // 20 segundos de timeout
});

export const searchBooks = async (query) => {
  try {
    const response = await apiInstance.get(`${BASE_URL}?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    
    // Categorización de Errores para Feedback UI
    if (error.code === 'ECONNABORTED') {
      toast.error('La conexión tardó demasiado (Timeout). Intente nuevamente.');
      throw new Error('TIMEOUT');
    } else if (!error.response) {
      toast.error('Error de red. Verifique su conexión a internet.');
      throw new Error('NETWORK_ERROR');
    } else {
      toast.error(`Error del servidor (${error.response.status}). Intente más tarde.`);
      throw new Error('SERVER_ERROR');
    }
  }
};
