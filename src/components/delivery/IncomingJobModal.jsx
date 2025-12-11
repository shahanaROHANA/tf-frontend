import React, { useState, useEffect } from 'react';

const IncomingJobModal = ({ order, onAccept, onDecline, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [autoDeclineTimer, setAutoDeclineTimer] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto decline after timeout
          onDecline('Timeout - No response');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setAutoDeclineTimer(timer);

    return () => {
      clearInterval(timer);
    };
  }, [onDecline]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateDistance = (stationName) => {
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
    return Math.round((orderTotal * 0.1) + 2000); // 10% + ₹20 base
  };

  if (!order) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content incoming-job-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🔔 New Delivery Request!</h3>
          <div className="countdown-timer">
            <div className={`timer-circle ${timeLeft <= 10 ? 'warning' : ''}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="timer-label">Auto-decline in {timeLeft}s</div>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="job-alert">
            <div className="alert-icon">📱</div>
            <div className="alert-text">
              <strong>New delivery opportunity!</strong>
              <p>Accept or decline this order</p>
            </div>
          </div>

          <div className="order-summary">
            <div className="summary-header">
              <h4>Order #{order.orderNumber}</h4>
              <div className="order-payout-highlight">
                +₹{calculatePayout(order.totals?.finalCents || 0) / 100}
              </div>
            </div>

            <div className="route-preview">
              <div className="route-point pickup-preview">
                <div className="point-icon-small">🏪</div>
                <div className="point-details">
                  <div className="point-name">
                    {order.items?.[0]?.seller?.name || 'Restaurant'}
                  </div>
                  <div className="point-action">Pickup</div>
                </div>
              </div>

              <div className="route-arrow-large">→</div>

              <div className="route-point delivery-preview">
                <div className="point-icon-small">🚆</div>
                <div className="point-details">
                  <div className="point-name">
                    {order.deliveryInfo?.stationName} Station
                  </div>
                  <div className="point-details-small">
                    Coach {order.deliveryInfo?.coach}, Seat {order.deliveryInfo?.seat}
                  </div>
                  <div className="point-action">Delivery</div>
                </div>
              </div>
            </div>

            <div className="job-details-grid">
              <div className="detail-row">
                <span className="detail-icon">📦</span>
                <div className="detail-info">
                  <div className="detail-label">Items</div>
                  <div className="detail-value">{order.items?.length || 0} items</div>
                </div>
              </div>

              <div className="detail-row">
                <span className="detail-icon">📏</span>
                <div className="detail-info">
                  <div className="detail-label">Distance</div>
                  <div className="detail-value">{calculateDistance(order.deliveryInfo?.stationName)} km</div>
                </div>
              </div>

              <div className="detail-row">
                <span className="detail-icon">⏱️</span>
                <div className="detail-info">
                  <div className="detail-label">ETA</div>
                  <div className="detail-value">{calculateETA(order.deliveryInfo?.stationName)}</div>
                </div>
              </div>

              <div className="detail-row">
                <span className="detail-icon">👤</span>
                <div className="detail-info">
                  <div className="detail-label">Customer</div>
                  <div className="detail-value">{order.deliveryInfo?.contactName}</div>
                </div>
              </div>

              <div className="detail-row">
                <span className="detail-icon">💰</span>
                <div className="detail-info">
                  <div className="detail-label">Order Total</div>
                  <div className="detail-value">₹{((order.totals?.finalCents || 0) / 100).toFixed(2)}</div>
                </div>
              </div>
            </div>

            <div className="items-preview">
              <div className="preview-label">Order Items:</div>
              <div className="preview-items">
                {order.items?.slice(0, 4).map((item, index) => (
                  <div key={index} className="preview-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">×{item.qty}</span>
                  </div>
                ))}
                {order.items?.length > 4 && (
                  <div className="more-items">+{order.items.length - 4} more items</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="btn btn-danger btn-lg"
            onClick={() => onDecline('Driver declined')}
          >
            ❌ Decline
          </button>
          <button 
            className="btn btn-success btn-lg"
            onClick={onAccept}
          >
            ✅ Accept Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingJobModal;
