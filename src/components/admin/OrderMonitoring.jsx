import { useState, useEffect } from 'react';
import { FaShoppingCart, FaFilter, FaTimes, FaEye, FaBan } from 'react-icons/fa';

const OrderMonitoring = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    vendor: '',
    user: '',
    page: 1
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.vendor) params.append('vendor', filters.vendor);
      if (filters.user) params.append('user', filters.user);
      params.append('page', filters.page);
      params.append('limit', 20);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/orders?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setOrders(data.orders);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        total: data.total
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const forceCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL}/admin/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: cancelReason })
      });
      fetchOrders();
      setShowCancelModal(false);
      setCancelReason('');
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'paid': return '#3498db';
      case 'fulfilled': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div className="loading-spinner">Loading orders...</div>;
  }

  return (
    <div className="order-monitoring">
      {/* Header */}
      <div className="admin-card">
        <h2>📦 Order Monitoring</h2>
        
        {/* Filters */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <div className="form-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="form-group">
            <label>Vendor ID</label>
            <input
              type="text"
              placeholder="Enter vendor ID"
              value={filters.vendor}
              onChange={(e) => setFilters({ ...filters, vendor: e.target.value, page: 1 })}
            />
          </div>
          <div className="form-group">
            <label>User ID</label>
            <input
              type="text"
              placeholder="Enter user ID"
              value={filters.user}
              onChange={(e) => setFilters({ ...filters, user: e.target.value, page: 1 })}
            />
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              className="btn btn-secondary"
              onClick={() => setFilters({ status: '', vendor: '', user: '', page: 1 })}
            >
              <FaFilter /> Clear Filters
            </button>
          </div>
        </div>

        {/* Summary */}
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          marginTop: '1rem',
          padding: '1rem',
          background: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <span><strong>Total Orders:</strong> {pagination.total}</span>
          <span><strong>Page:</strong> {pagination.currentPage} of {pagination.totalPages}</span>
        </div>
      </div>

      {/* Orders Table */}
      {orders.length > 0 ? (
        <div className="admin-card">
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders && orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <span style={{ 
                        fontFamily: 'monospace', 
                        fontSize: '0.9rem',
                        background: '#f8f9fa',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px'
                      }}>
                        {order._id.slice(-8)}
                      </span>
                    </td>
                    <td>
                      <div>
                        <strong>{order.user?.name}</strong>
                        <br />
                        <span style={{ fontSize: '0.8rem', color: '#636e72' }}>
                          {order.user?.email}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.9rem' }}>
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        <br />
                        <span style={{ color: '#636e72' }}>
                          {order.items.map(item => item.product?.name).join(', ').slice(0, 30)}
                          {order.items.map(item => item.product?.name).join(', ').length > 30 && '...'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span style={{ 
                        fontWeight: 'bold', 
                        color: '#27ae60',
                        fontSize: '1.1rem'
                      }}>
                        ₹{(order.totalCents / 100).toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ 
                          background: getStatusColor(order.status),
                          color: 'white'
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.9rem' }}>
                        {formatDate(order.createdAt)}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-primary"
                          onClick={() => setSelectedOrder(order)}
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        {order.status !== 'cancelled' && order.status !== 'fulfilled' && (
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowCancelModal(true);
                            }}
                            title="Force Cancel"
                          >
                            <FaBan />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '0.5rem',
              marginTop: '1rem'
            }}>
              <button
                className="btn btn-secondary"
                onClick={() => setFilters({ ...filters, page: pagination.currentPage - 1 })}
                disabled={pagination.currentPage === 1}
              >
                Previous
              </button>
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0 1rem' 
              }}>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                className="btn btn-secondary"
                onClick={() => setFilters({ ...filters, page: pagination.currentPage + 1 })}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No orders found</h3>
          <p>
            {filters.status || filters.vendor || filters.user 
              ? 'No orders match the current filters.' 
              : 'No orders have been placed yet.'}
          </p>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && !showCancelModal && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details</h2>
              <button className="close-modal" onClick={() => setSelectedOrder(null)}>
                ×
              </button>
            </div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '1rem' 
              }}>
                <div>
                  <strong>Order ID:</strong> {selectedOrder._id}
                </div>
                <div>
                  <strong>Status:</strong> 
                  <span 
                    className="status-badge"
                    style={{ 
                      background: getStatusColor(selectedOrder.status),
                      color: 'white',
                      marginLeft: '0.5rem'
                    }}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <strong>Customer:</strong> {selectedOrder.user?.name}
                </div>
                <div>
                  <strong>Email:</strong> {selectedOrder.user?.email}
                </div>
                <div>
                  <strong>Total:</strong> ₹{(selectedOrder.totalCents / 100).toFixed(2)}
                </div>
                <div>
                  <strong>Order Date:</strong> {formatDate(selectedOrder.createdAt)}
                </div>
              </div>

              <div>
                <h4>Order Items:</h4>
                <div style={{ 
                  display: 'grid', 
                  gap: '0.5rem',
                  marginTop: '0.5rem'
                }}>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} style={{ 
                      padding: '0.75rem',
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr',
                      gap: '1rem',
                      alignItems: 'center'
                    }}>
                      <div>
                        <strong>{item.product?.name || 'Unknown Item'}</strong>
                        <br />
                        <span style={{ fontSize: '0.8rem', color: '#636e72' }}>
                          Vendor: {item.seller?.name || 'Unknown'}
                        </span>
                      </div>
                      <div>Qty: {item.qty}</div>
                      <div>₹{(item.priceCents / 100).toFixed(2)}</div>
                      <div>
                        <span 
                          className="status-badge"
                          style={{ 
                            background: getStatusColor(item.itemStatus),
                            color: 'white'
                          }}
                        >
                          {item.itemStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.cancellationReason && (
                <div style={{
                  background: '#ffeaa7',
                  padding: '1rem',
                  borderRadius: '8px',
                  color: '#d63031'
                }}>
                  <strong>Cancellation Reason:</strong> {selectedOrder.cancellationReason}
                </div>
              )}

              {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'fulfilled' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    className="btn btn-danger"
                    onClick={() => setShowCancelModal(true)}
                  >
                    <FaBan /> Force Cancel Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Force Cancel Order</h2>
              <button className="close-modal" onClick={() => setShowCancelModal(false)}>
                ×
              </button>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <p><strong>Order ID:</strong> {selectedOrder._id.slice(-8)}</p>
              <p><strong>Customer:</strong> {selectedOrder.user?.name}</p>
              <p><strong>Total:</strong> ₹{(selectedOrder.totalCents / 100).toFixed(2)}</p>
            </div>
            <form 
              className="admin-form"
              onSubmit={(e) => {
                e.preventDefault();
                forceCancelOrder(selectedOrder._id);
              }}
            >
              <div className="form-group">
                <label>Cancellation Reason</label>
                <textarea 
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please provide a reason for cancelling this order..."
                  rows={4}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelReason('');
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger">
                  Force Cancel Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderMonitoring;
