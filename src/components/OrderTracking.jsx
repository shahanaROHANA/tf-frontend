import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrderTracking.css';

const OrderTracking = ({ orderId: propOrderId, onBack }) => {
  const { id: paramOrderId } = useParams();
  const navigate = useNavigate();
  const orderId = propOrderId || paramOrderId;

  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [showRatingForm, setShowRatingForm] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
      // Set up polling for real-time updates (every 30 seconds)
      const interval = setInterval(fetchOrderDetails, 30000);
      return () => clearInterval(interval);
    } else {
      fetchUserOrders();
    }
  }, [orderId]);

  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/orders/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOrders(response.data.orders || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOrder(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}/cancel`,
        { reason: 'User requested cancellation' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrder(response.data.order);
      alert('Order cancelled successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  const handleRateOrder = async () => {
    if (rating < 1 || rating > 5) {
      alert('Please select a rating between 1 and 5');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}/rate`,
        { rating, review },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrder(response.data.order);
      setShowRatingForm(false);
      alert('Thank you for rating!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to rate order');
    }
  };

  const viewOrderDetails = (selectedOrderId) => {
    navigate(`/orders/${selectedOrderId}`);
  };

  const viewTrainSchedule = (selectedOrderId) => {
    navigate(`/orders/${selectedOrderId}/tracking`);
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': '#ffc107',
      'CONFIRMED': '#17a2b8',
      'PREPARING': '#6f42c1',
      'READY_FOR_PICKUP': '#fd7e14',
      'OUT_FOR_DELIVERY': '#6610f2',
      'DELIVERED': '#28a745',
      'CANCELLED': '#dc3545',
      'REJECTED': '#dc3545',
      'RETURNED': '#6c757d',
      'FAILED_PAYMENT': '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  const formatPrice = (cents) => {
    return (cents / 100).toFixed(2);
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const canCancel = () => {
    return order && ['PENDING', 'CONFIRMED'].includes(order.status);
  };

  const canRate = () => {
    return order && order.status === 'DELIVERED' && !order.rating;
  };

  const getStatusSteps = () => {
    const steps = [
      { key: 'PENDING', label: 'Order Placed', icon: '📝' },
      { key: 'CONFIRMED', label: 'Confirmed', icon: '✅' },
      { key: 'PREPARING', label: 'Preparing', icon: '👨‍🍳' },
      { key: 'READY_FOR_PICKUP', label: 'Ready', icon: '📦' },
      { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: '🚚' },
      { key: 'DELIVERED', label: 'Delivered', icon: '✅' }
    ];

    const currentStepIndex = steps.findIndex(step => step.key === order?.status);
    
    return steps.map((step, index) => ({
      ...step,
      active: index <= currentStepIndex,
      current: index === currentStepIndex
    }));
  };

  if (loading) {
    return (
      <div className="order-tracking-loading">
        <div className="loading-spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-tracking-error">
        <div className="error-icon">⚠️</div>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={onBack} className="back-btn">Go Back</button>
      </div>
    );
  }

  // Show orders list if no specific order ID
  if (!orderId) {
    return (
      <div className="orders-list-page">
        <div className="orders-header">
          <h1>📦 My Orders</h1>
        </div>

        {loading ? (
          <div className="loading-spinner"></div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : orders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">📦</div>
            <h2>No Orders Yet</h2>
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <h3>Order #{order.orderNumber}</h3>
                  <div className="order-status" style={{ backgroundColor: getStatusColor(order.status) }}>
                    {order.statusDisplay || order.status}
                  </div>
                </div>
                <div className="order-card-body">
                  <p><strong>Date:</strong> {formatTime(order.createdAt)}</p>
                  <p><strong>Total:</strong> ₹{formatPrice(order.totals?.finalCents || 0)}</p>
                  {order.deliveryInfo?.trainNo && (
                    <p><strong>Train:</strong> {order.deliveryInfo.trainNo}</p>
                  )}
                </div>
                <div className="order-card-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => viewOrderDetails(order._id)}
                  >
                    View Details
                  </button>
                  {order.deliveryInfo?.type === 'train' && (
                    <button
                      className="btn btn-secondary"
                      onClick={() => viewTrainSchedule(order._id)}
                    >
                      🚂 Track Train
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <style jsx>{`
          .orders-list-page {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
          }

          .orders-header {
            text-align: center;
            margin-bottom: 2rem;
          }

          .orders-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
          }

          .order-card {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
          }

          .order-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }

          .order-card-header h3 {
            margin: 0;
            color: #2d3748;
          }

          .order-status {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            color: white;
            font-size: 0.8rem;
            font-weight: 600;
          }

          .order-card-body p {
            margin: 0.5rem 0;
            color: #4a5568;
          }

          .order-card-actions {
            margin-top: 1rem;
            display: flex;
            gap: 0.5rem;
          }

          .btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            text-decoration: none;
            display: inline-block;
            text-align: center;
          }

          .btn-primary {
            background: #667eea;
            color: white;
          }

          .btn-secondary {
            background: #e2e8f0;
            color: #4a5568;
          }

          .no-orders {
            text-align: center;
            padding: 3rem;
          }

          .no-orders-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }
        `}</style>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-tracking-error">
        <div className="error-icon">📦</div>
        <h2>Order Not Found</h2>
        <p>The order you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/orders')} className="back-btn">Back to Orders</button>
      </div>
    );
  }

  return (
    <div className="order-tracking">
      <div className="order-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <div className="order-info">
          <h1>Order #{order.orderNumber}</h1>
          <div className="order-status" style={{ backgroundColor: getStatusColor(order.status) }}>
            {order.statusDisplay || order.status}
          </div>
        </div>
        <div className="order-actions">
          {order.deliveryInfo?.type === 'train' && (
            <button onClick={() => viewTrainSchedule(orderId)} className="track-btn">
              🚂 Track Train
            </button>
          )}
          {canCancel() && (
            <button onClick={handleCancelOrder} className="cancel-btn">
              Cancel Order
            </button>
          )}
          {canRate() && (
            <button onClick={() => setShowRatingForm(true)} className="rate-btn">
              Rate Order
            </button>
          )}
        </div>
      </div>

      <div className="order-content">
        <div className="order-main">
          {/* Order Status Timeline */}
          <div className="status-timeline">
            <h2>Order Status</h2>
            <div className="timeline">
              {getStatusSteps().map((step, index) => (
                <div key={step.key} className={`timeline-item ${step.active ? 'active' : ''} ${step.current ? 'current' : ''}`}>
                  <div className="timeline-icon">{step.icon}</div>
                  <div className="timeline-content">
                    <h3>{step.label}</h3>
                    {step.current && order.estimatedDeliveryTime && (
                      <p className="eta">ETA: {formatTime(order.estimatedDeliveryTime)}</p>
                    )}
                  </div>
                  {index < getStatusSteps().length - 1 && <div className="timeline-line"></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="order-items">
            <h2>Order Items</h2>
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>Quantity: {item.qty}</p>
                  <p>Price: ₹{formatPrice(item.priceCents)} each</p>
                  {item.itemNote && <p className="item-note">Note: {item.itemNote}</p>}
                  {item.options && item.options.length > 0 && (
                    <div className="item-options">
                      {item.options.map((option, optIndex) => (
                        <span key={optIndex} className="option-tag">
                          {option.name}: {option.value}
                          {option.priceCents && ` (+₹{formatPrice(option.priceCents)})`}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="item-seller">Sold by: {item.seller?.name || 'Restaurant'}</p>
                </div>
                <div className="item-total">
                  ₹{formatPrice(item.priceCents * item.qty)}
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Information */}
          <div className="delivery-info">
            <h2>Delivery Information</h2>
            <div className="delivery-details">
              <div className="delivery-type">
                <span className="type-label">Type:</span>
                <span className="type-value">
                  {order.deliveryInfo.type === 'train' && '🚂 Train Delivery'}
                  {order.deliveryInfo.type === 'station' && '🚉 Station Pickup'}
                  {order.deliveryInfo.type === 'home' && '🏠 Home Delivery'}
                </span>
              </div>
              
              <div className="contact-info">
                <h4>Contact Information</h4>
                <p><strong>Name:</strong> {order.deliveryInfo.contactName}</p>
                <p><strong>Phone:</strong> {order.deliveryInfo.contactPhone}</p>
              </div>

              {order.deliveryInfo.type === 'train' && (
                <div className="train-delivery-info">
                  <h4>Train Details</h4>
                  <p><strong>Train Number:</strong> {order.deliveryInfo.trainNo}</p>
                  {order.deliveryInfo.trainName && (
                    <p><strong>Train Name:</strong> {order.deliveryInfo.trainName}</p>
                  )}
                  <p><strong>Coach:</strong> {order.deliveryInfo.coach}</p>
                  <p><strong>Seat:</strong> {order.deliveryInfo.seat}</p>
                  {order.deliveryInfo.departureTime && (
                    <p><strong>Departure:</strong> {formatTime(order.deliveryInfo.departureTime)}</p>
                  )}
                </div>
              )}

              {order.deliveryInfo.type === 'station' && (
                <div className="station-pickup-info">
                  <h4>Station Pickup</h4>
                  <p><strong>Station:</strong> {order.deliveryInfo.stationName}</p>
                  {order.deliveryInfo.platform && (
                    <p><strong>Platform:</strong> {order.deliveryInfo.platform}</p>
                  )}
                </div>
              )}

              {order.deliveryInfo.type === 'home' && (
                <div className="home-delivery-info">
                  <h4>Delivery Address</h4>
                  <p><strong>Address:</strong> {order.deliveryInfo.address}</p>
                  {order.deliveryInfo.landmark && (
                    <p><strong>Landmark:</strong> {order.deliveryInfo.landmark}</p>
                  )}
                </div>
              )}

              {order.deliveryInfo.specialInstructions && (
                <div className="special-instructions">
                  <h4>Special Instructions</h4>
                  <p>{order.deliveryInfo.specialInstructions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order History */}
          <div className="order-history">
            <h2>Order History</h2>
            <div className="history-timeline">
              {order.history && order.history.length > 0 ? (
                order.history.map((event, index) => (
                  <div key={index} className="history-item">
                    <div className="history-time">{formatTime(event.at)}</div>
                    <div className="history-status">{event.status}</div>
                    {event.note && <div className="history-note">{event.note}</div>}
                  </div>
                ))
              ) : (
                <p>No history available</p>
              )}
            </div>
          </div>
        </div>

        <div className="order-sidebar">
          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{formatPrice(order.totals.subtotalCents)}</span>
            </div>
            {order.totals.discountCents > 0 && (
              <div className="summary-row discount">
                <span>Discount:</span>
                <span>-₹{formatPrice(order.totals.discountCents)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Tax:</span>
              <span>₹{formatPrice(order.totals.taxCents)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery:</span>
              <span>₹{formatPrice(order.totals.deliveryCents)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{formatPrice(order.totals.finalCents)}</span>
            </div>
          </div>

          {/* Payment Information */}
          <div className="payment-info">
            <h2>Payment Information</h2>
            <div className="payment-details">
              <p><strong>Method:</strong> {order.payment.method}</p>
              <p><strong>Status:</strong> {order.payment.status}</p>
              {order.payment.paidAt && (
                <p><strong>Paid At:</strong> {formatTime(order.payment.paidAt)}</p>
              )}
            </div>
          </div>

          {/* Driver Information (if assigned) */}
          {order.assignedDriver && (
            <div className="driver-info">
              <h2>Delivery Partner</h2>
              <div className="driver-details">
                <p><strong>Name:</strong> {order.assignedDriver.name}</p>
                <p><strong>Phone:</strong> {order.assignedDriver.phone}</p>
              </div>
            </div>
          )}

          {/* Rating (if delivered) */}
          {order.rating && (
            <div className="rating-display">
              <h2>Your Rating</h2>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} className={star <= order.rating ? 'star filled' : 'star'}>
                    ⭐
                  </span>
                ))}
              </div>
              {order.review && <p className="review-text">{order.review}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingForm && (
        <div className="rating-modal">
          <div className="rating-modal-content">
            <h2>Rate Your Order</h2>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  className={`star-button ${star <= rating ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                >
                  ⭐
                </button>
              ))}
            </div>
            <textarea
              placeholder="Share your experience (optional)"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="review-textarea"
            />
            <div className="rating-modal-actions">
              <button onClick={() => setShowRatingForm(false)} className="cancel-rating-btn">
                Cancel
              </button>
              <button onClick={handleRateOrder} className="submit-rating-btn">
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
