import React from 'react';

const Footer = () => {
  return (
    <footer className="footer-dark text-center mt-auto">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <h4 className="fw-bold text-orange mb-3">
              <i className="bi bi-book-half me-2"></i>LIBROOK
            </h4>
            <p className="text-white-50 mx-auto" style={{ maxWidth: '600px' }}>
              Tu plataforma de confianza para comprar, vender y arrendar los mejores libros.
              Inspirando la lectura y conectando historias.
            </p>
          </div>
        </div>
        <div className="d-flex justify-content-center gap-3 mb-4">
          <a href="#" className="text-white fs-4"><i className="bi bi-facebook"></i></a>
          <a href="#" className="text-white fs-4"><i className="bi bi-twitter-x"></i></a>
          <a href="#" className="text-white fs-4"><i className="bi bi-instagram"></i></a>
        </div>
        <div className="border-top border-secondary pt-3">
          <small className="text-white-50">&copy; {new Date().getFullYear()} LIBROOK. Todos los derechos reservados.</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
