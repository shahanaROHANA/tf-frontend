// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './DeliveryLogin.css';

// const DeliveryLogin = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const response = await fetch('/api/delivery/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(formData)
//       });

//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem('deliveryToken', data.token);
//         localStorage.setItem('deliveryInfo', JSON.stringify({
//           _id: data._id,
//           name: data.name,
//           email: data.email,
//           isAvailable: data.isAvailable,
//           earnings: data.earnings
//         }));
//         navigate('/delivery/dashboard');
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
//     <div className="delivery-login-container">
//       <div className="delivery-login-card">
//         <div className="delivery-login-header">
//           <h1>🛵 Delivery Partner</h1>
//           <p>Login to start delivering</p>
//         </div>

//         <form onSubmit={handleSubmit} className="delivery-login-form">
//           {error && <div className="error-message">{error}</div>}
          
//           <div className="form-group">
//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               placeholder="Enter your email"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               placeholder="Enter your password"
//             />
//           </div>

//           <button 
//             type="submit" 
//             className="delivery-login-btn"
//             disabled={loading}
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>

//         <div className="delivery-login-footer">
//           <p>Contact support if you have login issues</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DeliveryLogin;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeliveryLogin.css';

const DeliveryLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API}/delivery/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('deliveryToken', data.token);
        localStorage.setItem('deliveryInfo', JSON.stringify({
          _id: data._id,
          name: data.name,
          email: data.email,
          isAvailable: data.isAvailable,
          earnings: data.earnings
        }));
        navigate('/delivery/dashboard');
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
    <div className="delivery-login-container">
      {/* ... your existing JSX ... */}
    </div>
  );
};

export default DeliveryLogin;