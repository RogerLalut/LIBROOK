import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [stockMap, setStockMap] = useState({});
  const [pricesMap, setPricesMap] = useState({});
  const [conditionMap, setConditionMap] = useState({});
  const [ebookMap, setEbookMap] = useState({}); // { isEbook, format, size }
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [rentalHistory, setRentalHistory] = useState([]);
  const [sellerHistory, setSellerHistory] = useState([]);
  
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const storedCart = localStorage.getItem('librook_cart');
    const storedStock = localStorage.getItem('librook_stock');
    const storedPrices = localStorage.getItem('librook_prices');
    const storedConditions = localStorage.getItem('librook_conditions');
    const storedEbooks = localStorage.getItem('librook_ebooks');
    const storedSales = localStorage.getItem('librook_seller_history');
    
    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedStock) setStockMap(JSON.parse(storedStock));
    if (storedPrices) setPricesMap(JSON.parse(storedPrices));
    if (storedConditions) setConditionMap(JSON.parse(storedConditions));
    if (storedEbooks) setEbookMap(JSON.parse(storedEbooks));
    if (storedSales) setSellerHistory(JSON.parse(storedSales));
  }, []);

  useEffect(() => {
    if (user) {
      const historyStr = localStorage.getItem(`librook_history_${user.email}`);
      if (historyStr) {
        const data = JSON.parse(historyStr);
        setPurchaseHistory(data.purchases || []);
        setRentalHistory(data.rentals || []);
      } else {
        setPurchaseHistory([]);
        setRentalHistory([]);
      }
    }
  }, [user]);

  useEffect(() => { localStorage.setItem('librook_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('librook_stock', JSON.stringify(stockMap)); }, [stockMap]);
  useEffect(() => { localStorage.setItem('librook_prices', JSON.stringify(pricesMap)); }, [pricesMap]);
  useEffect(() => { localStorage.setItem('librook_conditions', JSON.stringify(conditionMap)); }, [conditionMap]);
  useEffect(() => { localStorage.setItem('librook_ebooks', JSON.stringify(ebookMap)); }, [ebookMap]);
  useEffect(() => { localStorage.setItem('librook_seller_history', JSON.stringify(sellerHistory)); }, [sellerHistory]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`librook_history_${user.email}`, JSON.stringify({
        purchases: purchaseHistory,
        rentals: rentalHistory
      }));
    }
  }, [purchaseHistory, rentalHistory, user]);

  const initializeData = (bookId, isLocal = false, predefinedData = null) => {
    let currentStock = stockMap[bookId];
    let currentBasePrice = pricesMap[bookId];
    let currentCondition = conditionMap[bookId];
    let currentEbook = ebookMap[bookId];
    
    let updated = false;
    let newStockMap = { ...stockMap };
    let newPricesMap = { ...pricesMap };
    let newConditionMap = { ...conditionMap };
    let newEbookMap = { ...ebookMap };

    // Si el libro es local y trae data predefinida del nuevo formulario
    if (isLocal && predefinedData) {
      if (currentCondition !== predefinedData.condition) {
        currentCondition = predefinedData.condition;
        newConditionMap[bookId] = currentCondition;
        updated = true;
      }
      const incomingPrice = predefinedData.basePrice !== undefined ? predefinedData.basePrice : predefinedData.price;
      if (currentBasePrice !== incomingPrice) {
        currentBasePrice = incomingPrice;
        newPricesMap[bookId] = currentBasePrice;
        updated = true;
      }
      if (currentStock !== predefinedData.stock) {
        currentStock = predefinedData.stock;
        newStockMap[bookId] = currentStock;
        updated = true;
      }
      const isDigital = predefinedData.format === 'digital';
      if (!currentEbook || currentEbook.isEbook !== isDigital) {
        currentEbook = isDigital 
          ? { isEbook: true, format: 'PDF', size: (Math.random() * 5 + 1).toFixed(1) + ' MB' }
          : { isEbook: false };
        newEbookMap[bookId] = currentEbook;
        updated = true;
      }
    } else {
      // API Books Initialization
      if (currentCondition === undefined) {
        currentCondition = isLocal ? 'usado' : (Math.random() > 0.5 ? 'nuevo' : 'usado');
        newConditionMap[bookId] = currentCondition;
        updated = true;
      }

      if (currentEbook === undefined) {
        // 30% chance for an API book to be an Ebook
        const isEbook = !isLocal && Math.random() > 0.7;
        const formats = ['EPUB', 'PDF', 'MOBI'];
        currentEbook = isEbook 
          ? { isEbook: true, format: formats[Math.floor(Math.random() * formats.length)], size: (Math.random() * 10 + 2).toFixed(1) + ' MB' }
          : { isEbook: false };
        newEbookMap[bookId] = currentEbook;
        updated = true;
      }

      if (currentStock === undefined) {
        currentStock = currentEbook.isEbook ? 999 : (isLocal ? 1 : Math.floor(Math.random() * 10) + 1);
        newStockMap[bookId] = currentStock;
        updated = true;
      }

      if (currentBasePrice === undefined) {
        if (currentEbook.isEbook) {
          currentBasePrice = Math.floor(Math.random() * 4000) + 2000; // Ebooks are cheaper
        } else if (currentCondition === 'usado') {
          currentBasePrice = Math.floor(Math.random() * 7000) + 5000; 
        } else {
          currentBasePrice = Math.floor(Math.random() * 15000) + 15000;
        }
        newPricesMap[bookId] = currentBasePrice;
        updated = true;
      }
    }

    if (updated) {
      setStockMap(newStockMap);
      setPricesMap(newPricesMap);
      setConditionMap(newConditionMap);
      setEbookMap(newEbookMap);
    }
    
    return { stock: currentStock, basePrice: currentBasePrice, condition: currentCondition, ebook: currentEbook };
  };

  const getBookData = useCallback((bookId, isLocal, predefinedData = null) => {
    return initializeData(bookId, isLocal, predefinedData);
  }, [stockMap, pricesMap, conditionMap, ebookMap]);

  const addToCart = (book, type) => {
    if (!user) {
      toast.error("Debes iniciar sesión para realizar esta acción.");
      return;
    }
    
    const bookId = book.id || book.key;
    const { stock, basePrice, condition, ebook } = getBookData(bookId, book.isLocal, book.isLocal ? book : null);
    
    if (ebook.isEbook && type !== 'buy') {
      toast.error("Los libros digitales solo están disponibles para compra.");
      return;
    }

    let finalPrice = basePrice;
    let typeLabel = "Compra";
    if (type === 'rent-1') {
        finalPrice = Math.round(basePrice * 0.2); 
        typeLabel = "Arriendo (1 Sem)";
    } else if (type === 'rent-2') {
        finalPrice = Math.round(basePrice * 0.35); 
        typeLabel = "Arriendo (2 Sem)";
    }

    const totalQuantityInCart = cart.filter(item => (item.id || item.key) === bookId)
                                     .reduce((sum, item) => sum + item.quantity, 0);

    if (!ebook.isEbook && totalQuantityInCart >= stock) {
      toast.error("No hay más stock disponible de este libro.");
      return;
    }

    const existingItemIndex = cart.findIndex(item => (item.id || item.key) === bookId && item.type === type);

    if (existingItemIndex >= 0) {
      const newCart = [...cart];
      newCart[existingItemIndex].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, { ...book, quantity: 1, type, typeLabel, finalPrice, condition, ebook }]);
    }
    
    if (type.startsWith('rent')) {
      toast.success("Libro agregado a arriendos");
    } else {
      toast.success(ebook.isEbook ? "E-Book agregado al carrito" : "Libro agregado al carrito");
    }
  };

  const removeFromCart = (bookId, type) => {
    setCart(cart.filter(item => !((item.id || item.key) === bookId && item.type === type)));
    toast.success("Eliminado correctamente");
  };

  const checkout = (checkoutType) => {
    const itemsToCheckout = cart.filter(item => 
      checkoutType === 'buy' ? item.type === 'buy' : item.type.startsWith('rent')
    );
    
    if (itemsToCheckout.length === 0) return;
    
    const newStockMap = { ...stockMap };
    let success = true;
    
    const neededStock = {};
    itemsToCheckout.forEach(item => {
        const id = item.id || item.key;
        neededStock[id] = (neededStock[id] || 0) + item.quantity;
    });

    for (const id in neededStock) {
        // Ebooks have 999 stock implicitly, but we also let them bypass just in case
        const currentEbook = ebookMap[id];
        if (currentEbook && currentEbook.isEbook) continue; 

        if (newStockMap[id] >= neededStock[id]) {
            newStockMap[id] -= neededStock[id];
        } else {
            success = false;
        }
    }

    if (success) {
      setStockMap(newStockMap);
      
      const newPurchases = [];
      const newRentals = [];
      const date = new Date().toLocaleDateString();

      itemsToCheckout.forEach(item => {
        const historyItem = { ...item, transactionDate: date };
        if (item.type === 'buy') {
          newPurchases.push(historyItem);
        } else {
          const returnD = new Date();
          const weeks = item.type === 'rent-1' ? 1 : 2;
          returnD.setDate(returnD.getDate() + (weeks * 7));
          
          newRentals.push({
            ...historyItem,
            returnDate: returnD.toLocaleDateString()
          });
        }
      });

      if (checkoutType === 'buy') {
        setPurchaseHistory([...purchaseHistory, ...newPurchases]);
        toast.success("¡Compra completada con éxito!");
      } else {
        setRentalHistory([...rentalHistory, ...newRentals]);
        toast.success("¡Arriendo confirmado con éxito!");
      }

      // Track sales for the seller (books that are isLocal)
      const newSales = itemsToCheckout.filter(item => item.isLocal).map(item => ({
        ...item,
        transactionDate: date,
        saleType: checkoutType === 'buy' ? 'Venta' : 'Arriendo',
        revenue: item.finalPrice * item.quantity
      }));
      
      if (newSales.length > 0) {
        setSellerHistory([...sellerHistory, ...newSales]);
      }
      
      setCart(cart.filter(item => 
        checkoutType === 'buy' ? item.type !== 'buy' : !item.type.startsWith('rent')
      ));
    } else {
      toast.error("Hubo un problema de stock con algunos productos.");
    }
  };

  const checkoutAll = () => {
    if (cart.length === 0) return;
    
    const newStockMap = { ...stockMap };
    let success = true;
    
    const neededStock = {};
    cart.forEach(item => {
        const id = item.id || item.key;
        neededStock[id] = (neededStock[id] || 0) + item.quantity;
    });

    for (const id in neededStock) {
        const currentEbook = ebookMap[id];
        if (currentEbook && currentEbook.isEbook) continue; 

        if (newStockMap[id] >= neededStock[id]) {
            newStockMap[id] -= neededStock[id];
        } else {
            success = false;
        }
    }

    if (success) {
      setStockMap(newStockMap);
      
      const newPurchases = [];
      const newRentals = [];
      const newSales = [];
      const date = new Date().toLocaleDateString();

      cart.forEach(item => {
        const historyItem = { ...item, transactionDate: date };
        if (item.type === 'buy') {
          newPurchases.push(historyItem);
        } else {
          const returnD = new Date();
          const weeks = item.type === 'rent-1' ? 1 : 2;
          returnD.setDate(returnD.getDate() + (weeks * 7));
          
          newRentals.push({
            ...historyItem,
            returnDate: returnD.toLocaleDateString()
          });
        }

        if (item.isLocal) {
          newSales.push({
            ...item,
            transactionDate: date,
            saleType: item.type === 'buy' ? 'Venta' : 'Arriendo',
            revenue: item.finalPrice * item.quantity
          });
        }
      });

      setPurchaseHistory(prev => [...prev, ...newPurchases]);
      setRentalHistory(prev => [...prev, ...newRentals]);
      setSellerHistory(prev => [...prev, ...newSales]);
      
      setCart([]);
      toast.success("¡Pago procesado exitosamente! Pedido completado.");
    } else {
      toast.error("Hubo un problema de stock con algunos productos.");
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      checkout,
      checkoutAll,
      getBookData,
      purchaseHistory,
      rentalHistory,
      sellerHistory
    }}>
      {children}
    </CartContext.Provider>
  );
};
