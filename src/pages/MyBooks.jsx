import React, { useState, useEffect, useContext } from 'react';
import { useBooks } from '../hooks/useBooks';
import { AuthContext } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import toast from 'react-hot-toast';

const MyBooks = () => {
  const { myBooks, addBook, editBook, removeBook } = useBooks();
  const { user } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({ 
    id: null, 
    title: '', 
    author: '', 
    coverUrl: '',
    condition: 'nuevo',
    format: 'fisico',
    price: '',
    stock: '1'
  });
  
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Only load if user exists and context is ready, though the hook manages storage.
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.price || !formData.stock) {
      toast.error('Título, autor, precio y stock son obligatorios');
      return;
    }

    if (Number(formData.price) <= 0) {
      toast.error('El precio debe ser mayor a 0');
      return;
    }

    if (Number(formData.stock) < 0) {
      toast.error('El stock no puede ser negativo');
      return;
    }

    const newBook = { 
      ...formData, 
      id: isEditing ? formData.id : Date.now().toString(),
      price: Number(formData.price),
      stock: Number(formData.stock)
    };

    if (isEditing) {
      editBook(newBook);
      toast.success('Libro actualizado exitosamente');
    } else {
      addBook(newBook);
      toast.success('Libro publicado exitosamente');
    }
    
    resetForm();
  };

  const handleEdit = (book) => {
    setFormData(book);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta publicación?")) {
      removeBook(id);
      toast.success("Publicación eliminada");
    }
  };

  const resetForm = () => {
    setFormData({ id: null, title: '', author: '', coverUrl: '', condition: 'nuevo', format: 'fisico', price: '', stock: '1' });
    setIsEditing(false);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center mb-5">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-header bg-magenta text-white p-4 rounded-top-4 border-0">
              <h3 className="mb-0 fw-bold"><i className="bi bi-journal-plus me-2"></i> {isEditing ? 'Editar Publicación' : 'Publicar Nuevo Libro'}</h3>
              <p className="mb-0 small opacity-75">Administra tu inventario de ventas y arriendos</p>
            </div>
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Título del Libro *</label>
                    <input type="text" className="form-control" name="title" value={formData.title} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Autor *</label>
                    <input type="text" className="form-control" name="author" value={formData.author} onChange={handleInputChange} required />
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Estado *</label>
                    <select className="form-select" name="condition" value={formData.condition} onChange={handleInputChange} required>
                      <option value="nuevo">Nuevo</option>
                      <option value="usado">Usado</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Formato *</label>
                    <select className="form-select" name="format" value={formData.format} onChange={handleInputChange} required>
                      <option value="fisico">Libro Físico</option>
                      <option value="digital">E-Book (Digital)</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Precio de Venta ($) *</label>
                    <input type="number" className="form-control" name="price" min="1" value={formData.price} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Stock / Cantidad *</label>
                    <input type="number" className="form-control" name="stock" min="1" value={formData.format === 'digital' ? 999 : formData.stock} onChange={handleInputChange} disabled={formData.format === 'digital'} required />
                    {formData.format === 'digital' && <div className="form-text">Los E-Books tienen stock infinito por defecto.</div>}
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">URL de la Portada (Opcional)</label>
                    <input type="url" className="form-control" name="coverUrl" placeholder="https://ejemplo.com/imagen.jpg" value={formData.coverUrl} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="d-flex gap-3 mt-4 pt-3 border-top">
                  <button type="submit" className="btn btn-magenta px-4 rounded-pill fw-bold">
                    {isEditing ? 'Guardar Cambios' : 'Publicar Libro'}
                  </button>
                  {isEditing && (
                    <button type="button" className="btn btn-outline-secondary px-4 rounded-pill fw-bold" onClick={resetForm}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <h3 className="fw-bold mb-4 border-bottom pb-2">Mis Publicaciones ({myBooks.length})</h3>
          {myBooks.length === 0 ? (
            <div className="text-center py-5 bg-light rounded-4 border border-dashed">
              <i className="bi bi-box-seam display-1 text-muted mb-3 d-block"></i>
              <h5 className="text-muted fw-bold">Aún no has publicado ningún libro</h5>
              <p className="text-secondary">Usa el formulario de arriba para agregar tu primer libro al catálogo.</p>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {myBooks.map((book) => (
                <div className="col" key={book.id}>
                  <BookCard book={book} isLocal={true} onEdit={handleEdit} onDelete={handleDelete} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBooks;
