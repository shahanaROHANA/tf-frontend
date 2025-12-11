import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SellerAnalytics.css';

const SellerAnalytics = ({ onTabChange }) => {
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if seller is authenticated before making API calls
    const token = localStorage.getItem('sellerToken') || localStorage.getItem('token');
    if (!token) {
      setMessage('Please login to view analytics data');
      setAnalytics(getMockData());
      setLoading(false);
      return;
    }
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setMessage('');
      const token = localStorage.getItem('sellerToken') || localStorage.getItem('token');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/seller/dashboard/analytics?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
        setMessage('Analytics data loaded successfully');
      } else {
        const error = await response.json().catch(() => ({}));
        setMessage(error.message || 'Failed to load analytics');
        // Set mock data for demonstration
        setAnalytics(getMockData());
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setMessage('Error loading analytics data');
      // Set mock data for demonstration when API fails
      setAnalytics(getMockData());
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration when API is not available
  const getMockData = () => ({
    totalProducts: 25,
    totalOrders: 147,
    pendingOrders: 12,
    completedOrders: 135,
    totalRevenue: 45678.50,
    topProducts: [
      { name: 'Chicken Biryani', quantity: 45, revenue: 11250 },
      { name: 'Vegetable Curry', quantity: 38, revenue: 7600 },
      { name: 'Fish Rice', quantity: 32, revenue: 9600 },
      { name: 'Mutton Kottu', quantity: 28, revenue: 8400 },
      { name: 'Coconut Rice', quantity: 24, revenue: 4800 }
    ],
    revenueData: [
      { date: '2024-01', revenue: 8500, orders: 32 },
      { date: '2024-02', revenue: 9200, orders: 38 },
      { date: '2024-03', revenue: 7800, orders: 29 },
      { date: '2024-04', revenue: 10500, orders: 42 },
      { date: '2024-05', revenue: 11800, orders: 48 }
    ]
  });

  const formatPrice = (cents) => {
    return `₹${(cents / 100).toFixed(2)}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getGrowthIndicator = (current, previous) => {
    if (!previous || previous === 0) return { value: 0, isPositive: true };
    const growth = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(growth).toFixed(1),
      isPositive: growth >= 0
    };
  };

  const getPerformanceBadge = (index) => {
    const badges = ['🏆 Top Seller', '⭐ Popular', '✅ Good', '📈 Growing'];
    return badges[index] || '✅ Good';
  };

  if (loading) {
    return (
      <div className="seller-analytics">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h3>Loading Analytics...</h3>
          <p>Fetching your restaurant performance data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-analytics">
      {/* Modern Header */}
      <div className="analytics-header">
        <div className="header-content">
          <h1 className="analytics-title">📊 Analytics Dashboard</h1>
          <p className="analytics-subtitle">
            Track your restaurant's performance and growth metrics
          </p>
        </div>
        <div className="period-selector">
          <label htmlFor="period-select">View Period:</label>
          <select
            id="period-select"
            className="period-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="daily">📅 Daily</option>
            <option value="weekly">📊 Weekly</option>
            <option value="monthly">📈 Monthly</option>
          </select>
        </div>
      </div>

      {/* Alert Messages */}
      {message && (
        <div className={`alert ${
          message.toLowerCase().includes('success') 
            ? 'alert-success' 
            : message.toLowerCase().includes('error') 
            ? 'alert-error' 
            : 'alert-info'
        }`}>
          <span className="alert-icon">
            {message.toLowerCase().includes('success') ? '✅' : 
             message.toLowerCase().includes('error') ? '❌' : 'ℹ️'}
          </span>
          {message}
        </div>
      )}

      {analytics && (
        <>
          {/* Key Performance Indicators */}
          <div className="kpi-section">
            <h2 className="section-title">📈 Key Performance Indicators</h2>
            <div className="kpi-grid">
              <div className="kpi-card products-card">
                <div className="kpi-icon">🍽️</div>
                <div className="kpi-content">
                  <h3 className="kpi-value">{analytics.totalProducts || 0}</h3>
                  <p className="kpi-label">Total Products</p>
                  <span className="kpi-trend positive">+12% this month</span>
                </div>
              </div>

              <div className="kpi-card orders-card">
                <div className="kpi-icon">📦</div>
                <div className="kpi-content">
                  <h3 className="kpi-value">{analytics.totalOrders || 0}</h3>
                  <p className="kpi-label">Total Orders</p>
                  <span className="kpi-trend positive">+8% this period</span>
                </div>
              </div>

              <div className="kpi-card pending-card">
                <div className="kpi-icon">⏳</div>
                <div className="kpi-content">
                  <h3 className="kpi-value">{analytics.pendingOrders || 0}</h3>
                  <p className="kpi-label">Pending Orders</p>
                  <span className="kpi-trend neutral">Active orders</span>
                </div>
              </div>

              <div className="kpi-card completed-card">
                <div className="kpi-icon">✅</div>
                <div className="kpi-content">
                  <h3 className="kpi-value">{analytics.completedOrders || 0}</h3>
                  <p className="kpi-label">Completed Orders</p>
                  <span className="kpi-trend positive">+15% this month</span>
                </div>
              </div>

              <div className="kpi-card featured revenue-card">
                <div className="kpi-icon">💰</div>
                <div className="kpi-content">
                  <h3 className="kpi-value">
                    {typeof analytics.totalRevenue === 'number' 
                      ? formatCurrency(analytics.totalRevenue) 
                      : formatCurrency((analytics.totalRevenue || 0) / 100)
                    }
                  </h3>
                  <p className="kpi-label">Total Revenue</p>
                  <span className="kpi-trend positive">+22% growth</span>
                </div>
              </div>

              <div className="kpi-card rating-card">
                <div className="kpi-icon">⭐</div>
                <div className="kpi-content">
                  <h3 className="kpi-value">4.7</h3>
                  <p className="kpi-label">Average Rating</p>
                  <span className="kpi-trend positive">+0.3 this month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="chart-section">
            <h2 className="section-title">💰 Revenue Trends</h2>
            <div className="chart-container">
              <div className="chart-header">
                <div className="chart-legend">
                  <span className="legend-item revenue">● Revenue</span>
                  <span className="legend-item orders">■ Orders</span>
                </div>
                <div className="chart-period">Current {period}</div>
              </div>
              <div className="chart-content">
                <div className="chart-placeholder">
                  <div className="chart-icon">📊</div>
                  <h3>Revenue Visualization</h3>
                  <p>Interactive charts coming soon</p>
                  <div className="chart-stats">
                    <div className="stat-item">
                      <span className="stat-value">₹45,678</span>
                      <span className="stat-label">This Month</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">147</span>
                      <span className="stat-label">Total Orders</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">₹311</span>
                      <span className="stat-label">Avg Order Value</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="products-section">
            <h2 className="section-title">🏆 Best Performing Products</h2>
            <div className="products-table-container">
              {!analytics.topProducts || analytics.topProducts.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📊</div>
                  <h3>No sales data yet</h3>
                  <p>Start receiving orders to see your top performing products here</p>
                  <button 
                    className="empty-action-btn"
                    onClick={() => onTabChange && onTabChange('add-product')}
                  >
                    Add Your First Product
                  </button>
                </div>
              ) : (
                <div className="products-table">
                  <div className="table-header">
                    <div className="table-cell">🥘 Product</div>
                    <div className="table-cell">📦 Units Sold</div>
                    <div className="table-cell">💰 Revenue</div>
                    <div className="table-cell">🎯 Performance</div>
                  </div>
                  {analytics.topProducts.map((product, index) => (
                    <div key={index} className="table-row">
                      <div className="table-cell product-name">
                        <span className="product-icon">🍽️</span>
                        <span className="product-title">{product.name}</span>
                      </div>
                      <div className="table-cell quantity">{product.quantity}</div>
                      <div className="table-cell revenue">
                        {formatPrice(product.revenue * 100)}
                      </div>
                      <div className="table-cell">
                        <span className={`performance-badge ${index < 2 ? 'excellent' : index < 4 ? 'good' : 'average'}`}>
                          {getPerformanceBadge(index)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="actions-section">
            <h2 className="section-title">⚡ Quick Actions</h2>
            <div className="actions-grid">
              <button
                className="action-card"
                onClick={() => onTabChange && onTabChange('add-product')}
              >
                <div className="action-icon">➕</div>
                <div className="action-content">
                  <h4>Add New Product</h4>
                  <p>Expand your menu offerings</p>
                </div>
              </button>

              <button
                className="action-card"
                onClick={() => onTabChange && onTabChange('orders')}
              >
                <div className="action-icon">📦</div>
                <div className="action-content">
                  <h4>Manage Orders</h4>
                  <p>View and process incoming orders</p>
                </div>
              </button>

              <button
                className="action-card"
                onClick={() => onTabChange && onTabChange('menu')}
              >
                <div className="action-icon">🍴</div>
                <div className="action-content">
                  <h4>Menu Management</h4>
                  <p>Update prices and availability</p>
                </div>
              </button>

              <button
                className="action-card"
                onClick={() => onTabChange && onTabChange('ratings')}
              >
                <div className="action-icon">⭐</div>
                <div className="action-content">
                  <h4>Customer Feedback</h4>
                  <p>Read reviews and ratings</p>
                </div>
              </button>

              <button
                className="action-card"
                onClick={() => onTabChange && onTabChange('profile')}
              >
                <div className="action-icon">⚙️</div>
                <div className="action-content">
                  <h4>Restaurant Settings</h4>
                  <p>Update profile and preferences</p>
                </div>
              </button>

              <button
                className="action-card"
                onClick={() => onTabChange && onTabChange('analytics')}
              >
                <div className="action-icon">📈</div>
                <div className="action-content">
                  <h4>Detailed Reports</h4>
                  <p>Download detailed analytics</p>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SellerAnalytics;