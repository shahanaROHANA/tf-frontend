import React, { useState } from 'react';
import OrderOTPModal from './OrderOTPModal';

const ActiveDeliveryCard = ({ order, onUpdateStatus }) => {
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'OUT_FOR_DELIVERY': '#007bff',
      'PICKED_UP': '#28a745',
      'REACHED_STATION': '#ffc107',
      'DELIVERED': '#6c757d'
    };
    return colors[status] || '#6c757d';
  };

  const getStatusText = (status) => {
    const texts = {
      'OUT_FOR_DELIVERY': 'Out for Delivery',
      'PICKED_UP': 'Order Picked Up',
      'REACHED_STATION': 'Reached Station',
      'DELIVERED': 'Delivered'
    };
    return texts[status] || status;
  };

  const handleStatusUpdate = async (status, proof = null, station = null) => {
    setLoading(true);
    try {
      await onUpdateStatus(status, proof, station);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    const { deliveryInfo } = order;
    if (deliveryInfo?.stationName) {
      // Open Google Maps with station name
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(deliveryInfo.stationName + ' railway station')}`;
      window.open(mapsUrl, '_blank');
    }
  };

  const getETA = () => {
    // Simple ETA calculation based on station
    const stationETAs = {
      'colombo': '0 min',
      'maradana': '10 min',
      'dematagoda': '15 min',
      'kelaniya': '25 min',
      'ragama': '40 min'
    };
    
    const station = order.deliveryInfo?.stationName?.toLowerCase();
    return stationETAs[station] || 'Unknown';
  };

  const canPickUp = order.status === 'OUT_FOR_DELIVERY';
  const canReachStation = order.status === 'PICKED_UP';
  const canDeliver = order.status === 'REACHED_STATION';

  return (
    <div className="delivery-card active-delivery-card">
      <div className="active-delivery-header">
        <div className="order-info">
          <h2>📦 Order #{order.orderNumber}</h2>
          <div 
            className="status-indicator"
            style={{ backgroundColor: getStatusColor(order.status) }}
          >
            {getStatusText(order.status)}
          </div>
        </div>
        <div className="eta-info">
          <div className="eta-label">ETA</div>
          <div className="eta-time">{getETA()}</div>
        </div>
      </div>

      <div className="delivery-route">
        <div className="route-point pickup">
          <div className="point-icon">🏪</div>
          <div className="point-info">
            <div className="point-label">Pickup</div>
            <div className="point-details">
              {order.items?.[0]?.seller?.name || 'Restaurant'}
            </div>
            <div className="point-time">
              {formatTime(order.timestamps?.readyForPickupAt || order.createdAt)}
            </div>
          </div>
        </div>

        <div className="route-line"></div>

        <div className="route-point delivery">
          <div className="point-icon">🚆</div>
          <div className="point-info">
            <div className="point-label">Delivery</div>
            <div className="point-details">
              {order.deliveryInfo?.stationName} - {order.deliveryInfo?.coach} Coach, Seat {order.deliveryInfo?.seat}
            </div>
            <div className="point-details">
              📞 {order.deliveryInfo?.contactPhone}
            </div>
            {order.deliveryInfo?.trainNo && (
              <div className="point-details">
                🚂 Train {order.deliveryInfo.trainNo}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="order-items-summary">
        <h4>Order Items ({order.items?.length || 0})</h4>
        <div className="items-list">
          {order.items?.map((item, index) => (
            <div key={index} className="item-summary">
              <span className="item-name">{item.name}</span>
              <span className="item-qty">x{item.qty}</span>
            </div>
          ))}
        </div>
        <div className="order-total">
          Total: ₹{((order.totals?.finalCents || 0) / 100).toFixed(2)}
        </div>
      </div>

      <div className="delivery-actions">
        <button 
          className="btn btn-outline nav-btn"
          onClick={handleNavigate}
        >
          🗺️ Navigate
        </button>

        {canPickUp && (
          <button 
            className="btn btn-success btn-lg"
            onClick={() => handleStatusUpdate('PICKED_UP')}
            disabled={loading}
          >
            📦 Picked Up
          </button>
        )}

        {canReachStation && (
          <button 
            className="btn btn-warning btn-lg"
            onClick={() => handleStatusUpdate('REACHED_STATION', null, order.deliveryInfo?.stationName)}
            disabled={loading}
          >
            🚉 Reached Station
          </button>
        )}

        {canDeliver && (
          <button 
            className="btn btn-success btn-lg"
            onClick={() => setShowOTPModal(true)}
            disabled={loading}
          >
            ✅ Deliver
          </button>
        )}
      </div>

      {showOTPModal && (
        <OrderOTPModal
          orderId={order._id}
          onClose={() => setShowOTPModal(false)}
          onConfirm={(proof) => {
            handleStatusUpdate('DELIVERED', proof);
            setShowOTPModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ActiveDeliveryCard;
