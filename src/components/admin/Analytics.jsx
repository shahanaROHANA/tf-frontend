import { useState, useEffect } from 'react';
import { FaChartLine, FaShoppingCart, FaUsers, FaStore, FaRupeeSign } from 'react-icons/fa';
import { api } from '../../utils/authUtils';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState('monthly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get(`/admin/analytics?period=${period}`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className="empty-state">
      <h3>No analytics data available</h3>
      <p>Start processing orders to see analytics here.</p>
    </div>;
  }

  return (
    <div className="analytics-dashboard">
      {/* Header */}
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>📊 Analytics Dashboard</h2>
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="form-group"
            style={{ width: '150px' }}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '1rem',
              borderRadius: '12px',
              fontSize: '1.5rem'
            }}>
              <FaShoppingCart />
            </div>
            <div>
              <h3 style={{ margin: '0', color: '#636e72', fontSize: '0.9rem' }}>Total Orders</h3>
              <p style={{ margin: '0', fontSize: '1.8rem', fontWeight: 'bold', color: '#2d3436' }}>
                {analytics.orders?.total || analytics.totalOrders || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)',
              color: 'white',
              padding: '1rem',
              borderRadius: '12px',
              fontSize: '1.5rem'
            }}>
              <FaRupeeSign />
            </div>
            <div>
              <h3 style={{ margin: '0', color: '#636e72', fontSize: '0.9rem' }}>Total Revenue</h3>
              <p style={{ margin: '0', fontSize: '1.8rem', fontWeight: 'bold', color: '#2d3436' }}>
                ₹{((analytics.revenue?.total || analytics.totalRevenue || 0) / 100).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
              color: 'white',
              padding: '1rem',
              borderRadius: '12px',
              fontSize: '1.5rem'
            }}>
              <FaChartLine />
            </div>
            <div>
              <h3 style={{ margin: '0', color: '#636e72', fontSize: '0.9rem' }}>Completion Rate</h3>
              <p style={{ margin: '0', fontSize: '1.8rem', fontWeight: 'bold', color: '#2d3436' }}>
                {(analytics.completionRate || 0).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
              color: 'white',
              padding: '1rem',
              borderRadius: '12px',
              fontSize: '1.5rem'
            }}>
              <FaStore />
            </div>
            <div>
              <h3 style={{ margin: '0', color: '#636e72', fontSize: '0.9rem' }}>Active Vendors</h3>
              <p style={{ margin: '0', fontSize: '1.8rem', fontWeight: 'bold', color: '#2d3436' }}>
                {analytics.sellers?.active || analytics.totalSellers || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Top Selling Items */}
        <div className="admin-card">
          <h3>🔥 Top Selling Items</h3>
          {analytics.topSellingItems?.length > 0 ? (
            <div style={{ marginTop: '1rem' }}>
              {analytics.topSellingItems.slice(0, 5).map((item, index) => (
                <div key={item._id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #ecf0f1'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {index + 1}
                    </span>
                    <span>{item.product?.name || 'Unknown Item'}</span>
                  </div>
                  <span style={{ 
                    background: '#f8f9fa',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    {item.count} sold
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#636e72', textAlign: 'center', padding: '2rem' }}>
              No sales data available for this period
            </p>
          )}
        </div>

        {/* Vendor Performance */}
        <div className="admin-card">
          <h3>🏆 Vendor Performance</h3>
          {analytics.vendorPerformance?.length > 0 ? (
            <div style={{ marginTop: '1rem' }}>
              {analytics.vendorPerformance.slice(0, 5).map((vendor, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #ecf0f1'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ 
                      background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)',
                      color: 'white',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {index + 1}
                    </span>
                    <span>{vendor.seller?.name || 'Unknown Vendor'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ 
                      background: '#e3f2fd',
                      color: '#1976d2',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      {vendor.orders} orders
                    </span>
                    <span style={{ 
                      background: '#f3e5f5',
                      color: '#7b1fa2',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      ₹{((vendor.revenue || 0) / 100).toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#636e72', textAlign: 'center', padding: '2rem' }}>
              No vendor performance data available for this period
            </p>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="admin-card">
        <h3>📈 Summary Statistics</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4 style={{ margin: '0', color: '#636e72', fontSize: '0.9rem' }}>Completed Orders</h4>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#27ae60' }}>
              {analytics.orders?.completed || analytics.completedOrders || 0}
            </p>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4 style={{ margin: '0', color: '#636e72', fontSize: '0.9rem' }}>Pending Orders</h4>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#f39c12' }}>
              {(analytics.orders?.total || analytics.totalOrders || 0) - (analytics.orders?.completed || analytics.completedOrders || 0)}
            </p>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4 style={{ margin: '0', color: '#636e72', fontSize: '0.9rem' }}>Average Order Value</h4>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
              ₹{(analytics.orders?.total || analytics.totalOrders) > 0 ? (((analytics.revenue?.total || analytics.totalRevenue || 0) / (analytics.orders?.total || analytics.totalOrders || 1)) / 100).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
