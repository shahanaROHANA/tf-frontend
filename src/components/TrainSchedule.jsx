import { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderTracking.css'; // Reuse styles

const TrainSchedule = ({ orderId, onBack }) => {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  useEffect(() => {
    fetchTrackingData();

    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(fetchTrackingData, 30000);

    return () => clearInterval(interval);
  }, [orderId]);

  const fetchTrackingData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/orders/${orderId}/tracking`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTrackingData(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tracking data');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationToggle = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/orders/notifications`, {
        orderId,
        type: 'email',
        timeOffset: 10 // 10 minutes before
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotificationEnabled(!notificationEnabled);
      alert(notificationEnabled ? 'Notification disabled' : 'Notification enabled for 10 min before arrival');
    } catch (err) {
      alert('Failed to update notification settings');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#ffc107',
      'Preparing': '#17a2b8',
      'Ready': '#fd7e14',
      'PickedUp': '#6610f2',
      'Delivered': '#28a745'
    };
    return colors[status] || '#6c757d';
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTimeUntilNext = () => {
    if (!trackingData?.schedule) return null;

    const nextStop = trackingData.schedule.find(stop => stop.status === 'upcoming');
    if (!nextStop) return null;

    const now = new Date();
    const arrival = new Date(nextStop.arrival);
    const diffMs = arrival - now;

    if (diffMs <= 0) return 'Arriving now';

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="order-tracking-loading">
        <div className="loading-spinner"></div>
        <p>Loading train schedule...</p>
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

  if (!trackingData) {
    return (
      <div className="order-tracking-error">
        <div className="error-icon">🚂</div>
        <h2>No Schedule Data</h2>
        <p>Train schedule information is not available.</p>
        <button onClick={onBack} className="back-btn">Go Back</button>
      </div>
    );
  }

  return (
    <div className="order-tracking">
      <div className="order-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <div className="order-info">
          <h1>🚂 Train Schedule</h1>
          <div className="order-meta">
            Order #{trackingData.orderId.slice(-8)} • Train {trackingData.trainNo}
          </div>
        </div>
      </div>

      <div className="order-content">
        {/* Order Summary */}
        <div className="order-summary-card">
          <h2>📋 Order Summary</h2>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="label">Order ID:</span>
              <span className="value">{trackingData.orderId.slice(-8)}</span>
            </div>
            <div className="summary-item">
              <span className="label">Train No:</span>
              <span className="value">{trackingData.trainNo}</span>
            </div>
            <div className="summary-item">
              <span className="label">Your Station:</span>
              <span className="value">{trackingData.station}</span>
            </div>
            <div className="summary-item">
              <span className="label">Status:</span>
              <span className="status-badge" style={{ backgroundColor: getStatusColor(trackingData.order.status) }}>
                {trackingData.order.status}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline / Vertical Stepper */}
        <div className="status-timeline train-timeline">
          <h2>🚉 Train Route</h2>
          <div className="timeline">
            {trackingData.schedule.map((stop, index) => (
              <div key={index} className={`timeline-item ${stop.status}`}>
                <div className="timeline-icon">
                  {stop.status === 'passed' ? '✅' : stop.status === 'upcoming' ? '⏳' : '🚂'}
                </div>
                <div className="timeline-content">
                  <h3>{stop.station}</h3>
                  <div className="station-times">
                    <p>Arrival: {formatTime(stop.arrival)}</p>
                    {index < trackingData.schedule.length - 1 && (
                      <p>Departure: {formatTime(trackingData.schedule[index + 1]?.arrival)}</p>
                    )}
                  </div>
                  {stop.station === trackingData.station && (
                    <div className="pickup-info">
                      <p className="eta">📦 Pickup ETA: {formatTime(trackingData.estimatedPickup)}</p>
                      <p className="prep-time">⏱️ Prep Time: {trackingData.order.prepTimeMinutes} min</p>
                    </div>
                  )}
                </div>
                {index < trackingData.schedule.length - 1 && <div className="timeline-line"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Live Clock */}
        <div className="live-clock-section">
          <h2>⏰ Live Updates</h2>
          <div className="clock-display">
            <div className="next-station">
              <h3>Next Station: {trackingData.schedule.find(s => s.status === 'upcoming')?.station || 'N/A'}</h3>
              <div className="countdown">Time until arrival: {getTimeUntilNext()}</div>
            </div>
          </div>
        </div>

        {/* Notification Button */}
        <div className="notification-section">
          <button
            className={`notification-btn ${notificationEnabled ? 'enabled' : ''}`}
            onClick={handleNotificationToggle}
          >
            {notificationEnabled ? '🔔' : '🔕'} Notify me 10 min before arrival
          </button>
        </div>

        {/* Status History */}
        <div className="order-history">
          <h2>📊 Order Status History</h2>
          <div className="history-timeline">
            {trackingData.order.statusHistory && trackingData.order.statusHistory.length > 0 ? (
              trackingData.order.statusHistory.map((event, index) => (
                <div key={index} className="history-item">
                  <div className="history-time">{formatTime(event.time)}</div>
                  <div className="history-status" style={{ color: getStatusColor(event.status) }}>
                    {event.status}
                  </div>
                </div>
              ))
            ) : (
              <p>No status history available</p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .order-summary-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .summary-item:last-child {
          border-bottom: none;
        }

        .label {
          font-weight: 500;
          color: #4a5568;
        }

        .value {
          font-weight: 600;
          color: #2d3748;
        }

        .train-timeline .timeline-item {
          position: relative;
        }

        .station-times {
          font-size: 0.9rem;
          color: #718096;
          margin: 0.5rem 0;
        }

        .pickup-info {
          background: #e6fffa;
          border: 1px solid #b2f5ea;
          border-radius: 6px;
          padding: 0.75rem;
          margin-top: 0.5rem;
        }

        .eta {
          color: #38a169;
          font-weight: 600;
          margin: 0 0 0.25rem 0;
        }

        .prep-time {
          color: #4a5568;
          margin: 0;
        }

        .live-clock-section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
          text-align: center;
        }

        .clock-display {
          margin-top: 1rem;
        }

        .next-station h3 {
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .countdown {
          font-size: 1.5rem;
          font-weight: 600;
          color: #e53e3e;
        }

        .notification-section {
          text-align: center;
          margin-bottom: 2rem;
        }

        .notification-btn {
          background: #edf2f7;
          border: 2px solid #e2e8f0;
          border-radius: 25px;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .notification-btn.enabled {
          background: #c6f6d5;
          border-color: #9ae6b4;
          color: #22543d;
        }

        .history-timeline {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .history-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #f8f9fa;
          border-radius: 6px;
          border-left: 4px solid #667eea;
        }

        .history-time {
          font-weight: 500;
          color: #4a5568;
        }

        .history-status {
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .summary-grid {
            grid-template-columns: 1fr;
          }

          .summary-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default TrainSchedule;