import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './components/Home'
import ModelCatalog from './components/ModelCatalog'
import BookingForm from './components/BookingForm'
import Confirmation from './components/Confirmation'
import AdminPanel from './components/AdminPanel'
import ProductDetails from './components/ProductDetails'
import StoreLocator from './components/StoreLocator'
import WhatsAppWidget from './components/WhatsAppWidget'
import Footer from './components/Footer'
import './styles/index.css'



function App() {
  const [cart, setCart] = useState([]);

  // Persist cart to simple storage so refresh doesn't lose it (optional but nice)
  useEffect(() => {
    const saved = localStorage.getItem('unitder_cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('unitder_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(p => p.firebaseId === product.firebaseId);
      if (existing) {
        // Don't add more than stock
        if (existing.quantity >= product.stock) {
          alert("Cannot add more than available stock!");
          return prev;
        }
        return prev.map(p => p.firebaseId === product.firebaseId ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, change) => {
    setCart(prev => prev.map(item => {
      if (item.firebaseId === id) {
        const newQty = item.quantity + change;
        if (newQty < 1) return item;
        // Ideally we check stock limit here too, strictly
        if (change > 0 && newQty > item.stock) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.firebaseId !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <WhatsAppWidget />

        <Header cartCount={cart.reduce((a, b) => a + b.quantity, 0)} />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} cart={cart} />} />
            <Route path="/catalog" element={<ModelCatalog addToCart={addToCart} cart={cart} />} />
            <Route path="/booking" element={
              <BookingForm
                cart={cart}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
              />
            } />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} cart={cart} />} />
            <Route path="/stores" element={<StoreLocator />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
