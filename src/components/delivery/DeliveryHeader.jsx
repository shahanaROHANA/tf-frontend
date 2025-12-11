import React from 'react';

const DeliveryHeader = ({ deliveryInfo, onToggleAvailability, onLogout }) => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <header className="delivery-header">
      <div className="delivery-header-content">
        <div className="delivery-header-left">
          <div className="delivery-profile">
            <div className="delivery-avatar">
              🛵
            </div>
            <div className="delivery-info">
              <h1>{deliveryInfo?.name || 'Delivery Partner'}</h1>
              <div className="delivery-status">
                <span className={`status-badge ${deliveryInfo?.isAvailable ? 'status-available' : 'status-offline'}`}>
                  {deliveryInfo?.isAvailable ? '🟢 Available' : '🔴 Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="delivery-header-center">
          <div className="earnings-quick-card">
            <div className="earnings-label">Today's Earnings</div>
            <div className="earnings-amount">
              ₹{((deliveryInfo?.earnings?.today || 0) / 100).toFixed(2)}
            </div>
          </div>
          <div className="delivery-time">
            <div className="time-label">{formatTime(new Date())}</div>
            <div className="date-label">{formatDate(new Date())}</div>
          </div>
        </div>

        <div className="delivery-header-right">
          <button
            className={`availability-toggle ${deliveryInfo?.isAvailable ? 'available' : 'offline'}`}
            onClick={() => onToggleAvailability(!deliveryInfo?.isAvailable)}
          >
            {deliveryInfo?.isAvailable ? 'Go Offline' : 'Go Online'}
          </button>
          
          <div className="delivery-menu">
            <button className="menu-btn" onClick={onLogout}>
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DeliveryHeader;
