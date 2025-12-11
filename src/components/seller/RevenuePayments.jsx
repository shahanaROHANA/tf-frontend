import React, { useState, useEffect } from 'react';
import { api } from '../../utils/authUtils.js';

const RevenuePayments = ({ analyticsData }) => {
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if seller is authenticated before making API calls
    const token = localStorage.getItem('sellerToken') || localStorage.getItem('token');
    if (!token) {
      setMessage('Please login to view revenue data');
      setLoading(false);
      return;
    }
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/seller/dashboard/analytics?period=${period}`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setMessage(error.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    try {
      const token = localStorage.getItem('sellerToken');
      // This would need to be implemented in the backend
      // For now, create a simple CSV download
      if (!analytics) return;

      let csvContent = "Period,Revenue,Orders\n";
      
      Object.entries(analytics.revenueData || {}).forEach(([date, data]) => {
        csvContent += `${date},${data.revenue},${data.orders}\n`;
      });

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `revenue-report-${period}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      setMessage('Report downloaded successfully!');
    } catch (error) {
      setMessage('Error downloading report');
    }
  };

  const formatPrice = (cents) => {
    return `₹${(cents / 100).toFixed(2)}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="revenue-payments">
        <div className="card">
          <div className="text-center p-4">
            <div className="loading-spinner"></div>
            <p>Loading revenue data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="revenue-payments">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">💰 Revenue & Payments</h2>
          <div className="header-actions">
            <select 
              className="form-control"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              style={{ width: '150px', marginRight: '1rem' }}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <button className="btn btn-primary" onClick={downloadReport}>
              📊 Download Report
            </button>
          </div>
        </div>

        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}

        {analytics && (
          <>
            {/* Revenue Overview */}
            <div className="revenue-overview">
              <h3>📈 Revenue Overview</h3>
              <div className="overview-grid">
                <div className="overview-card">
                  <div className="card-icon">💰</div>
                  <div className="card-content">
                    <h4>Total Revenue</h4>
                    <p className="revenue-amount">{formatCurrency(analytics.totalRevenue / 100)}</p>
                  </div>
                </div>
                <div className="overview-card">
                  <div className="card-icon">📦</div>
                  <div className="card-content">
                    <h4>Total Orders</h4>
                    <p className="orders-count">{analytics.totalOrders}</p>
                  </div>
                </div>
                <div className="overview-card">
                  <div className="card-icon">💳</div>
                  <div className="card-content">
                    <h4>Average Order Value</h4>
                    <p className="avg-order">{formatCurrency(analytics.averageOrderValue / 100)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="revenue-chart">
              <h3>📊 Revenue Trend</h3>
              <div className="chart-container">
                <div className="chart-bars">
                  {Object.entries(analytics.revenueData || {}).map(([date, data], index) => {
                    const maxRevenue = Math.max(...Object.values(analytics.revenueData).map(d => d.revenue));
                    const height = (data.revenue / maxRevenue) * 100;
                    
                    return (
                      <div key={date} className="chart-bar-container">
                        <div 
                          className="chart-bar"
                          style={{ height: `${height}%` }}
                          title={`${date}: ${formatPrice(data.revenue)}`}
                        ></div>
                        <div className="chart-label">{date}</div>
                        <div className="chart-value">{formatPrice(data.revenue)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="top-products">
              <h3>🏆 Top Selling Products</h3>
              <div className="products-list">
                {analytics.topProducts?.length === 0 ? (
                  <p>No sales data available yet.</p>
                ) : (
                  analytics.topProducts.map((product, index) => (
                    <div key={index} className="product-item">
                      <div className="product-rank">#{index + 1}</div>
                      <div className="product-info">
                        <h4>{product.name}</h4>
                        <p>{product.quantity} sold</p>
                      </div>
                      <div className="product-revenue">
                        {formatPrice(product.revenue)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div className="payment-info">
              <h3>💳 Payment Information</h3>
              <div className="payment-grid">
                <div className="payment-card">
                  <h4>💳 Razorpay Integration</h4>
                  <div className="payment-status">
                    <span className="status-badge active">✅ Connected</span>
                  </div>
                  <p>Payments are processed securely through Razorpay</p>
                </div>
                <div className="payment-card">
                  <h4>📅 Payout Schedule</h4>
                  <p>Weekly payouts every Monday</p>
                  <p className="text-muted">Next payout: Monday, {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                </div>
                <div className="payment-card">
                  <h4>🏦 Bank Account</h4>
                  <p>Account ending in ****1234</p>
                  <button className="btn btn-sm btn-secondary">Update Bank Details</button>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="transaction-history">
              <h3>📋 Recent Transactions</h3>
              <div className="transactions-table">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Order ID</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Sample transaction data - in real app, this would come from backend */}
                    <tr>
                      <td>{new Date().toLocaleDateString()}</td>
                      <td>Payment</td>
                      <td>#ORD123456</td>
                      <td>{formatPrice(29900)}</td>
                      <td><span className="status-badge active">Completed</span></td>
                    </tr>
                    <tr>
                      <td>{new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString()}</td>
                      <td>Payout</td>
                      <td>PAYOUT001</td>
                      <td>{formatPrice(125000)}</td>
                      <td><span className="status-badge active">Completed</span></td>
                    </tr>
                    <tr>
                      <td>{new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}</td>
                      <td>Payment</td>
                      <td>#ORD123455</td>
                      <td>{formatPrice(45000)}</td>
                      <td><span className="status-badge active">Completed</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        .header-actions {
          display: flex;
          align-items: center;
        }

        .revenue-overview {
          margin-bottom: 2rem;
        }

        .overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .overview-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1.5rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .overview-card:hover {
          transform: translateY(-4px);
        }

        .card-icon {
          font-size: 2.5rem;
          opacity: 0.8;
        }

        .card-content h4 {
          margin: 0 0 0.5rem 0;
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .revenue-amount, .orders-count, .avg-order {
          margin: 0;
          font-size: 1.8rem;
          font-weight: 700;
        }

        .revenue-chart {
          margin-bottom: 2rem;
        }

        .chart-container {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          margin-top: 1rem;
        }

        .chart-bars {
          display: flex;
          align-items: end;
          justify-content: space-around;
          height: 200px;
          gap: 1rem;
        }

        .chart-bar-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          max-width: 60px;
        }

        .chart-bar {
          width: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 4px 4px 0 0;
          min-height: 20px;
          transition: height 0.3s ease;
        }

        .chart-label {
          margin-top: 0.5rem;
          font-size: 0.7rem;
          color: #4a5568;
          text-align: center;
        }

        .chart-value {
          font-size: 0.6rem;
          color: #718096;
          text-align: center;
          margin-top: 0.25rem;
        }

        .top-products {
          margin-bottom: 2rem;
        }

        .products-list {
          background: white;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          margin-top: 1rem;
        }

        .product-item {
          display: flex;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .product-item:last-child {
          border-bottom: none;
        }

        .product-rank {
          background: #667eea;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.8rem;
          margin-right: 1rem;
        }

        .product-info {
          flex: 1;
        }

        .product-info h4 {
          margin: 0 0 0.25rem 0;
          color: #2d3748;
          font-size: 1rem;
        }

        .product-info p {
          margin: 0;
          color: #718096;
          font-size: 0.9rem;
        }

        .product-revenue {
          font-weight: 600;
          color: #48bb78;
          font-size: 1.1rem;
        }

        .payment-info {
          margin-bottom: 2rem;
        }

        .payment-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .payment-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1.5rem;
        }

        .payment-card h4 {
          margin: 0 0 1rem 0;
          color: #2d3748;
        }

        .payment-status {
          margin-bottom: 1rem;
        }

        .payment-card p {
          margin: 0.5rem 0;
          color: #4a5568;
        }

        .transaction-history {
          margin-bottom: 2rem;
        }

        .transactions-table {
          margin-top: 1rem;
          overflow-x: auto;
        }

        @media (max-width: 768px) {
          .overview-grid {
            grid-template-columns: 1fr;
          }

          .chart-bars {
            gap: 0.5rem;
          }

          .chart-bar-container {
            max-width: 40px;
          }

          .payment-grid {
            grid-template-columns: 1fr;
          }

          .product-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .header-actions {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
};

export default RevenuePayments;
