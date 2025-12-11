import React from 'react';

const DeliveryHistory = ({ orders }) => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `₹${(amount / 100).toFixed(2)}`;
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="delivery-card history-card">
        <h3>📋 Today's History</h3>
        <div className="no-history-content">
          <div className="no-history-icon">📭</div>
          <p>No deliveries completed today</p>
          <p className="text-muted">Completed orders will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="delivery-card history-card">
      <h3>📋 Today's History ({orders.length})</h3>
      
      <div className="history-list">
        {orders.map((order) => (
          <div key={order._id} className="history-item">
            <div className="history-item-header">
              <div className="order-info">
                <span className="order-number">#{order.orderNumber}</span>
                <span className="order-time">{formatTime(order.timestamps?.deliveredAt || order.updatedAt)}</span>
              </div>
              <div className="order-earnings">
                +{formatCurrency(order.totals?.finalCents * 0.1 + 2000)} {/* 10% + ₹20 base */}
              </div>
            </div>

            <div className="history-item-details">
              <div className="delivery-route-summary">
                <div className="route-point">
                  <span className="point-icon small">🏪</span>
                  <span className="point-name">
                    {order.items?.[0]?.seller?.name || 'Restaurant'}
                  </span>
                </div>
                <div className="route-arrow-small">→</div>
                <div className="route-point">
                  <span className="point-icon small">🚆</span>
                  <span className="point-name">
                    {order.deliveryInfo?.stationName}
                  </span>
                </div>
              </div>

              <div className="delivery-meta">
                <div className="meta-item">
                  <span className="meta-label">Items:</span>
                  <span className="meta-value">{order.items?.length || 0}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Total:</span>
                  <span className="meta-value">{formatCurrency(order.totals?.finalCents || 0)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Customer:</span>
                  <span className="meta-value">{order.deliveryInfo?.contactName}</span>
                </div>
              </div>
            </div>

            <div className="history-item-footer">
              <div className="delivery-duration">
                <span className="duration-label">
                  {order.timestamps?.deliveredAt && order.timestamps?.outForDeliveryAt ? 
                    `⏱️ ${Math.round((new Date(order.timestamps.deliveredAt) - new Date(order.timestamps.outForDeliveryAt)) / 60000)} min` : 
                    ''
                  }
                </span>
              </div>
              <div className="delivery-status">
                <span className="status-badge status-completed">
                  ✅ Delivered
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="history-summary">
        <div className="summary-item">
          <span className="summary-label">Total Deliveries</span>
          <span className="summary-value">{orders.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Total Earnings</span>
          <span className="summary-value text-success">
            {formatCurrency(orders.reduce((total, order) => 
              total + (order.totals?.finalCents * 0.1 + 2000), 0
            ))}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Average Time</span>
          <span className="summary-value">
            {orders.length > 0 ? 
              `${Math.round(orders.reduce((total, order) => {
                if (order.timestamps?.deliveredAt && order.timestamps?.outForDeliveryAt) {
                  return total + Math.round((new Date(order.timestamps.deliveredAt) - new Date(order.timestamps.outForDeliveryAt)) / 60000);
                }
                return total;
              }, 0) / orders.length)} min` : 
              'N/A'
            }
          </span>
        </div>
      </div>

      <div className="history-actions">
        <button className="btn btn-outline btn-sm btn-block">
          📊 View Full History
        </button>
      </div>
    </div>
  );
};

export default DeliveryHistory;
