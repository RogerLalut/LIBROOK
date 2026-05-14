import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { isValidEmail } from '../utils/security';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/search');
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!isValidEmail(email)) newErrors.email = "Correo electrónico inválido.";
    if (!password.trim()) newErrors.password = "La contraseña es obligatoria.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    
    setTimeout(() => {
      const success = login(email, password);
      setLoading(false);
      
      if (success) {
        toast.success("¡Bienvenido a LIBROOK!");
        navigate('/search');
      } else {
        toast.error("Credenciales incorrectas o usuario no registrado.");
        setErrors({ email: " ", password: "Credenciales inválidas." });
      }
    }, 600);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <i className="bi bi-person-circle display-4 text-magenta mb-3 d-block"></i>
                <h3 className="fw-bold">Iniciar Sesión</h3>
                <p className="text-muted">Ingresa a tu cuenta de LIBROOK</p>
              </div>
              
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Correo Electrónico</label>
                  <input 
                    type="email" 
                    className={`form-control py-2 bg-light ${errors.email ? 'is-invalid' : ''}`} 
                    value={email} 
                    onChange={(e) => { setEmail(e.target.value); setErrors({...errors, email: null}); }} 
                  />
                  {errors.email && <div className="invalid-feedback fw-semibold">{errors.email}</div>}
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Contraseña</label>
                  <input 
                    type="password" 
                    className={`form-control py-2 bg-light ${errors.password ? 'is-invalid' : ''}`} 
                    value={password} 
                    onChange={(e) => { setPassword(e.target.value); setErrors({...errors, password: null}); }} 
                  />
                  {errors.password && <div className="invalid-feedback fw-semibold">{errors.password}</div>}
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-magenta py-3 fw-bold rounded-pill fs-5" disabled={loading}>
                    {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Entrando...</> : "Entrar"}
                  </button>
                </div>
              </form>
              
              <div className="text-center mt-4 pt-3 border-top">
                <p className="text-muted mb-0">
                  ¿No tienes una cuenta? <Link to="/register" className="text-magenta text-decoration-none fw-bold">Regístrate</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
