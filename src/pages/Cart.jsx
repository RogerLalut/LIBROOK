import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, checkoutAll } = useContext(CartContext);

  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.finalPrice * item.quantity), 0);
  };

  const handleUnifiedCheckout = () => {
    checkoutAll();
    setCheckoutSuccess(true);
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-5 text-dark"><i className="bi bi-cart3 text-magenta me-2"></i> Carrito General</h2>
      
      {checkoutSuccess ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm border fade-in-up">
          <i className="bi bi-check-circle-fill display-1 text-success mb-3 d-block"></i>
          <h3 className="text-success fw-bold">¡Pago Procesado con Éxito!</h3>
          <p className="text-secondary fs-5">Tu transacción se completó correctamente.</p>
          <button className="btn btn-magenta mt-3 rounded-pill px-4 fw-bold" onClick={() => setCheckoutSuccess(false)}>
            Seguir Explorando
          </button>
        </div>
      ) : cart.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
          <i className="bi bi-cart-x display-1 text-muted mb-3 d-block"></i>
          <h4 className="text-muted fw-bold">Tu carrito está vacío</h4>
          <p className="text-secondary">Agrega libros para comprar o arrendar.</p>
          <Link to="/search" className="btn btn-magenta mt-3 rounded-pill px-4 fw-bold">Explorar Catálogo</Link>
        </div>
      ) : (
        <div className="row g-5">
          {/* SECCIÓN LISTADO GENERAL */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 bg-white">
              <div className="card-body p-4 p-md-5">
                {cart.map((item, index) => (
                  <div key={`${item.id || item.key}-${item.type}`} className={`d-flex align-items-center ${index !== cart.length - 1 ? 'border-bottom pb-4 mb-4' : ''}`}>
                    <img src={item.coverUrl} alt={item.title} className="rounded shadow-sm" style={{ width: '80px', height: '120px', objectFit: 'cover' }} />
                    <div className="ms-4 flex-grow-1">
                      <h5 className="fw-bold mb-1 text-dark text-truncate" style={{maxWidth: '350px'}} title={item.title}>{item.title}</h5>
                      <p className="text-muted small mb-2">{item.author}</p>
                      
                      <div className="d-flex gap-2 mb-2">
                        <span className={`badge ${item.condition === 'new' ? 'bg-primary' : 'bg-secondary'}`}>
                          {item.condition === 'new' ? 'Libro Nuevo' : 'Libro Usado'}
                        </span>
                        <span className={`badge ${item.type === 'buy' ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {item.typeLabel}
                        </span>
                      </div>
                      
                      <p className="text-magenta fw-bold mt-2 mb-0 fs-5">${item.finalPrice.toLocaleString()} <span className="text-muted small fs-6">x {item.quantity}</span></p>
                    </div>
                    <button className="btn btn-outline-danger rounded-circle ms-3" style={{width: '40px', height: '40px'}} onClick={() => removeFromCart(item.id || item.key, item.type)} title="Eliminar">
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RESUMEN DE PAGO */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 bg-white sticky-top" style={{top: '100px'}}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4 border-bottom pb-3">Resumen del Pedido</h5>
                
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Ítems ({cart.reduce((acc, item) => acc + item.quantity, 0)})</span>
                  <span className="fw-semibold">${calculateTotal(cart).toLocaleString()}</span>
                </div>
                
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Desglosado:</span>
                </div>
                <div className="d-flex justify-content-between mb-2 small ps-3">
                  <span className="text-muted"><i className="bi bi-bag me-1 text-success"></i> Compras</span>
                  <span className="fw-semibold">${calculateTotal(cart.filter(i => i.type === 'buy')).toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-4 small ps-3">
                  <span className="text-muted"><i className="bi bi-calendar-check me-1 text-warning"></i> Arriendos</span>
                  <span className="fw-semibold">${calculateTotal(cart.filter(i => i.type.startsWith('rent'))).toLocaleString()}</span>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Envío</span>
                  <span className="text-success fw-semibold">Gratis</span>
                </div>
                
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <span className="fw-bold fs-4">Total</span>
                  <span className="fw-bold fs-4 text-magenta">${calculateTotal(cart).toLocaleString()}</span>
                </div>
                
                <button className="btn btn-magenta w-100 rounded-pill fw-bold py-3 fs-5" onClick={handleUnifiedCheckout}>
                  Confirmar y Pagar Todo
                </button>
              </div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default Cart;
