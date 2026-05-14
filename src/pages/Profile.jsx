import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FavoritesContext } from '../context/FavoritesContext';
import { useBooks } from '../hooks/useBooks';
import toast from 'react-hot-toast';
import BookCard from '../components/BookCard';

const Profile = () => {
  const { user, updateProfile, logout } = useContext(AuthContext);
  const { purchaseHistory, rentalHistory } = useContext(CartContext);
  const { favorites } = useContext(FavoritesContext);
  const { myBooks } = useBooks();
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'perfil';
  
  const [activeTab, setActiveTab] = useState(initialTab);

  // Estados para el formulario de Configuración
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: '',
    password: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
        password: user.password || ''
      });
    }
  }, [user, navigate]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/profile?tab=${tab}`);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(editForm);
  };

  if (!user) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'perfil':
        return (
          <div className="bg-white p-5 rounded-4 shadow-sm border border-light">
            <div className="row align-items-center mb-5">
              <div className="col-md-3 text-center mb-4 mb-md-0">
                <img src={user.avatar} alt="Mi Avatar" className="rounded-circle shadow-lg border border-4 border-white" style={{ width: '150px', height: '150px', backgroundColor: '#f8f9fa' }} />
              </div>
              <div className="col-md-9 text-center text-md-start">
                <h1 className="fw-bold display-5 mb-1">{user.name}</h1>
                <p className="text-muted fs-5 mb-3"><i className="bi bi-envelope me-2"></i>{user.email}</p>
                <p className="lead text-secondary">{user.bio}</p>
                <button className="btn btn-outline-magenta rounded-pill px-4 mt-2" onClick={() => handleTabChange('configuracion')}>
                  <i className="bi bi-pencil-square me-2"></i>Editar Perfil
                </button>
              </div>
            </div>
            
            <div className="row g-4 text-center">
              <div className="col-6 col-md-3">
                <div className="p-4 bg-light rounded-4 border">
                  <h2 className="fw-bold text-magenta mb-0">{purchaseHistory.length}</h2>
                  <p className="text-muted small mb-0 text-uppercase fw-semibold">Compras</p>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-4 bg-light rounded-4 border">
                  <h2 className="fw-bold text-warning mb-0">{rentalHistory.length}</h2>
                  <p className="text-muted small mb-0 text-uppercase fw-semibold">Arriendos</p>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-4 bg-light rounded-4 border">
                  <h2 className="fw-bold text-danger mb-0">{favorites.length}</h2>
                  <p className="text-muted small mb-0 text-uppercase fw-semibold">Deseos</p>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-4 bg-light rounded-4 border">
                  <h2 className="fw-bold text-info mb-0">{myBooks.length}</h2>
                  <p className="text-muted small mb-0 text-uppercase fw-semibold">Publicaciones</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'compras':
        return (
          <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light">
            <h3 className="fw-bold mb-4 border-bottom pb-3"><i className="bi bi-bag-check text-magenta me-2"></i>Mi Historial de Compras</h3>
            {purchaseHistory.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-bag-x display-1 text-muted mb-3 d-block"></i>
                <h5 className="text-muted fw-bold">No has comprado ningún libro</h5>
                <p className="text-secondary">Explora el catálogo y encuentra tu próxima lectura.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Libro</th>
                      <th>Fecha</th>
                      <th>Estado / Formato</th>
                      <th>Precio Final</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseHistory.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img src={item.coverUrl} alt="cover" className="rounded me-3 shadow-sm" style={{ width: '40px', height: '60px', objectFit: 'cover' }} />
                            <span className="fw-semibold text-truncate" style={{maxWidth: '200px'}}>{item.title}</span>
                          </div>
                        </td>
                        <td className="text-muted">{item.transactionDate}</td>
                        <td>
                          {item.ebookData?.isEbook ? (
                            <span className="badge bg-dark">E-Book</span>
                          ) : (
                            <span className={`badge ${item.condition === 'nuevo' ? 'bg-primary' : 'bg-secondary'}`}>Físico {item.condition}</span>
                          )}
                        </td>
                        <td className="fw-bold text-magenta">${item.finalPrice.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      case 'arriendos':
        return (
          <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light">
            <h3 className="fw-bold mb-4 border-bottom pb-3"><i className="bi bi-calendar-check text-warning me-2"></i>Mis Arriendos Activos</h3>
            {rentalHistory.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-calendar-x display-1 text-muted mb-3 d-block"></i>
                <h5 className="text-muted fw-bold">No tienes libros en arriendo</h5>
                <p className="text-secondary">Arrienda un libro físico por 1 o 2 semanas.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Libro</th>
                      <th>Fecha de Arriendo</th>
                      <th>Duración</th>
                      <th>Precio Pagado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rentalHistory.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img src={item.coverUrl} alt="cover" className="rounded me-3 shadow-sm" style={{ width: '40px', height: '60px', objectFit: 'cover' }} />
                            <span className="fw-semibold text-truncate" style={{maxWidth: '200px'}}>{item.title}</span>
                          </div>
                        </td>
                        <td className="text-muted">{item.transactionDate}</td>
                        <td><span className="badge bg-warning text-dark">{item.typeLabel}</span></td>
                        <td className="fw-bold text-magenta">${item.finalPrice.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      case 'configuracion':
        return (
          <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light">
            <h3 className="fw-bold mb-4 border-bottom pb-3"><i className="bi bi-gear text-dark me-2"></i>Configuración del Perfil</h3>
            
            <form onSubmit={handleSaveProfile} className="row g-4">
              <div className="col-12 mb-3 text-center">
                <img src={editForm.avatar} alt="Preview Avatar" className="rounded-circle shadow-sm border mb-3" style={{ width: '100px', height: '100px', backgroundColor: '#f8f9fa' }} />
                <p className="text-muted small">El avatar se genera automáticamente basado en tu nombre.</p>
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-bold">Nombre de Usuario</label>
                <input type="text" className="form-control bg-light" name="name" value={editForm.name} onChange={handleEditChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Correo Electrónico</label>
                <input type="email" className="form-control bg-light" name="email" value={editForm.email} onChange={handleEditChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Contraseña (Simulada)</label>
                <input type="password" className="form-control bg-light" name="password" value={editForm.password} onChange={handleEditChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">URL de Avatar Personalizado (Opcional)</label>
                <input type="url" className="form-control bg-light" name="avatar" placeholder="Dejar vacío para usar Avatar Automático" value={editForm.avatar.includes('dicebear') ? '' : editForm.avatar} onChange={handleEditChange} />
              </div>
              
              <div className="col-12">
                <label className="form-label fw-bold">Biografía Corta</label>
                <textarea className="form-control bg-light" name="bio" rows="3" value={editForm.bio} onChange={handleEditChange} placeholder="Cuéntanos un poco sobre ti y tus gustos literarios..."></textarea>
              </div>
              
              <div className="col-12">
                <label className="form-label fw-bold mb-3">Preferencias de Lectura</label>
                <div className="d-flex flex-wrap gap-3">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="pref-fan" defaultChecked />
                    <label className="form-check-label" htmlFor="pref-fan">Fantasía</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="pref-sci" defaultChecked />
                    <label className="form-check-label" htmlFor="pref-sci">Ciencia Ficción</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="pref-rom" />
                    <label className="form-check-label" htmlFor="pref-rom">Romance</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="pref-his" />
                    <label className="form-check-label" htmlFor="pref-his">Historia</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="pref-dig" defaultChecked />
                    <label className="form-check-label" htmlFor="pref-dig">E-Books</label>
                  </div>
                </div>
              </div>
              
              <div className="col-12 mt-4 pt-3 border-top">
                <button type="submit" className="btn btn-magenta px-5 py-2 rounded-pill fw-bold fs-5">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* Sidebar */}
        <div className="col-lg-3">
          <div className="card shadow-sm border-0 rounded-4 sticky-top" style={{top: '100px'}}>
            <div className="card-body p-0">
              <div className="list-group list-group-flush rounded-4">
                <button 
                  className={`list-group-item list-group-item-action py-3 px-4 border-0 rounded-top-4 fw-semibold ${activeTab === 'perfil' ? 'active bg-magenta text-white' : 'text-dark'}`} 
                  onClick={() => handleTabChange('perfil')}
                >
                  <i className="bi bi-person-fill me-2"></i> Mi Perfil
                </button>
                <button 
                  className={`list-group-item list-group-item-action py-3 px-4 border-0 fw-semibold ${activeTab === 'compras' ? 'active bg-magenta text-white' : 'text-dark'}`} 
                  onClick={() => handleTabChange('compras')}
                >
                  <i className="bi bi-bag-check-fill me-2"></i> Mis Compras
                </button>
                <button 
                  className={`list-group-item list-group-item-action py-3 px-4 border-0 fw-semibold ${activeTab === 'arriendos' ? 'active bg-magenta text-white' : 'text-dark'}`} 
                  onClick={() => handleTabChange('arriendos')}
                >
                  <i className="bi bi-calendar-check-fill me-2"></i> Mis Arriendos
                </button>
                <button 
                  className={`list-group-item list-group-item-action py-3 px-4 border-0 fw-semibold ${activeTab === 'configuracion' ? 'active bg-magenta text-white' : 'text-dark'}`} 
                  onClick={() => handleTabChange('configuracion')}
                >
                  <i className="bi bi-gear-fill me-2"></i> Configuración
                </button>
                <button 
                  className="list-group-item list-group-item-action py-3 px-4 border-0 rounded-bottom-4 fw-semibold text-danger" 
                  onClick={() => {
                    logout();
                    toast.success("Has cerrado sesión");
                    navigate('/login');
                  }}
                >
                  <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-lg-9">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;
