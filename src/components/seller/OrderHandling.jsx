import React, { useState, useEffect } from 'react';
import { api } from '../../utils/authUtils.js';

const OrderHandling = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingItem, setUpdatingItem] = useState(null);

  useEffect(() => {
    // Check if seller is authenticated before making API calls
    const token = localStorage.getItem('sellerToken') || localStorage.getItem('token');
    if (!token) {
      setMessage('Please login to view orders');
      setOrders([]);
      setLoading(false);
      return;
    }
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const queryParams = new URLSearchParams();
      
      if (statusFilter !== 'all') {
        queryParams.append('status', statusFilter);
      }

      const response = await api.get(`/seller/dashboard/orders?${queryParams}`);
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setMessage('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  const updateItemStatus = async (orderId, itemId, newStatus, note = '') => {
    setUpdatingItem(itemId);
    setMessage('');

    try {
      const response = await api.post('/seller/dashboard/item/update', {
        orderId,
        itemId,
        itemStatus: newStatus,
        itemNote: note
      });

      setMessage('Item status updated successfully!');
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating item status:', error);
      setMessage(error.response?.data?.message || 'Failed to update item status');
    } finally {
      setUpdatingItem(null);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setMessage('');

    try {
      const response = await api.put(`/orders/${orderId}/status-tracking`, {
        status: newStatus
      });

      setMessage('Order status updated successfully!');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      setMessage(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'accepted': return 'status-accepted';
      case 'preparing': return 'status-preparing';
      case 'ready': return 'status-ready';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const formatPrice = (cents) => {
    return `₹${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getNextStatuses = (currentStatus) => {
    const statusFlow = {
      'pending': ['accepted', 'cancelled'],
      'accepted': ['preparing', 'cancelled'],
      'preparing': ['ready'],
      'ready': ['delivered'],
      'delivered': [],
      'cancelled': []
    };
    return statusFlow[currentStatus] || [];
  };

  if (loading) {
    return (
      <div className="order-handling">
        <div className="card">
          <div className="text-center p-4">
            <div className="loading-spinner"></div>
            <p>Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-handling">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🚚 Order Handling</h2>
          <div className="order-stats">
            <span className="stat-badge">
              📦 Total: {orders.length}
            </span>
            <span className="stat-badge">
              ⏳ Pending: {orders.filter(o => o.items.some(i => i.itemStatus === 'pending')).length}
            </span>
          </div>
        </div>

        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}

        {/* Status Filter */}
        <div className="filters-section">
          <div className="form-group">
            <label className="form-label">Filter by Status</label>
            <select 
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="orders-list">
          {orders.length === 0 ? (
            <div className="text-center p-4">
              <p>No orders found.</p>
            </div>
          ) : (
            orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h4>Order #{order._id.slice(-8)}</h4>
                    <p className="customer-info">
                      👤 {order.user?.name} ({order.user?.email})
                    </p>
                    <p className="order-meta">
                      🚆 Train: {order.trainNumber || order.deliveryInfo?.trainNo || 'N/A'} |
                      📍 Station: {order.station || order.deliveryInfo?.stationName || 'N/A'} |
                      🕐 {formatDate(order.createdAt)}
                    </p>
                    {order.expectedReadyAt && (
                      <p className="order-meta">
                        ⏰ Prepare by: {formatDate(order.expectedReadyAt)} |
                        📦 Station Pickup: {order.station || order.deliveryInfo?.stationName || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div className="order-total">
                    <strong>{formatPrice(order.totalCents)}</strong>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map(item => (
                    <div key={item._id} className="order-item">
                      <div className="item-details">
                        <div className="item-info">
                          <h5>{item.product?.name || 'Unknown Product'}</h5>
                          <p>Quantity: {item.quantity} × {formatPrice(item.priceCents)}</p>
                          {item.itemNote && (
                            <p className="item-note">📝 {item.itemNote}</p>
                          )}
                        </div>
                        <div className="item-status">
                          <span className={`status-badge ${getStatusColor(item.itemStatus)}`}>
                            {item.itemStatus}
                          </span>
                        </div>
                      </div>
                      
                      <div className="item-actions">
                        {getNextStatuses(item.itemStatus).map(nextStatus => (
                          <button
                            key={nextStatus}
                            className={`btn btn-sm ${
                              nextStatus === 'cancelled' ? 'btn-danger' : 
                              nextStatus === 'delivered' ? 'btn-success' : 'btn-primary'
                            }`}
                            onClick={() => updateItemStatus(order._id, item._id, nextStatus)}
                            disabled={updatingItem === item._id}
                          >
                            {updatingItem === item._id ? (
                              <span className="loading-spinner"></span>
                            ) : (
                              <>
                                {nextStatus === 'accepted' && '✅ Accept'}
                                {nextStatus === 'preparing' && '👨‍🍳 Start Preparing'}
                                {nextStatus === 'ready' && '✅ Mark Ready'}
                                {nextStatus === 'delivered' && '🚚 Mark Delivered'}
                                {nextStatus === 'cancelled' && '❌ Cancel'}
                              </>
                            )}
                          </button>
                        ))}
                        
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                        >
                          📋 Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Status Update */}
                {order.deliveryInfo?.type === 'train' && (
                  <div className="order-status-update">
                    <h5>Update Order Status</h5>
                    <div className="status-buttons">
                      {['Preparing', 'Ready'].map(status => (
                        <button
                          key={status}
                          className={`btn btn-sm ${
                            status === 'Ready' ? 'btn-success' : 'btn-warning'
                          }`}
                          onClick={() => updateOrderStatus(order._id, status)}
                        >
                          {status === 'Preparing' ? '👨‍🍳 Start Preparing' : '✅ Mark Ready'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order Details Expandable */}
                {selectedOrder?._id === order._id && (
                  <div className="order-details-expanded">
                    <div className="detail-section">
                      <h5>📋 Order Details</h5>
                      <p><strong>Order ID:</strong> {order._id}</p>
                      <p><strong>Customer:</strong> {order.user?.name} ({order.user?.email})</p>
                      <p><strong>Train:</strong> {order.trainNumber || 'N/A'}</p>
                      <p><strong>Station:</strong> {order.station || 'N/A'}</p>
                      <p><strong>Delivery Time:</strong> {order.deliveryTime || 'N/A'}</p>
                      <p><strong>Order Date:</strong> {formatDate(order.createdAt)}</p>
                      <p><strong>Total Amount:</strong> {formatPrice(order.totalCents)}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        .order-stats {
          display: flex;
          gap: 1rem;
        }

        .stat-badge {
          background: #e2e8f0;
          color: #4a5568;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .filters-section {
          margin-bottom: 2rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .order-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border-left: 4px solid #667eea;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .order-info h4 {
          margin: 0 0 0.5rem 0;
          color: #2d3748;
          font-size: 1.2rem;
        }

        .customer-info {
          margin: 0.25rem 0;
          color: #4a5568;
          font-weight: 500;
        }

        .order-meta {
          margin: 0.5rem 0 0 0;
          color: #718096;
          font-size: 0.9rem;
        }

        .order-total {
          font-size: 1.3rem;
          color: #48bb78;
          font-weight: 600;
        }

        .order-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .order-item {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1rem;
          border: 1px solid #e2e8f0;
        }

        .item-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .item-info h5 {
          margin: 0 0 0.5rem 0;
          color: #2d3748;
        }

        .item-info p {
          margin: 0.25rem 0;
          color: #4a5568;
          font-size: 0.9rem;
        }

        .item-note {
          background: #fff3cd;
          color: #856404;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .item-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .order-details-expanded {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
        }

        .detail-section h5 {
          margin: 0 0 1rem 0;
          color: #2d3748;
        }

        .detail-section p {
          margin: 0.5rem 0;
          color: #4a5568;
        }

        .detail-section strong {
          color: #2d3748;
        }

        @media (max-width: 768px) {
          .order-header {
            flex-direction: column;
            gap: 1rem;
          }

          .item-details {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .item-actions {
            width: 100%;
          }

          .item-actions .btn {
            flex: 1;
            min-width: 0;
          }

          .order-stats {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderHandling;