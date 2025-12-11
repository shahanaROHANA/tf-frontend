import React, { useState, useEffect } from 'react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate fetching notifications
    const mockNotifications = [
      {
        id: 1,
        type: 'new_order',
        title: 'New Order Received',
        message: 'Order #ORD123456 for 2 items - Masala Dosa and Sambar',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        priority: 'high'
      },
      {
        id: 2,
        type: 'admin_message',
        title: 'Admin Message',
        message: 'Please update your menu prices for the upcoming festival season',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        priority: 'medium'
      },
      {
        id: 3,
        type: 'system_update',
        title: 'System Update',
        message: 'New features added to your seller dashboard',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: true,
        priority: 'low'
      },
      {
        id: 4,
        type: 'order_completed',
        title: 'Order Completed',
        message: 'Order #ORD123450 has been delivered successfully',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        read: true,
        priority: 'low'
      },
      {
        id: 5,
        type: 'payment_received',
        title: 'Payment Received',
        message: 'Weekly payout of ₹12,500 has been processed',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        read: true,
        priority: 'medium'
      }
    ];

    setNotifications(mockNotifications);
    setLoading(false);
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setMessage('Notification marked as read');
    } catch (error) {
      setMessage('Error updating notification');
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      setMessage('All notifications marked as read');
    } catch (error) {
      setMessage('Error updating notifications');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      setMessage('Notification deleted');
    } catch (error) {
      setMessage('Error deleting notification');
    }
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'orders':
        return notifications.filter(n => n.type === 'new_order' || n.type === 'order_completed');
      case 'admin':
        return notifications.filter(n => n.type === 'admin_message');
      case 'system':
        return notifications.filter(n => n.type === 'system_update' || n.type === 'payment_received');
      default:
        return notifications;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_order': return '📦';
      case 'order_completed': return '✅';
      case 'admin_message': return '👨‍💼';
      case 'system_update': return '🔄';
      case 'payment_received': return '💰';
      default: return '📬';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#f56565';
      case 'medium': return '#ed8936';
      case 'low': return '#48bb78';
      default: return '#718096';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="notifications">
        <div className="card">
          <div className="text-center p-4">
            <div className="loading-spinner"></div>
            <p>Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            📬 Notifications 
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </h2>
          <div className="header-actions">
            <select 
              className="form-control"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ width: '150px', marginRight: '1rem' }}
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="orders">Orders</option>
              <option value="admin">Admin</option>
              <option value="system">System</option>
            </select>
            {unreadCount > 0 && (
              <button className="btn btn-secondary" onClick={markAllAsRead}>
                ✅ Mark All Read
              </button>
            )}
          </div>
        </div>

        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}

        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="text-center p-4">
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>No notifications</h3>
                <p>
                  {filter === 'unread' 
                    ? 'You have no unread notifications' 
                    : 'No notifications found'}
                </p>
              </div>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${!notification.read ? 'unread' : ''}`}
              >
                <div className="notification-content">
                  <div className="notification-header">
                    <div className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-info">
                      <h4>{notification.title}</h4>
                      <div className="notification-meta">
                        <span className="timestamp">
                          🕐 {formatTimestamp(notification.timestamp)}
                        </span>
                        <span 
                          className="priority-indicator"
                          style={{ color: getPriorityColor(notification.priority) }}
                        >
                          ●
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="notification-message">
                    {notification.message}
                  </p>
                </div>
                
                <div className="notification-actions">
                  {!notification.read && (
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => markAsRead(notification.id)}
                    >
                      ✅ Mark Read
                    </button>
                  )}
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteNotification(notification.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Notification Settings */}
        <div className="notification-settings">
          <h3>⚙️ Notification Settings</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <label className="form-label">
                <input type="checkbox" defaultChecked />
                New order notifications
              </label>
            </div>
            <div className="setting-item">
              <label className="form-label">
                <input type="checkbox" defaultChecked />
                Order status updates
              </label>
            </div>
            <div className="setting-item">
              <label className="form-label">
                <input type="checkbox" defaultChecked />
                Admin messages
              </label>
            </div>
            <div className="setting-item">
              <label className="form-label">
                <input type="checkbox" defaultChecked />
                Payment notifications
              </label>
            </div>
            <div className="setting-item">
              <label className="form-label">
                <input type="checkbox" defaultChecked />
                System updates
              </label>
            </div>
            <div className="setting-item">
              <label className="form-label">
                <input type="checkbox" />
                Daily summary emails
              </label>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .unread-badge {
          background: #f56565;
          color: white;
          border-radius: 12px;
          padding: 0.25rem 0.75rem;
          font-size: 0.8rem;
          font-weight: 600;
          margin-left: 0.5rem;
        }

        .header-actions {
          display: flex;
          align-items: center;
        }

        .notifications-list {
          margin-bottom: 2rem;
        }

        .notification-item {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
          border-left: 4px solid transparent;
        }

        .notification-item.unread {
          background: #f0f9ff;
          border-left-color: #4299e1;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .notification-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .notification-content {
          flex: 1;
        }

        .notification-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .notification-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .notification-info {
          flex: 1;
        }

        .notification-info h4 {
          margin: 0 0 0.5rem 0;
          color: #2d3748;
          font-size: 1.1rem;
        }

        .notification-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .timestamp {
          color: #718096;
          font-size: 0.9rem;
        }

        .priority-indicator {
          font-size: 1.2rem;
          font-weight: bold;
        }

        .notification-message {
          color: #4a5568;
          margin: 0;
          line-height: 1.5;
        }

        .notification-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .empty-state {
          text-align: center;
          padding: 2rem;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-state h3 {
          margin: 0 0 0.5rem 0;
          color: #4a5568;
        }

        .empty-state p {
          margin: 0;
          color: #718096;
        }

        .notification-settings {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .setting-item {
          background: white;
          padding: 1rem;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }

        .setting-item label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          margin: 0;
          color: #2d3748;
        }

        .setting-item input[type="checkbox"] {
          margin: 0;
        }

        @media (max-width: 768px) {
          .header-actions {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .notification-header {
            flex-direction: column;
            gap: 0.5rem;
          }

          .notification-actions {
            flex-direction: column;
          }

          .settings-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Notifications;
