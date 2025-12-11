import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SellerProfile from './seller/SellerProfile';
import MenuManagement from './seller/MenuManagement';
import OrderHandling from './seller/OrderHandling';
import TrainAssignment from './seller/TrainAssignment';
import RevenuePayments from './seller/RevenuePayments';
import Notifications from './seller/Notifications';
import RatingsFeedback from './seller/RatingsFeedback';
import SellerAnalytics from './seller/SellerAnalytics';
import './SellerDashboard.css';

const SellerDashboard = ({ seller, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [sellerData, setSellerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    fetchSellerProfile();
  }, []);

  const fetchSellerProfile = async () => {
    try {
      // Use the passed seller prop if available
      if (seller) {
        setSellerData(seller);
        setIsAuthenticated(true);
      } else {
        // If no seller prop, still allow dashboard access but mark as needing login
        // This prevents redirect to login on page refresh
        setSellerData(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error setting seller data:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };



  const renderTabContent = () => {
    // Always render the dashboard content, even if not authenticated
    // Show a login notice at the top if not authenticated
    
    switch (activeTab) {
      case 'profile':
        return (
          <>
            {!isAuthenticated && !seller && (
              <div className="auth-notice">
                <p>⚠️ Please login to access full features</p>
              </div>
            )}
            <SellerProfile sellerData={sellerData} onUpdate={fetchSellerProfile} />
          </>
        );
      case 'add-product':
        return (
          <>
            {!isAuthenticated && !seller && (
              <div className="auth-notice">
                <p>⚠️ Please login to add products</p>
              </div>
            )}
            <MenuManagement mode="add" />
          </>
        );
      case 'my-products':
        return (
          <>
            {!isAuthenticated && !seller && (
              <div className="auth-notice">
                <p>⚠️ Please login to view your products</p>
              </div>
            )}
            <MenuManagement mode="list" />
          </>
        );
      case 'orders':
        return (
          <>
            {!isAuthenticated && !seller && (
              <div className="auth-notice">
                <p>⚠️ Please login to view orders</p>
              </div>
            )}
            <OrderHandling />
          </>
        );
      case 'trains':
        return (
          <>
            {!isAuthenticated && !seller && (
              <div className="auth-notice">
                <p>⚠️ Please login to manage train assignments</p>
              </div>
            )}
            <TrainAssignment />
          </>
        );
      case 'revenue':
        return (
          <>
            {!isAuthenticated && !seller && (
              <div className="auth-notice">
                <p>⚠️ Please login to view revenue</p>
              </div>
            )}
            <RevenuePayments />
          </>
        );
      case 'notifications':
        return (
          <>
            {!isAuthenticated && !seller && (
              <div className="auth-notice">
                <p>⚠️ Please login to view notifications</p>
              </div>
            )}
            <Notifications />
          </>
        );
      case 'ratings':
        return (
          <>
            {!isAuthenticated && !seller && (
              <div className="auth-notice">
                <p>⚠️ Please login to view ratings</p>
              </div>
            )}
            <RatingsFeedback />
          </>
        );
      case 'analytics':
        return (
          <>
            {!isAuthenticated && !seller && (
              <div className="auth-notice">
                <p>⚠️ Please login to view analytics</p>
              </div>
            )}
            <SellerAnalytics onTabChange={setActiveTab} />
          </>
        );
      default:
        return (
          <>
            {!isAuthenticated && !seller && (
              <div className="auth-notice">
                <p>⚠️ Please login to access full features</p>
              </div>
            )}
            <SellerProfile sellerData={sellerData} onUpdate={fetchSellerProfile} />
          </>
        );
    }
  };

  if (loading) {
    return (
      <div className="seller-dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="seller-dashboard">
      <div className="dashboard-header">
        <h1>🍱 {sellerData?.restaurantName || seller?.restaurantName || 'Seller Dashboard'}</h1>
        <div className="header-info">
          <span className="station-info">📍 {sellerData?.station || seller?.station || 'Unknown Station'}</span>
          <span className={`status-badge ${(sellerData?.isActive || seller?.isActive) ? 'active' : 'inactive'}`}>
            {(sellerData?.isActive || seller?.isActive) ? '🟢 Active' : '🔴 Inactive'}
          </span>

        </div>
      </div>

      <div className="dashboard-container">
        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3>📊 Dashboard</h3>
            <button 
              className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('analytics');
                // Update URL without page refresh
                window.history.pushState({}, '', '/seller');
              }}
            >
              📈 Analytics
            </button>
          </div>

          <div className="nav-section">
            <h3>👤 Account</h3>
            <button 
              className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              📝 Profile Management
            </button>
          </div>

          <div className="nav-section">
            <h3>🍽️ Menu</h3>
            <button
              className={`nav-btn ${activeTab === 'add-product' ? 'active' : ''}`}
              onClick={() => setActiveTab('add-product')}
            >
              ➕ Add Product
            </button>
            <button
              className={`nav-btn ${activeTab === 'my-products' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-products')}
            >
              📦 My Products
            </button>
          </div>

          <div className="nav-section">
            <h3>📦 Orders</h3>
            <button 
              className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              🚚 Order Handling
            </button>
          </div>

          <div className="nav-section">
            <h3>🚆 Trains</h3>
            <button 
              className={`nav-btn ${activeTab === 'trains' ? 'active' : ''}`}
              onClick={() => setActiveTab('trains')}
            >
              🎫 Train Assignment
            </button>
          </div>

          <div className="nav-section">
            <h3>💰 Revenue</h3>
            <button 
              className={`nav-btn ${activeTab === 'revenue' ? 'active' : ''}`}
              onClick={() => setActiveTab('revenue')}
            >
              💳 Revenue & Payments
            </button>
          </div>

          <div className="nav-section">
            <h3>🔔 Communication</h3>
            <button 
              className={`nav-btn ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              📬 Notifications
            </button>
          </div>

          <div className="nav-section">
            <h3>⭐ Feedback</h3>
            <button 
              className={`nav-btn ${activeTab === 'ratings' ? 'active' : ''}`}
              onClick={() => setActiveTab('ratings')}
            >
              📝 Ratings & Feedback
            </button>
          </div>
        </nav>

        <main className="main-content">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default SellerDashboard;
