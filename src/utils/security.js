/**
 * Capa de Seguridad y Utilidades
 * Contiene funciones para prevenir XSS y validar formularios.
 */

/**
 * Sanitiza una cadena de texto eliminando caracteres y etiquetas peligrosas.
 * Evita inyección XSS básica.
 * @param {string} input - Texto ingresado por el usuario
 * @returns {string} - Texto sanitizado
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Reemplazar caracteres de etiquetas HTML y corchetes de inyección
  let sanitized = input
    .replace(/</g, '')
    .replace(/>/g, '')
    .replace(/\{/g, '')
    .replace(/\}/g, '');
    
  // Eliminar la palabra script independientemente de mayúsculas/minúsculas
  sanitized = sanitized.replace(/script/gi, '');
  
  return sanitized.trim();
};

/**
 * Valida un correo electrónico.
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Valida si una URL es correcta (empieza con http o https)
 */
export const isValidURL = (url) => {
  if (!url) return true; // Si es opcional y está vacía
  if (url.startsWith('data:image/')) return true; // Permitir imágenes base64 locales
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch (e) {
    return false;
  }
};
