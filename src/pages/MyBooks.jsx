import React, { useState, useEffect, useContext } from 'react';
import { useBooks } from '../hooks/useBooks';
import BookCard from '../components/BookCard';
import { AuthContext } from '../context/AuthContext';
import { sanitizeInput, isValidURL } from '../utils/security';
import toast from 'react-hot-toast';

const MyBooks = ({ isEmbedded = false }) => {
  const { myBooks, addBook, editBook, deleteBook } = useBooks();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: '', author: '', coverUrl: '',
    format: 'fisico', // fisico | digital
    condition: 'nuevo',
    basePrice: '', stock: ''
  });
  
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (formData.format === 'digital') {
      setFormData(prev => ({ ...prev, stock: 999 })); // Stock infinito para digital
    } else if (formData.format === 'fisico' && formData.stock === 999) {
      setFormData(prev => ({ ...prev, stock: '' })); // Reset stock
    }
  }, [formData.format]);

  const validateForm = () => {
    const newErrors = {};
    const safeTitle = sanitizeInput(formData.title);
    const safeAuthor = sanitizeInput(formData.author);

    if (!safeTitle) newErrors.title = "El título es obligatorio.";
    if (!safeAuthor) newErrors.author = "El autor es obligatorio.";
    
    if (formData.coverUrl && !isValidURL(formData.coverUrl)) {
      newErrors.coverUrl = "La URL de la portada no es válida.";
    }

    const price = Number(formData.basePrice);
    if (!formData.basePrice || isNaN(price) || price <= 0) {
      newErrors.basePrice = "El precio debe ser un número mayor a 0.";
    }

    if (formData.format === 'fisico') {
      const st = Number(formData.stock);
      if (formData.stock === '' || isNaN(st) || st < 0) {
        newErrors.stock = "El stock debe ser un número mayor o igual a 0.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast.error("La imagen supera los 4MB. Por favor elige una más ligera.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 700;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6); // Compress to 60% JPEG
          setFormData(prev => ({...prev, coverUrl: dataUrl}));
          setErrors(prev => ({...prev, coverUrl: null}));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Por favor corrige los errores del formulario.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const safeTitle = sanitizeInput(formData.title);
      const safeAuthor = sanitizeInput(formData.author);

      const isEbook = formData.format === 'digital';
      const ebookData = isEbook ? { isEbook: true, format: 'PDF/EPUB', size: '5.0 MB' } : { isEbook: false };

      const bookPayload = {
        title: safeTitle,
        author: safeAuthor,
        coverUrl: formData.coverUrl || 'https://via.placeholder.com/300x400?text=Sin+Portada',
        condition: isEbook ? 'digital' : formData.condition,
        basePrice: Number(formData.basePrice),
        stock: isEbook ? 999 : Number(formData.stock),
        isEbook: isEbook,
        ebookFormat: ebookData.format,
        ebookSize: ebookData.size
      };

      try {
        if (editingId) {
          editBook(editingId, bookPayload);
          toast.success("Publicación actualizada correctamente.");
        } else {
          addBook(bookPayload);
          toast.success("¡Libro publicado con éxito!");
        }

        setFormData({ title: '', author: '', coverUrl: '', format: 'fisico', condition: 'nuevo', basePrice: '', stock: '' });
        setEditingId(null);
        setErrors({});
      } catch (err) {
        console.error("Error saving book:", err);
        toast.error("Error al guardar. La imagen es demasiado pesada para el almacenamiento local. Usa una URL.");
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const handleEdit = (book) => {
    setEditingId(book.id);
    setFormData({
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl,
      format: book.isEbook ? 'digital' : 'fisico',
      condition: book.condition,
      basePrice: book.basePrice || 0,
      stock: book.stock || 0
    });
    setErrors({});
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta publicación?")) {
      deleteBook(id);
      toast.success("Publicación eliminada.");
    }
  };

  if (!user) {
    return <div className="container py-5 text-center"><h3>Debes iniciar sesión para publicar libros</h3></div>;
  }



  const content = (
    <div className="row g-5">
      <div className={isEmbedded ? "col-12 col-xl-5" : "col-lg-4"}>
        <div className="card shadow-sm border-0 rounded-4 sticky-top" style={{top: '100px'}}>
            <div className="card-header bg-magenta text-white p-4 border-0 rounded-top-4">
              <h5 className="mb-0 fw-bold">{editingId ? 'Editar Publicación' : 'Nueva Publicación'}</h5>
            </div>
            <div className="card-body p-4 bg-light rounded-bottom-4">
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted text-uppercase">Formato de Venta</label>
                  <select 
                    className="form-select border-0 shadow-sm py-2" 
                    value={formData.format} 
                    onChange={(e) => setFormData({...formData, format: e.target.value})}
                  >
                    <option value="fisico">Libro Físico Tradicional</option>
                    <option value="digital">E-Book (Descarga Digital)</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted text-uppercase">Título del Libro</label>
                  <input type="text" className={`form-control border-0 shadow-sm py-2 ${errors.title ? 'is-invalid' : ''}`} value={formData.title} onChange={(e) => {setFormData({...formData, title: e.target.value}); setErrors({...errors, title: null});}} />
                  {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted text-uppercase">Autor</label>
                  <input type="text" className={`form-control border-0 shadow-sm py-2 ${errors.author ? 'is-invalid' : ''}`} value={formData.author} onChange={(e) => {setFormData({...formData, author: e.target.value}); setErrors({...errors, author: null});}} />
                  {errors.author && <div className="invalid-feedback">{errors.author}</div>}
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted text-uppercase">Portada del Libro (URL o Archivo)</label>
                  <div className="input-group shadow-sm rounded-2 border-0 bg-white">
                    <input 
                      type="text" 
                      className={`form-control border-0 py-2 ${errors.coverUrl ? 'is-invalid' : ''}`} 
                      placeholder="Pega una URL (https://...)" 
                      value={formData.coverUrl.startsWith('data:image') ? 'Archivo de imagen local cargado' : formData.coverUrl} 
                      onChange={(e) => {setFormData({...formData, coverUrl: e.target.value}); setErrors({...errors, coverUrl: null});}} 
                      disabled={formData.coverUrl.startsWith('data:image')}
                    />
                    {formData.coverUrl.startsWith('data:image') ? (
                      <button className="btn btn-outline-danger border-0" type="button" onClick={() => setFormData({...formData, coverUrl: ''})} title="Quitar imagen">
                        <i className="bi bi-trash"></i>
                      </button>
                    ) : (
                      <label className="input-group-text bg-white border-0 text-magenta border-start" style={{ cursor: 'pointer' }} title="Subir desde tu PC">
                        <i className="bi bi-upload me-2"></i> Subir
                        <input type="file" accept="image/*" className="d-none" onChange={handleImageUpload} />
                      </label>
                    )}
                  </div>
                  {errors.coverUrl && <div className="text-danger small mt-1">{errors.coverUrl}</div>}
                  {formData.coverUrl && formData.coverUrl.startsWith('data:image') && (
                    <div className="text-success small mt-1"><i className="bi bi-check-circle-fill me-1"></i>Lista para publicar</div>
                  )}
                </div>

                <div className="row g-2 mb-4">
                  <div className="col-12">
                    <label className="form-label fw-bold small text-muted text-uppercase">Precio de Venta ($)</label>
                    <input type="number" min="1" className={`form-control border-0 shadow-sm py-2 fw-bold text-magenta ${errors.basePrice ? 'is-invalid' : ''}`} value={formData.basePrice} onChange={(e) => {setFormData({...formData, basePrice: e.target.value}); setErrors({...errors, basePrice: null});}} />
                    {errors.basePrice && <div className="invalid-feedback">{errors.basePrice}</div>}
                  </div>
                  
                  {formData.format === 'fisico' && (
                    <>
                      <div className="col-6 mt-3">
                        <label className="form-label fw-bold small text-muted text-uppercase">Condición</label>
                        <select className="form-select border-0 shadow-sm py-2" value={formData.condition} onChange={(e) => setFormData({...formData, condition: e.target.value})}>
                          <option value="nuevo">Nuevo</option>
                          <option value="usado">Usado</option>
                        </select>
                      </div>
                      <div className="col-6 mt-3">
                        <label className="form-label fw-bold small text-muted text-uppercase">Stock (Físico)</label>
                        <input type="number" min="0" className={`form-control border-0 shadow-sm py-2 ${errors.stock ? 'is-invalid' : ''}`} value={formData.stock} onChange={(e) => {setFormData({...formData, stock: e.target.value}); setErrors({...errors, stock: null});}} />
                        {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
                      </div>
                    </>
                  )}

                  {formData.format === 'digital' && (
                    <div className="col-12 mt-3">
                       <div className="alert alert-info py-2 mb-0 small">
                         <i className="bi bi-info-circle me-1"></i> Las descargas digitales tienen stock infinito automático.
                       </div>
                    </div>
                  )}
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-dark w-100 py-2 fw-bold shadow-sm rounded-3" disabled={loading}>
                    {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-cloud-arrow-up me-2"></i>}
                    {editingId ? 'Guardar Cambios' : 'Publicar Libro'}
                  </button>
                  {editingId && (
                    <button type="button" className="btn btn-outline-danger py-2 px-3 shadow-sm rounded-3" onClick={() => { setEditingId(null); setFormData({ title: '', author: '', coverUrl: '', format: 'fisico', condition: 'nuevo', basePrice: '', stock: '' }); setErrors({}); }} disabled={loading}>
                      <i className="bi bi-x-lg"></i>
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className={isEmbedded ? "col-12 col-xl-7" : "col-lg-8"}>
          <h4 className="fw-bold mb-4 border-bottom pb-2">Tu Catálogo Público ({myBooks.length})</h4>
          {myBooks.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
              <i className="bi bi-shop-window display-1 text-muted mb-3 d-block"></i>
              <h4 className="text-muted fw-bold">Tu tienda está vacía</h4>
              <p>Rellena el formulario para publicar tu primer libro.</p>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
              {myBooks.map((book) => (
                <div className="col" key={book.id}>
                  <BookCard book={book} onEdit={handleEdit} onDelete={handleDelete} isLocal={true} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  );

  if (isEmbedded) {
    return (
      <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 border-bottom pb-3 gap-3">
          <h3 className="fw-bold mb-0"><i className="bi bi-shop-window text-magenta me-2"></i>Publicar y Administrar</h3>
        </div>
        {content}
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center mb-5">
        <div className="col-md-8 text-center">
          <h2 className="fw-bold mb-3"><i className="bi bi-shop text-magenta me-2"></i>Gestión de Publicaciones</h2>
          <p className="text-muted">Publica tus libros físicos o E-Books en el marketplace global.</p>
        </div>
      </div>
      {content}
    </div>
  );
};

export default MyBooks;
