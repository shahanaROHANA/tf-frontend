import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = ({ onRegister }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    restaurantName: '',
    station: '',
    phoneNumber: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Extra validation for sellers
    if (formData.role === 'seller') {
      if (!formData.restaurantName.trim()) {
        setError('Restaurant name is required for sellers');
        setLoading(false);
        return;
      }
      if (!formData.station) {
        setError('Please select a station for your restaurant');
        setLoading(false);
        return;
      }
    }

    // Extra validation for delivery agents
    if (formData.role === 'deliveryAgent') {
      if (!formData.phoneNumber.trim()) {
        setError('Phone number is required for delivery agents');
        setLoading(false);
        return;
      }
      if (!formData.location.trim()) {
        setError('Location/address is required for delivery agents');
        setLoading(false);
        return;
      }
      // Basic phone number validation
      const phoneRegex = /^[+]?[0-9\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        setError('Please enter a valid phone number');
        setLoading(false);
        return;
      }
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, registerData);

      // Extract user data and token from response
      const { token, user: userData } = response.data;

      // Store token and user data in localStorage for persistence
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Call onRegister to update parent component state
      if (onRegister) {
        onRegister(userData);
      }

      // Determine redirect route based on user role
      let redirectRoute;
      switch (userData.role) {
        case 'customer':
          redirectRoute = '/products'; // Customer ordering page
          break;
        case 'seller':
          redirectRoute = '/seller'; // Seller dashboard
          break;
        case 'admin':
          redirectRoute = '/admin'; // Admin dashboard
          break;
        case 'deliveryAgent':
          redirectRoute = '/delivery/dashboard'; // Delivery dashboard
          break;
        default:
          redirectRoute = '/products'; // Default to customer page
      }

      // Navigate to the appropriate page
      navigate(redirectRoute);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <div className="welcome-banner">
          <h3>Join TrainFood Community! 🚀</h3>
          <p>Create your account and discover delicious food options at train stations nationwide!</p>
        </div>

        <div className="form-header">
          <h2>Create Account</h2>
          <p className="form-subtitle">Sign up to get started with TrainFood</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="google-login-section">
          <button type="button" onClick={handleGoogleLogin} className="google-login-btn">
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="google-icon" />
            Continue with Google
          </button>
          <div className="divider">
            <span>or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <div className={`input-wrapper ${formData.name ? 'has-content' : ''}`}>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength="2"
                aria-label="Full name"
              />
              <label htmlFor="name">Full name</label>
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <div className={`input-wrapper ${formData.email ? 'has-content' : ''}`}>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                aria-label="Email address"
              />
              <label htmlFor="email">Email address</label>
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <div className={`input-wrapper ${formData.password ? 'has-content' : ''}`}>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                aria-label="Password"
              />
              <label htmlFor="password">Password</label>
            </div>
          </div>

          {/* Confirm password */}
          <div className="form-group">
            <div className={`input-wrapper ${formData.confirmPassword ? 'has-content' : ''}`}>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="6"
                aria-label="Confirm password"
              />
              <label htmlFor="confirmPassword">Confirm password</label>
            </div>
          </div>

          {/* Role */}
          <div className="form-group">
            <div className={`input-wrapper ${formData.role ? 'has-content' : ''}`}>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                aria-label="Account type"
              >
                <option value="customer">Customer</option>
                <option value="seller">Seller</option>
                <option value="deliveryAgent">Delivery Agent</option>
                <option value="admin">Admin</option>
              </select>
              <label htmlFor="role">Account type</label>
            </div>
          </div>

          {/* Seller-specific fields */}
          {formData.role === 'seller' && (
            <>
              <div className="form-group">
                <div className={`input-wrapper ${formData.restaurantName ? 'has-content' : ''}`}>
                  <input
                    type="text"
                    id="restaurantName"
                    name="restaurantName"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    required
                    aria-label="Restaurant name"
                  />
                  <label htmlFor="restaurantName">Restaurant name</label>
                </div>
              </div>

              <div className="form-group">
                <div className={`input-wrapper ${formData.station ? 'has-content' : ''}`}>
                  <select
                    id="station"
                    name="station"
                    value={formData.station}
                    onChange={handleChange}
                    required
                    aria-label="Station location"
                  >
                    <option value="">Select station</option>
                    <option value="Kilinochchi">Kilinochchi</option>
                    <option value="Kodikamam">Kodikamam</option>
                    <option value="Sangaththanai">Sangaththanai</option>
                    <option value="Meesalai">Meesalai</option>
                    <option value="Chavakachcheri">Chavakachcheri</option>
                  </select>
                  <label htmlFor="station">Station (location)</label>
                </div>
              </div>
            </>
          )}

          {/* Delivery Agent-specific fields */}
          {formData.role === 'deliveryAgent' && (
            <>
              <div className="form-group">
                <div className={`input-wrapper ${formData.phoneNumber ? 'has-content' : ''}`}>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    minLength="10"
                    placeholder="+94 7X XXX XXXX"
                    aria-label="Phone number"
                  />
                  <label htmlFor="phoneNumber">Phone number</label>
                </div>
              </div>

              <div className="form-group">
                <div className={`input-wrapper ${formData.location ? 'has-content' : ''}`}>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="City, District"
                    aria-label="Location"
                  />
                  <label htmlFor="location">Location (City, District)</label>
                </div>
              </div>
            </>
          )}

          <button type="submit" disabled={loading} className="register-btn">
            {loading ? (
              <>
                <div className="spinner"></div>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="login-link">
          <span>Already have an account? </span>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="login-link-btn"
            aria-label="Go to login page"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;