// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import './SellerLogin.css';

// const SellerLogin = ({ onSellerLogin }) => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/sellers/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(formData)
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Store seller token and data
//         localStorage.setItem('sellerToken', data.token);
//         localStorage.setItem('seller', JSON.stringify({
//           _id: data.seller._id,
//           name: data.seller.name,
//           email: data.seller.email,
//           restaurantName: data.seller.restaurantName,
//           station: data.seller.station,
//           isApproved: data.seller.isApproved
//         }));
        
//         onSellerLogin(data.seller, data.token);
//       } else {
//         setError(data.message || 'Login failed');
//       }
//     } catch (err) {
//       setError('Network error. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="seller-login">
//       <div className="login-container">
//         <div className="login-card">
//           <div className="login-header">
//             <h1>🍱 Seller Login</h1>
//             <p>Login to manage your restaurant</p>
//           </div>

//           {error && (
//             <div className="error-message">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="login-form">
//             <div className="form-group">
//               <label htmlFor="email">Email Address</label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your email"
//                 className="form-control"
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="password">Password</label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your password"
//                 className="form-control"
//               />
//             </div>

//             <button 
//               type="submit" 
//               className="login-btn"
//               disabled={loading}
//             >
//               {loading ? (
//                 <div className="spinner"></div>
//               ) : (
//                 '🚪 Login to Seller Dashboard'
//               )}
//             </button>
//           </form>

//           <div className="login-footer">
//             <div className="login-links">
//               <Link to="/login" className="customer-login-link">
//                 👤 Customer Login
//               </Link>
//               <Link to="/register" className="register-link">
//                 ➕ Register New Restaurant
//               </Link>
//             </div>
//           </div>
//         </div>

//         <div className="login-features">
//           <h2>🌟 Why Choose TrainFood?</h2>
//           <div className="features-grid">
//             <div className="feature-card">
//               <div className="feature-icon">🚂</div>
//               <h3>Train Station Focus</h3>
//               <p>Specialized for train station food delivery with real-time order tracking</p>
//             </div>
//             <div className="feature-card">
//               <div className="feature-icon">💰</div>
//               <h3>Easy Payments</h3>
//               <p>Secure and fast payments through Razorpay integration</p>
//             </div>
//             <div className="feature-card">
//               <div className="feature-icon">📱</div>
//               <h3>Simple Dashboard</h3>
//               <p>Intuitive seller dashboard for easy order and menu management</p>
//             </div>
//             <div className="feature-card">
//               <div className="feature-icon">🎯</div>
//               <h3>Targeted Customers</h3>
//               <p>Reach hungry train travelers looking for quality food</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SellerLogin;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SellerLogin.css';

const SellerLogin = ({ onSellerLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/sellers/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Note: Not storing in localStorage - sellers must login fresh each time
        
        onSellerLogin(data.seller, data.token);
        
        // Automatically redirect to seller dashboard after successful login
        navigate('/seller');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-login">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>🍱 Seller Login</h1>
            <p>Login to manage your restaurant</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="form-control"
              />
            </div>

            <button 
              type="submit" 
              className="login-btn"
              disabled={loading}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                '🚪 Login to Seller Dashboard'
              )}
            </button>
          </form>

          <div className="login-footer">
            <div className="login-links">
              <Link to="/login" className="customer-login-link">
                👤 Customer Login
              </Link>
              <Link to="/register" className="register-link">
                ➕ Register New Restaurant
              </Link>
            </div>
          </div>
        </div>

        <div className="login-features">
          <h2>🌟 Why Choose TrainFood?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚂</div>
              <h3>Train Station Focus</h3>
              <p>Specialized for train station food delivery with real-time order tracking</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Easy Payments</h3>
              <p>Secure and fast payments through Razorpay integration</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Simple Dashboard</h3>
              <p>Intuitive seller dashboard for easy order and menu management</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Targeted Customers</h3>
              <p>Reach hungry train travelers looking for quality food</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;