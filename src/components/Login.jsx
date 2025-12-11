import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loginUser, isAuthenticated } from '../utils/authUtils';
import './Login.css';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: email, 2: otp & password
  const [forgotData, setForgotData] = useState({
    email: '',
    otp: '',
    newPassword: ''
  });
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

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
    setFieldErrors({});

    try {
      const result = await loginUser(formData.email, formData.password);

      if (result.success) {
        // Call parent callback
        onLogin(result.user);

        // Immediate redirect based on role (no delay)
        if (result.user.role === 'deliveryAgent') {
          navigate('/delivery/dashboard');
        } else if (result.user.role === 'admin') {
          navigate('/admin');
        } else if (result.user.role === 'seller') {
          navigate('/seller');
        } else {
          // Default redirect for customers and other roles
          navigate('/products');
        }
      } else {
        setError(result.error);

        // Set field-specific errors if available
        if (result.error.includes('email') || result.error.includes('Email')) {
          setFieldErrors({ email: result.error });
        } else if (result.error.includes('password') || result.error.includes('Password')) {
          setFieldErrors({ password: result.error });
        }
      }
    } catch (err) {
      const errorMessage = 'Login failed';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotChange = (e) => {
    setForgotData({
      ...forgotData,
      [e.target.name]: e.target.value
    });
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    setForgotSuccess('');

    try {
      if (forgotStep === 1) {
        // Send OTP
        await axios.post(`${import.meta.env.VITE_API_URL}/auth/forget-password`, { email: forgotData.email });
        setForgotSuccess('OTP sent to your email');
        setForgotStep(2);
      } else {
        // Reset password
        await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
          email: forgotData.email,
          otp: forgotData.otp,
          newPassword: forgotData.newPassword
        });
        setForgotSuccess('Password reset successful');
        setTimeout(() => {
          setShowForgotModal(false);
          setForgotStep(1);
          setForgotData({ email: '', otp: '', newPassword: '' });
          setForgotSuccess('');
        }, 2000);
      }
    } catch (err) {
      setForgotError(err.response?.data?.message || 'An error occurred');
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotStep(1);
    setForgotData({ email: '', otp: '', newPassword: '' });
    setForgotError('');
    setForgotSuccess('');
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="welcome-banner">
          <h3>Welcome to TrainFood! 🚂</h3>
          <p>Order delicious food on your train journey - quick, easy & contactless!</p>
        </div>

        <div className="form-header">
          <h2>Sign In</h2>
          <p className="form-subtitle">Access your TrainFood account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <div className={`input-wrapper ${formData.email ? 'has-content' : ''} ${fieldErrors.email ? 'error' : ''}`}>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                aria-label="Email address"
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
              />
              <label htmlFor="email">Email address</label>
            </div>
            {fieldErrors.email && (
              <span id="email-error" className="field-error" role="alert">
                {fieldErrors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <div className={`input-wrapper ${formData.password ? 'has-content' : ''} ${fieldErrors.password ? 'error' : ''}`}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                aria-label="Password"
                aria-describedby={fieldErrors.password ? "password-error" : undefined}
              />
              <label htmlFor="password">Password</label>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {fieldErrors.password && (
              <span id="password-error" className="field-error" role="alert">
                {fieldErrors.password}
              </span>
            )}
          </div>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? (
              <>
                <div className="spinner"></div>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="forgot-password-link">
          <button
            type="button"
            onClick={() => setShowForgotModal(true)}
            className="forgot-btn"
            aria-label="Forgot password"
          >
            Forgot your password?
          </button>
        </div>
      </div>

      {showForgotModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="forgot-modal-title">
          <div className="modal-content">
            <h3 id="forgot-modal-title">Reset Password</h3>
            <p className="modal-description">
              Enter your email address and we'll send you reset instructions if an account exists.
            </p>
            {forgotError && <div className="error-message" role="alert">{forgotError}</div>}
            {forgotSuccess && <div className="success-message" role="alert">{forgotSuccess}</div>}
            <form onSubmit={handleForgotSubmit}>
              {forgotStep === 1 ? (
                <div className="form-group">
                  <div className={`input-wrapper ${forgotData.email ? 'has-content' : ''}`}>
                    <input
                      type="email"
                      id="forgot-email"
                      name="email"
                      value={forgotData.email}
                      onChange={handleForgotChange}
                      required
                      aria-label="Email address for password reset"
                    />
                    <label htmlFor="forgot-email">Email address</label>
                  </div>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <div className={`input-wrapper ${forgotData.otp ? 'has-content' : ''}`}>
                      <input
                        type="text"
                        id="forgot-otp"
                        name="otp"
                        value={forgotData.otp}
                        onChange={handleForgotChange}
                        required
                        aria-label="One-time password"
                        placeholder="Enter 6-digit code"
                      />
                      <label htmlFor="forgot-otp">Verification code</label>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className={`input-wrapper ${forgotData.newPassword ? 'has-content' : ''}`}>
                      <input
                        type="password"
                        id="forgot-newPassword"
                        name="newPassword"
                        value={forgotData.newPassword}
                        onChange={handleForgotChange}
                        required
                        aria-label="New password"
                      />
                      <label htmlFor="forgot-newPassword">New password</label>
                    </div>
                  </div>
                </>
              )}
              <button type="submit" disabled={forgotLoading} className="login-btn">
                {forgotLoading ? (
                  <>
                    <div className="spinner"></div>
                    Processing...
                  </>
                ) : forgotStep === 1 ? 'Send Reset Instructions' : 'Reset Password'}
              </button>
            </form>
            <button
              type="button"
              onClick={closeForgotModal}
              className="close-modal-btn"
              aria-label="Close reset password modal"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
