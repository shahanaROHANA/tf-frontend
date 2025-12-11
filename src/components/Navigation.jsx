// import { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import Chatbot from './Chatbot';
// import './Navigation.css';

// const Navigation = ({ user, seller, onLogout }) => {
//   const [cartCount, setCartCount] = useState(0);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isChatbotOpen, setIsChatbotOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     fetchCartCount();
//   }, []);

//   // Close chatbot when navigating to different pages
//   useEffect(() => {
//     setIsChatbotOpen(false);
//   }, [location.pathname]);

//   const fetchCartCount = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.ok) {
//         const cart = await response.json();
//         const count = cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
//         setCartCount(count);
//       }
//     } catch (err) {
//       console.error('Error fetching cart count:', err);
//     }
//   };

//   const handleLogout = () => {
//     const confirmLogout = window.confirm('Are you sure you want to logout?');
//     if (confirmLogout) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       localStorage.removeItem('sellerToken');
//       localStorage.removeItem('seller');
//       localStorage.removeItem('deliveryToken');
//       onLogout();
//       navigate('/');
//     }
//   };

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   return (
//     <nav className="navigation">
//       <div className="nav-container">
//         <div className="nav-brand">
//           <Link to="/" className="brand-link">
//             <div className="logo-icon">🚆</div>
//             <span className="logo-text">FoodZTrain</span>
//           </Link>
//         </div>

//         <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
//           <Link 
//             to="/" 
//             className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
//             onClick={() => setIsMobileMenuOpen(false)}
//           >
//             <span className="nav-icon">🏠</span>
//             <span>Home</span>
//           </Link>
//           <Link 
//             to="/products" 
//             className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`} 
//             onClick={() => setIsMobileMenuOpen(false)}
//           >
//             <span className="nav-icon">🍽️</span>
//             <span>Menu</span>
//           </Link>
//           <Link 
//             to="/station-search" 
//             className={`nav-link ${location.pathname === '/station-search' ? 'active' : ''}`} 
//             onClick={() => setIsMobileMenuOpen(false)}
//           >
//             <span className="nav-icon">🚆</span>
//             <span>Find Stations</span>
//           </Link>
//           <Link 
//             to="/cart" 
//             className={`nav-link cart-link ${location.pathname === '/cart' ? 'active' : ''}`} 
//             onClick={() => setIsMobileMenuOpen(false)}
//           >
//             <span className="nav-icon">🛒</span>
//             <span>Cart</span>
//             {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
//           </Link>
//           {user && (
//             <Link 
//               to="/orders" 
//               className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`} 
//               onClick={() => setIsMobileMenuOpen(false)}
//             >
//               <span className="nav-icon">📦</span>
//               <span>My Orders</span>
//             </Link>
//           )}
//           <Link 
//             to="/vendors" 
//             className={`nav-link ${location.pathname === '/vendors' ? 'active' : ''}`} 
//             onClick={() => setIsMobileMenuOpen(false)}
//           >
//             <span className="nav-icon">🤝</span>
//             <span>Partners</span>
//           </Link>
//           {user?.role === 'admin' && (
//             <Link 
//               to="/admin" 
//               className={`nav-link admin-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`} 
//               onClick={() => setIsMobileMenuOpen(false)}
//             >
//               <span className="nav-icon">🛡️</span>
//               <span>Admin</span>
//             </Link>
//           )}
//           {seller && (
//             <>
//               <Link 
//                 to="/products" 
//                 className={`nav-link seller-link ${location.pathname === '/products' ? 'active' : ''}`} 
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 <span className="nav-icon">🍽️</span>
//                 <span>View Menu</span>
//               </Link>
//               <Link 
//                 to="/seller" 
//                 className={`nav-link seller-link ${location.pathname === '/seller' ? 'active' : ''}`} 
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 <span className="nav-icon">🍱</span>
//                 <span>Dashboard</span>
//               </Link>
//             </>
//           )}
//           {user?.role === 'deliveryAgent' && (
//             <Link 
//               to="/delivery/dashboard" 
//               className={`nav-link delivery-link ${location.pathname === '/delivery/dashboard' ? 'active' : ''}`} 
//               onClick={() => setIsMobileMenuOpen(false)}
//             >
//               <span className="nav-icon">🚚</span>
//               <span>Delivery</span>
//             </Link>
//           )}
//         </div>

//         <div className="nav-actions">
//           {(user || seller) ? (
//             <div className="user-menu">
//               <div className="user-avatar">
//                 <span className="avatar-icon">👤</span>
//                 <span className="user-name">
//                   {user?.name || seller?.restaurantName || 'User'}
//                 </span>
//               </div>
//               <button onClick={handleLogout} className="logout-btn">
//                 <span className="logout-icon">🚪</span>
//                 <span>Logout</span>
//               </button>
//             </div>
//           ) : (
//             <div className="auth-links">
//               <Link 
//                 to="/login" 
//                 className={`auth-link login-link ${location.pathname === '/login' ? 'active' : ''}`} 
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 <span className="auth-icon">🔑</span>
//                 <span>Sign In</span>
//               </Link>
//               <Link 
//                 to="/register" 
//                 className={`auth-link register-link ${location.pathname === '/register' ? 'active' : ''}`} 
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 <span className="auth-icon">✨</span>
//                 <span>Get Started</span>
//               </Link>
//             </div>
//           )}
          
//           <button 
//             className="mobile-menu-toggle" 
//             onClick={toggleMobileMenu}
//             aria-label="Toggle mobile menu"
//           >
//             <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
//               <span className="hamburger-line"></span>
//               <span className="hamburger-line"></span>
//               <span className="hamburger-line"></span>
//             </span>
//           </button>
//         </div>

//         {/* Floating Chatbot Button */}
//         {user && (
//           <button
//             className="chatbot-toggle"
//             onClick={() => setIsChatbotOpen(true)}
//             title="Chat with our assistant"
//           >
//             <span className="chatbot-icon">🤖</span>
//           </button>
//         )}
//       </div>

//       {/* Chatbot Modal */}
//       <Chatbot
//         isOpen={isChatbotOpen}
//         onClose={() => setIsChatbotOpen(false)}
//         user={user}
//         seller={seller}
//       />
//     </nav>
//   );
// };

// export default Navigation;

// import { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import Chatbot from './Chatbot';
// import './Navigation.css';

// const Navigation = ({ user, seller, onLogout }) => {
//   const [cartCount, setCartCount] = useState(0);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isChatbotOpen, setIsChatbotOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     fetchCartCount();
//   }, []);

//   useEffect(() => {
//     setIsChatbotOpen(false);
//   }, [location.pathname]);

//   const fetchCartCount = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.ok) {
//         const cart = await response.json();
//         const count = cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
//         setCartCount(count);
//       }
//     } catch (err) {
//       console.error('Error fetching cart count:', err);
//     }
//   };

//   const handleLogout = () => {
//     if (window.confirm('Are you sure you want to logout?')) {
//       localStorage.clear();
//       onLogout();
//       navigate('/');
//     }
//   };

//   return (
//     <nav className="navigation">
//       <div className="nav-container">

//         {/* Logo */}
//         <div className="nav-left">
//           <Link to="/" className="brand-link">
//             <span className="logo-icon">🚆</span>
//             <span className="logo-text">FoodZTrain</span>
//           </Link>
//         </div>

//         {/* Center Menu */}
//         <div className={`nav-center ${isMobileMenuOpen ? 'active' : ''}`}>
//           <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
//           <Link to="/products" className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Menu</Link>
//           <Link to="/cart" className={`nav-link ${location.pathname === '/cart' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
//             Cart {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
//           </Link>
//           {user && <Link to="/orders" className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>My Orders</Link>}
//           <Link to="/vendors" className={`nav-link ${location.pathname === '/vendors' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Partners</Link>
//         </div>

//         {/* Right: Auth/User */}
//         <div className="nav-right">
//           {(user || seller) ? (
//             <div className="user-menu">
//               <span className="avatar-icon">👤</span>
//               <span className="user-name">{user?.name || seller?.restaurantName}</span>
//               <button onClick={handleLogout} className="logout-btn">Logout</button>
//             </div>
//           ) : (
//             <div className="auth-links">
//               <Link to="/login" className={`auth-link ${location.pathname === '/login' ? 'active' : ''}`}>Login</Link>
//               <Link to="/register" className={`auth-link ${location.pathname === '/register' ? 'active' : ''}`}>Register</Link>
//             </div>
//           )}
//         </div>

//         {/* Hamburger Menu for Mobile */}
//         <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
//           <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
//             <span className="line"></span>
//             <span className="line"></span>
//             <span className="line"></span>
//           </span>
//         </button>

//         {/* Chatbot */}
//         {user && (
//           <button className="chatbot-toggle" onClick={() => setIsChatbotOpen(true)} title="Chat with us">
//             🤖
//           </button>
//         )}

//       </div>

//       {/* Chatbot Modal */}
//       <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} user={user} seller={seller} />
//     </nav>
//   );
// };

// export default Navigation;


import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Chatbot from './Chatbot';
import './Navigation.css';
// import logo from '../src/assets/FoodzTRain.png';


const Navigation = ({ user, seller, onLogout }) => {
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Add scroll effect listener
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchCartCount();
  }, [user]); // Re-fetch when user changes

  useEffect(() => {
    setIsChatbotOpen(false);
    setIsMobileMenuOpen(false); // Close mobile menu on route change
  }, [location.pathname]);

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const cart = await response.json();
        const count = cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
        setCartCount(count);
      }
    } catch (err) {
      console.error('Error fetching cart count:', err);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Set flag to prevent auth interceptor redirects during logout
      localStorage.setItem('loggingOut', 'true');
      
      // Clear all auth data
      onLogout();
      
      // Remove logout flag after a short delay
      setTimeout(() => {
        localStorage.removeItem('loggingOut');
      }, 1000);
      
      // Navigate directly to home page
      navigate('/');
    }
  };

  // Helper for active link class
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          
          {/* Logo */}
          <Link to="/" className="nav-logo">
            
            <img src="../src/assets/Foodz TRain.png" alt="FoodZTrain Logo" className="nav-logo-img" />
            <span className="logo-text"> FoodZTrain</span>
          </Link>

          {/* Desktop Menu */}
          <div className="nav-menu">
            <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
            <Link to="/products" className={`nav-link ${isActive('/products')}`}>Menu</Link>
            <Link to="/vendors" className={`nav-link ${isActive('/vendors')}`}>Partners</Link>
            
            {user && <Link to="/orders" className={`nav-link ${isActive('/orders')}`}>My Orders</Link>}
            
            <Link to="/cart" className={`nav-link cart-link ${isActive('/cart')}`}>
              <span>Cart</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </div>

          {/* Right Side: Auth & Chat */}
          <div className="nav-actions">
            {user && (
              <button 
                className={`chatbot-btn ${isChatbotOpen ? 'active' : ''}`} 
                onClick={() => setIsChatbotOpen(!isChatbotOpen)} 
                title="Chat with AI"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </button>
            )}

            {(user || seller) ? (
              <div className="user-profile">
                <div className="avatar">
                  {user?.name?.charAt(0) || seller?.restaurantName?.charAt(0) || 'U'}
                </div>
                <button onClick={handleLogout} className="logout-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn-login">Login</Link>
                <Link to="/register" className="btn-register">Register</Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button 
              className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`} 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" className="mobile-link">Home</Link>
          <Link to="/products" className="mobile-link">Menu</Link>
          <Link to="/vendors" className="mobile-link">Partners</Link>
          <Link to="/cart" className="mobile-link">
            Cart {cartCount > 0 && <span className="mobile-badge">({cartCount})</span>}
          </Link>
          {user && <Link to="/orders" className="mobile-link">My Orders</Link>}
        </div>
      </nav>

      <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} user={user} seller={seller} />
    </>
  );
};

export default Navigation;