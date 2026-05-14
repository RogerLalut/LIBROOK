import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { sanitizeInput, isValidEmail } from '../utils/security';
import toast from 'react-hot-toast';

const AVATAR_STYLES = ['adventurer', 'bottts', 'pixel-art', 'fun-emoji', 'avataaars'];

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [selectedAvatarStyle, setSelectedAvatarStyle] = useState('adventurer');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register, user, getDiceBearAvatar } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/search');
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const safeName = sanitizeInput(formData.name);
    
    if (!safeName.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!isValidEmail(formData.email)) newErrors.email = "Correo electrónico inválido.";
    if (formData.password.length < 6) newErrors.password = "La contraseña debe tener mínimo 6 caracteres.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generatedAvatars = useMemo(() => {
    const safeName = sanitizeInput(formData.name) || 'Guest';
    return AVATAR_STYLES.map(style => ({
      style,
      url: getDiceBearAvatar(safeName, style)
    }));
  }, [formData.name, getDiceBearAvatar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    
    setTimeout(() => {
      const safeName = sanitizeInput(formData.name);
      const chosenAvatarUrl = generatedAvatars.find(a => a.style === selectedAvatarStyle)?.url;
      
      const success = register(safeName, formData.email, formData.password, chosenAvatarUrl);
      
      setLoading(false);
      
      if (success) {
        toast.success("¡Cuenta creada exitosamente!");
        navigate('/search');
      } else {
        toast.error("El correo ya está registrado.");
        setErrors({ ...errors, email: "Este correo ya está en uso." });
      }
    }, 800);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <i className="bi bi-person-plus-fill display-4 text-magenta mb-3 d-block"></i>
                <h3 className="fw-bold">Crear Cuenta</h3>
                <p className="text-muted">Únete a la comunidad LIBROOK</p>
              </div>
              
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Nombre Completo</label>
                  <input 
                    type="text" 
                    className={`form-control py-2 bg-light ${errors.name ? 'is-invalid' : ''}`} 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                  />
                  {errors.name && <div className="invalid-feedback fw-semibold">{errors.name}</div>}
                </div>
                
                <div className="mb-4">
                  <label className="form-label fw-semibold">Elige tu Avatar Dinámico</label>
                  <div className="d-flex flex-wrap justify-content-center gap-3 bg-light p-3 rounded-4 border">
                    {generatedAvatars.map(({ style, url }) => (
                      <div 
                        key={style}
                        className={`cursor-pointer rounded-circle overflow-hidden border border-4 transition-all ${selectedAvatarStyle === style ? 'border-magenta shadow-lg scale-110' : 'border-white opacity-75'}`}
                        style={{ width: '60px', height: '60px' }}
                        onClick={() => setSelectedAvatarStyle(style)}
                        title={`Estilo: ${style}`}
                      >
                        <img src={url} alt={style} className="w-100 h-100 object-fit-cover bg-white" />
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-muted small mt-2">¡Escribe tu nombre y verás cómo cobran vida!</p>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Correo Electrónico</label>
                  <input 
                    type="email" 
                    className={`form-control py-2 bg-light ${errors.email ? 'is-invalid' : ''}`} 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                  />
                  {errors.email && <div className="invalid-feedback fw-semibold">{errors.email}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Contraseña</label>
                  <input 
                    type="password" 
                    minLength="6"
                    className={`form-control py-2 bg-light ${errors.password ? 'is-invalid' : ''}`} 
                    name="password" 
                    value={formData.password} 
                    onChange={handleInputChange} 
                  />
                  {errors.password && <div className="invalid-feedback fw-semibold">{errors.password}</div>}
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Confirmar Contraseña</label>
                  <input 
                    type="password" 
                    minLength="6"
                    className={`form-control py-2 bg-light ${errors.confirmPassword ? 'is-invalid' : ''}`} 
                    name="confirmPassword" 
                    value={formData.confirmPassword} 
                    onChange={handleInputChange} 
                  />
                  {errors.confirmPassword && <div className="invalid-feedback fw-semibold">{errors.confirmPassword}</div>}
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-magenta py-3 fw-bold rounded-pill fs-5" disabled={loading}>
                    {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Registrando...</> : "Registrarse"}
                  </button>
                </div>
              </form>
              
              <div className="text-center mt-4 pt-3 border-top">
                <p className="text-muted mb-0">
                  ¿Ya tienes una cuenta? <Link to="/login" className="text-magenta text-decoration-none fw-bold">Inicia Sesión</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx="true">{`
        .scale-110 { transform: scale(1.15); }
        .transition-all { transition: all 0.2s ease-in-out; }
      `}</style>
    </div>
  );
};

export default Register;
