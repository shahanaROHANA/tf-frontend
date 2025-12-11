import React, { useState } from 'react';

const AvailableOrdersList = ({ orders, onAcceptOrder, onDeclineOrder }) => {
  const [declineReason, setDeclineReason] = useState('');
  const [showDeclineModal, setShowDeclineModal] = useState(null);
  const [loading, setLoading] = useState(false);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDistance = (stationName) => {
    // Simple distance calculation based on station
    const distances = {
      'colombo': 0,
      'maradana': 3,
      'dematagoda': 5,
      'kelaniya': 8,
      'ragama': 15
    };
    
    const station = stationName?.toLowerCase();
    return distances[station] || 0;
  };

  const calculateETA = (stationName) => {
    const etas = {
      'colombo': '0 min',
      'maradana': '10 min',
      'dematagoda': '15 min',
      'kelaniya': '25 min',
      'ragama': '40 min'
    };
    
    const station = stationName?.toLowerCase();
    return etas[station] || 'Unknown';
  };

  const calculatePayout = (orderTotal) => {
    // Simple payout calculation: 10% of order total + ₹20 base
    return Math.round((orderTotal * 0.1) + 2000);
  };

  const handleAccept = async (orderId) => {
    setLoading(true);
    try {
      await onAcceptOrder(orderId);
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    if (!showDeclineModal || !declineReason.trim()) {
      return;
    }

    setLoading(true);
    try {
      await onDeclineOrder(showDeclineModal, declineReason);
      setShowDeclineModal(null);
      setDeclineReason('');
    } finally {
      setLoading(false);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="delivery-card no-orders-card">
        <div className="no-orders-content">
          <div className="no-orders-icon">🛵</div>
          <h3>No Available Orders</h3>
          <p>You're all caught up! New orders will appear here when they're ready for pickup.</p>
          <div className="no-orders-tips">
            <h4>Tips:</h4>
            <ul>
              <li>Make sure you're online to receive orders</li>
              <li>Stay near restaurant areas for faster pickups</li>
              <li>Keep your phone nearby for notifications</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="available-orders-container">
      <h3 className="orders-title">📋 Available Orders ({orders.length})</h3>
      
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card available-order-card">
            <div className="order-header">
              <div className="order-number">
                <strong>#{order.orderNumber}</strong>
                <span className="order-time">{formatTime(order.createdAt)}</span>
              </div>
              <div className="order-payout">
                ₹{calculatePayout(order.totals?.finalCents || 0) / 100}
              </div>
            </div>

            <div className="order-route">
              <div className="route-point pickup-point">
                <div className="point-icon">🏪</div>
                <div className="point-details">
                  <div className="point-label">Pickup</div>
                  <div className="point-address">
                    {order.items?.[0]?.seller?.name || 'Restaurant'}
                  </div>
                </div>
              </div>

              <div className="route-arrow">→</div>

              <div className="route-point delivery-point">
                <div className="point-icon">🚆</div>
                <div className="point-details">
                  <div className="point-label">Delivery</div>
                  <div className="point-address">
                    {order.deliveryInfo?.stationName} - {order.deliveryInfo?.coach} Coach
                  </div>
                  <div className="point-seat">Seat {order.deliveryInfo?.seat}</div>
                </div>
              </div>
            </div>

            <div className="order-details">
              <div className="detail-item">
                <span className="detail-label">Distance:</span>
                <span className="detail-value">{calculateDistance(order.deliveryInfo?.stationName)} km</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">ETA:</span>
                <span className="detail-value">{calculateETA(order.deliveryInfo?.stationName)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Items:</span>
                <span className="detail-value">{order.items?.length || 0} items</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Customer:</span>
                <span className="detail-value">{order.deliveryInfo?.contactName}</span>
              </div>
            </div>

            <div className="order-items-preview">
              {order.items?.slice(0, 3).map((item, index) => (
                <span key={index} className="item-tag">
                  {item.name} x{item.qty}
                </span>
              ))}
              {order.items?.length > 3 && (
                <span className="item-tag more-items">
                  +{order.items.length - 3} more
                </span>
              )}
            </div>

            <div className="order-actions">
              <button 
                className="btn btn-danger"
                onClick={() => setShowDeclineModal(order._id)}
                disabled={loading}
              >
                ❌ Decline
              </button>
              <button 
                className="btn btn-success btn-lg"
                onClick={() => handleAccept(order._id)}
                disabled={loading}
              >
                ✅ Accept Order
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Decline Order Modal */}
      {showDeclineModal && (
        <div className="modal-overlay" onClick={() => setShowDeclineModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>❌ Decline Order</h3>
              <button className="close-btn" onClick={() => setShowDeclineModal(null)}>×</button>
            </div>

            <div className="modal-body">
              <p>Why are you declining this order?</p>
              <div className="decline-reasons">
                <label className="reason-option">
                  <input
                    type="radio"
                    name="reason"
                    value="Too far"
                    checked={declineReason === 'Too far'}
                    onChange={(e) => setDeclineReason(e.target.value)}
                  />
                  <span>Too far away</span>
                </label>
                <label className="reason-option">
                  <input
                    type="radio"
                    name="reason"
                    value="Too busy"
                    checked={declineReason === 'Too busy'}
                    onChange={(e) => setDeclineReason(e.target.value)}
                  />
                  <span>Too busy right now</span>
                </label>
                <label className="reason-option">
                  <input
                    type="radio"
                    name="reason"
                    value="Technical issues"
                    checked={declineReason === 'Technical issues'}
                    onChange={(e) => setDeclineReason(e.target.value)}
                  />
                  <span>Technical issues with vehicle</span>
                </label>
                <label className="reason-option">
                  <input
                    type="radio"
                    name="reason"
                    value="Other"
                    checked={declineReason === 'Other'}
                    onChange={(e) => setDeclineReason(e.target.value)}
                  />
                  <span>Other reason</span>
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowDeclineModal(null)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleDecline}
                disabled={loading || !declineReason.trim()}
              >
                {loading ? 'Declining...' : 'Decline Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableOrdersList;
