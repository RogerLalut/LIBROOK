import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const { register, user } = useContext(AuthContext); // FIX: Import register
  const navigate = useNavigate();

  // Redirección inteligente si ya está logueado
  useEffect(() => {
    if (user) {
      navigate('/search');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    
    // FIX: Call register instead of login
    const success = register(formData.name, formData.email, formData.password);
    if (success) {
      toast.success("¡Cuenta creada exitosamente!");
      navigate('/search');
    } else {
      toast.error("El correo ya está registrado.");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <i className="bi bi-person-plus-fill display-4 text-magenta mb-3 d-block"></i>
                <h3 className="fw-bold">Crear Cuenta</h3>
                <p className="text-muted">Únete a la comunidad LIBROOK</p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Nombre Completo</label>
                  <input type="text" className="form-control py-2 bg-light" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Correo Electrónico</label>
                  <input type="email" className="form-control py-2 bg-light" name="email" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Contraseña</label>
                  <input type="password" className="form-control py-2 bg-light" name="password" value={formData.password} onChange={handleInputChange} required />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Confirmar Contraseña</label>
                  <input type="password" className="form-control py-2 bg-light" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-magenta py-3 fw-bold rounded-pill fs-5">
                    Registrarse
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
    </div>
  );
};

export default Register;
