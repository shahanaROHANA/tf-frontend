import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { validateToken, getCurrentUser, logout } from './utils/authUtils';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Partners from './components/Partners';
import Login from './components/Login';
import Register from './components/Register';
import StationMenu from './components/StationMenu';
import StationSearch from './components/StationSearch';
import SimpleStationSearch from './components/SimpleStationSearch';
import Cart from './components/Cart';
import AdminDashboard from './components/AdminDashboard';
import SellerDashboard from './components/SellerDashboard';
import SellerLogin from './components/SellerLogin';
import DeliveryLogin from './components/DeliveryLogin';
import DeliveryDashboard from './components/DeliveryDashboard';
import OrderTracking from './components/OrderTracking';
import TrainSchedule from './components/TrainSchedule';
import PaymentPage from './components/PaymentPage'; // The component we created earlier

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [seller, setSeller] = useState(null);

  useEffect(() => {
    // Validate token and user on app load
    const initAuth = async () => {
      const validation = await validateToken();
      
      if (validation.isValid) {
        setUser(validation.user);
      } else {
        // Clear invalid auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    };

    initAuth();
    
    // Removed automatic seller authentication - sellers must login every time

    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userParam = urlParams.get('user');
    const oauth = urlParams.get('oauth');

    if (token && userParam && oauth === 'google') {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);

        // Redirect to products page
        window.location.href = '/products';
      } catch (error) {
        console.error('Error parsing OAuth data:', error);
      }
    }

    // Removed automatic seller state restoration - sellers must login fresh each time
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    
    // If user is a seller, also set the seller state for dashboard access
    if (userData.role === 'seller') {
      setSeller(userData);
    }
  };

  const handleRegister = (userData) => {
    setUser(userData);
  };

  const handleSellerLogin = (sellerData, token) => {
    setSeller(sellerData);
    // Note: Not storing in localStorage - sellers must login fresh each time
  };

  const handleLogout = () => {
    setUser(null);
    setSeller(null);
    logout(); // Clear all auth data
  };

  const handleCheckout = (totalAmount) => {
    alert(`Checkout functionality would be implemented here. Total: ₹${totalAmount.toFixed(2)}`);
    // In a real app, this would navigate to a payment page
  };

  return (
    <Router>
      <div className="app">
        <Navigation user={user} seller={seller} onLogout={handleLogout} />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/seller" element={<SellerDashboard seller={seller} user={user} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/seller-login" element={<SellerLogin onSellerLogin={handleSellerLogin} />} />
            <Route path="/register" element={<Register onRegister={handleRegister} />} />
            <Route path="/station-search" element={<SimpleStationSearch />} />
            <Route path="/products" element={<StationMenu onAddToCart={() => {}} />} />
            <Route path="/cart" element={<Cart onCheckout={handleCheckout} />} />
            <Route path="/orders" element={user ? <OrderTracking /> : <Navigate to="/login" replace />} />
            <Route path="/orders/:id" element={user ? <OrderTracking /> : <Navigate to="/login" replace />} />
            <Route path="/orders/:id/tracking" element={user ? <TrainSchedule /> : <Navigate to="/login" replace />} />
            <Route path="/vendors" element={<Partners />} />
            <Route path="/about" element={<Home />} />
            <Route path="/contact" element={<Home />} />
            <Route path="/payment" element={<PaymentPage />} />






            <Route 
              path="/admin/*" 
              element={
                user?.role === 'admin' ? 
                <AdminDashboard user={user} onLogout={handleLogout} /> : 
                <Navigate to="/login" replace />
              } 
            />

            <Route 
              path="/delivery/login" 
              element={<DeliveryLogin />} 
            />
            <Route 
              path="/delivery/dashboard" 
              element={
                user?.role === 'deliveryAgent' || localStorage.getItem('deliveryToken') ? 
                <DeliveryDashboard /> : 
                <Navigate to="/delivery/login" replace />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
