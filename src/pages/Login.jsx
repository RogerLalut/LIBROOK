import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirección inteligente si ya está logueado
  useEffect(() => {
    if (user) {
      navigate('/search');
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    
    const success = login(email, password);
    if (success) {
      toast.success("¡Bienvenido a LIBROOK!");
      navigate('/search');
    } else {
      toast.error("Credenciales incorrectas o usuario no registrado.");
    }
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
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Correo Electrónico</label>
                  <input 
                    type="email" 
                    className="form-control py-2 bg-light" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Contraseña</label>
                  <input 
                    type="password" 
                    className="form-control py-2 bg-light" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-magenta py-3 fw-bold rounded-pill fs-5">
                    Entrar
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
