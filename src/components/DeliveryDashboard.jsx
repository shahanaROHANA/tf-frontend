import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeliveryDashboard.css';
import IncomingJobModal from './delivery/IncomingJobModal';
import OrderOTPModal from './delivery/OrderOTPModal';

const DeliveryDashboard = () => {
  const navigate = useNavigate();
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: '',
    phoneNumber: '',
    vehicleType: 'Bike',
    profilePhoto: 'https://via.placeholder.com/80x80/667eea/white?text=DA',
    isOnline: false,
    shiftStatus: 'Offline'
  });

  const [availableOrders, setAvailableOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);

  const [earnings, setEarnings] = useState({
    today: { total: 0, orders: 0, avgPerOrder: 0 },
    week: { total: 0, orders: 0, avgPerOrder: 0 },
    month: { total: 0, orders: 0, avgPerOrder: 0 },
    pendingPayout: 0
  });

  const [ratings, setRatings] = useState({
    average: 0,
    totalReviews: 0,
    recentFeedback: []
  });

  const [completedOrders, setCompletedOrders] = useState([]);

  const [notifications, setNotifications] = useState([]);

  const [activeTab, setActiveTab] = useState('profile');
  const [isOnline, setIsOnline] = useState(false);
  const [shiftStatus, setShiftStatus] = useState('Offline');
  const [showIncomingJobModal, setShowIncomingJobModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [incomingOrder, setIncomingOrder] = useState(null);
  const [currentOrderForOTP, setCurrentOrderForOTP] = useState(null);
  const intervalRef = useRef(null);

  // Load delivery agent information on component mount
  useEffect(() => {
    const loadDeliveryAgentInfo = () => {
      try {
        const deliveryToken = localStorage.getItem('deliveryToken');
        const deliveryInfoStored = localStorage.getItem('deliveryInfo');
        
        if (deliveryToken && deliveryInfoStored) {
          const parsedInfo = JSON.parse(deliveryInfoStored);
          setDeliveryInfo(prev => ({
            ...prev,
            name: parsedInfo.name || 'Delivery Agent',
            phoneNumber: parsedInfo.phone || '',
            vehicleType: parsedInfo.vehicleType || 'Bike'
          }));
        }
      } catch (error) {
        console.error('Error loading delivery agent info:', error);
      }
    };

    loadDeliveryAgentInfo();
  }, []);

  // Fetch real orders assigned to this delivery agent
  useEffect(() => {
    const fetchAssignedOrders = async () => {
      try {
        const token = localStorage.getItem('deliveryToken') || localStorage.getItem('token');
        if (!token) return;

        // Fetch dashboard data (includes active order and basic info)
        const dashboardResponse = await fetch(`${import.meta.env.VITE_API_URL}/delivery/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json();
          setActiveOrder(dashboardData.activeOrder || null);
          
          // Update earnings with dashboard data
          if (dashboardData.delivery?.earnings) {
            setEarnings(prev => ({
              ...prev,
              today: { 
                total: (dashboardData.delivery.earnings.today || 0) / 100, 
                orders: dashboardData.todayDeliveries || 0, 
                avgPerOrder: dashboardData.todayDeliveries > 0 ? ((dashboardData.delivery.earnings.today || 0) / dashboardData.todayDeliveries / 100) : 0 
              },
              week: { ...prev.week },
              month: { ...prev.month },
              pendingPayout: prev.pendingPayout
            }));
          }
        }

        // Fetch available orders for this delivery agent
        const availableResponse = await fetch(`${import.meta.env.VITE_API_URL}/delivery/available-orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (availableResponse.ok) {
          const availableData = await availableResponse.json();
          setAvailableOrders(Array.isArray(availableData) ? availableData : []);
        }

        // Fetch earnings data with today's details
        const earningsResponse = await fetch(`${import.meta.env.VITE_API_URL}/delivery/earnings?period=today`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (earningsResponse.ok) {
          const earningsData = await earningsResponse.json();
          if (earningsData.earnings) {
            setEarnings(prev => ({
              ...prev,
              today: { 
                total: (earningsData.earnings.today || 0) / 100, 
                orders: Math.floor((earningsData.earnings.today || 0) / 300), // Assuming 300 cents per delivery
                avgPerOrder: 3.00 
              },
              week: { 
                total: (earningsData.earnings.total || 0) / 100, 
                orders: earningsData.deliveryCount || 0, 
                avgPerOrder: 3.00 
              },
              month: { 
                total: (earningsData.earnings.total || 0) / 100, 
                orders: earningsData.deliveryCount || 0, 
                avgPerOrder: 3.00 
              },
              pendingPayout: (earningsData.earnings.pending || 0) / 100
            }));
          }
        }

        // Fetch completed orders
        const completedResponse = await fetch(`${import.meta.env.VITE_API_URL}/delivery/orders/my?status=DELIVERED`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (completedResponse.ok) {
          const completedData = await completedResponse.json();
          setCompletedOrders(Array.isArray(completedData) ? completedData.map(order => ({
            id: order._id || order.orderNumber,
            date: new Date(order.createdAt).toLocaleDateString(),
            time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            customer: order.user?.name || 'Customer',
            rating: 5, // Default rating
            earning: (order.totals?.finalCents || 300) / 100, // Default earning
            commission: Math.round(((order.totals?.finalCents || 300) / 100) * 0.2)
          })) : []);
        }

        // Set default ratings since backend doesn't have ratings endpoint
        setRatings({
          average: 4.8,
          totalReviews: 15,
          recentFeedback: [
            { rating: 5, date: '2024-01-15', comment: 'Great service!' },
            { rating: 4, date: '2024-01-14', comment: 'On time delivery' }
          ]
        });

      } catch (error) {
        console.error('Error fetching delivery data:', error);
        // Set default values on error
        setAvailableOrders([]);
        setCompletedOrders([]);
        setRatings({
          average: 0,
          totalReviews: 0,
          recentFeedback: []
        });
      }
    };

    fetchAssignedOrders();
  }, []);

  const toggleOnline = () => {
    setIsOnline(!isOnline);
    setShiftStatus(!isOnline ? 'Active' : 'Offline');
  };

  const handleIncomingOrderAccept = () => {
    if (incomingOrder) {
      setActiveOrder({
        ...incomingOrder,
        status: 'Accepted'
      });
      setIncomingOrder(null);
      setShowIncomingJobModal(false);
    }
  };

  const handleIncomingOrderDecline = (reason) => {
    setIncomingOrder(null);
    setShowIncomingJobModal(false);
    // Add to notifications
    setNotifications(prev => [{
      id: Date.now(),
      type: 'info',
      message: `Order declined: ${reason}`,
      time: 'Just now'
    }, ...prev]);
  };

  const handleOTPVerification = (proof) => {
    if (currentOrderForOTP) {
      updateOrderStatus('Delivered');
      setShowOTPModal(false);
      setCurrentOrderForOTP(null);
    }
  };

  const acceptOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('deliveryToken') || localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/delivery/orders/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ orderId })
      });

      if (response.ok) {
        const orderData = await response.json();
        setActiveOrder(orderData.order);
        setAvailableOrders(prev => prev.filter(o => o._id !== orderId));
        
        // Add success notification
        setNotifications(prev => [{
          id: Date.now(),
          type: 'success',
          message: `Order ${orderId} accepted successfully!`,
          time: 'Just now'
        }, ...prev]);
      } else {
        const error = await response.json();
        setNotifications(prev => [{
          id: Date.now(),
          type: 'error',
          message: `Failed to accept order: ${error.message}`,
          time: 'Just now'
        }, ...prev]);
      }
    } catch (error) {
      console.error('Error accepting order:', error);
      setNotifications(prev => [{
        id: Date.now(),
        type: 'error',
        message: 'Failed to accept order. Please try again.',
        time: 'Just now'
      }, ...prev]);
    }
  };

  const rejectOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('deliveryToken') || localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/delivery/orders/decline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ orderId, reason: 'Driver declined' })
      });

      if (response.ok) {
        setAvailableOrders(prev => prev.filter(o => o._id !== orderId));
        setNotifications(prev => [{
          id: Date.now(),
          type: 'info',
          message: `Order ${orderId} rejected`,
          time: 'Just now'
        }, ...prev]);
      } else {
        const error = await response.json();
        setNotifications(prev => [{
          id: Date.now(),
          type: 'error',
          message: `Failed to reject order: ${error.message}`,
          time: 'Just now'
        }, ...prev]);
      }
    } catch (error) {
      console.error('Error rejecting order:', error);
      setNotifications(prev => [{
        id: Date.now(),
        type: 'error',
        message: 'Failed to reject order. Please try again.',
        time: 'Just now'
      }, ...prev]);
    }
  };

  const updateOrderStatus = (status) => {
    setActiveOrder(prev => ({ ...prev, status }));
    
    if (status === 'Out for Delivery') {
      // Show navigation option
      setNotifications(prev => [{
        id: Date.now(),
        type: 'navigation',
        message: '🗺️ Navigation started for order #' + activeOrder.id,
        time: 'Just now'
      }, ...prev]);
    }
    
    if (status === 'Delivered') {
      // Show OTP modal for verification
      setCurrentOrderForOTP(activeOrder.id);
      setShowOTPModal(true);
    }
  };

  const handleCompleteDelivery = () => {
    if (activeOrder) {
      // Add to completed orders
      const completed = {
        id: activeOrder.id,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        customer: activeOrder.customerName,
        rating: Math.floor(Math.random() * 2) + 4, // Random 4-5 rating
        earning: activeOrder.estimatedEarning,
        commission: Math.round(activeOrder.estimatedEarning * 0.2)
      };
      setCompletedOrders(prev => [completed, ...prev]);
      setActiveOrder(null);
      setEarnings(prev => ({
        ...prev,
        today: { ...prev.today, total: prev.today.total + completed.earning, orders: prev.today.orders + 1 }
      }));
      
      // Show success notification
      setNotifications(prev => [{
        id: Date.now(),
        type: 'success',
        message: `🎉 Order ${completed.id} completed! Earned Rs. ${completed.earning}`,
        time: 'Just now'
      }, ...prev]);
    }
  };

  const startNavigation = (location) => {
    // In a real app, this would open map navigation
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(location)}`, '_blank');
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setNotifications(prev => [{
            id: Date.now(),
            type: 'success',
            message: `📍 Location updated: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
            time: 'Just now'
          }, ...prev]);
        },
        (error) => {
          setNotifications(prev => [{
            id: Date.now(),
            type: 'error',
            message: '❌ Failed to get location',
            time: 'Just now'
          }, ...prev]);
        }
      );
    }
  };

  const simulateOrderProgression = () => {
    if (activeOrder && activeOrder.status === 'Accepted') {
      setTimeout(() => {
        updateOrderStatus('Picked Up');
      }, 5000); // Auto-progress after 5 seconds for demo
    }
  };

  // Auto-progress orders for demo purposes
  useEffect(() => {
    if (activeOrder?.status === 'Out for Delivery') {
      const timer = setTimeout(() => {
        setShowOTPModal(true);
      }, 3000); // Show OTP modal after 3 seconds for demo
      
      return () => clearTimeout(timer);
    }
  }, [activeOrder?.status]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('LKR', 'Rs.');
  };

  const getPerformanceInsights = () => {
    const insights = [];
    
    if ((ratings?.average || 0) >= 4.5) {
      insights.push('🌟 Excellent rating - Keep it up!');
    }
    
    if ((earnings?.today?.total || 0) >= 1000) {
      insights.push('💰 Great earnings today!');
    }
    
    if ((earnings?.today?.orders || 0) >= 5) {
      insights.push('📦 High order completion rate!');
    }
    
    return insights;
  };

  const renderProfileSection = () => (
    <div className="dashboard-section">
      <div className="profile-card">
        <div className="profile-header">
          <img src={deliveryInfo.profilePhoto} alt="Profile" className="profile-photo" />
          <div className="profile-info">
            <h3>{deliveryInfo.name || 'Delivery Agent'}</h3>
            <p className="phone-number">{deliveryInfo.phoneNumber || 'Phone not set'}</p>
            <p className="vehicle-type">🚗 {deliveryInfo.vehicleType}</p>
          </div>
          <div className="profile-status">
            <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
              <div className="status-dot"></div>
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>
        
        <div className="profile-controls">
          <button 
            className={`toggle-btn ${isOnline ? 'online' : ''}`} 
            onClick={toggleOnline}
          >
            {isOnline ? 'Go Offline' : 'Go Online'}
          </button>
          
          <div className="shift-status">
            <span>Shift Status: </span>
            <span className={`status-badge ${shiftStatus.toLowerCase()}`}>
              {shiftStatus}
            </span>
          </div>
        </div>

        <div className="quick-stats">
          <div className="stat-item">
            <div className="stat-number">{earnings?.today?.orders || 0}</div>
            <div className="stat-label">Today's Orders</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{formatCurrency(earnings?.today?.total || 0)}</div>
            <div className="stat-label">Today's Earnings</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{ratings?.average || 0}⭐</div>
            <div className="stat-label">Avg Rating</div>
          </div>
        </div>

        {getPerformanceInsights().length > 0 && (
          <div className="performance-insights">
            <h4>💡 Performance Insights</h4>
            {getPerformanceInsights().map((insight, index) => (
              <div key={index} className="insight-item">
                {insight}
              </div>
            ))}
          </div>
        )}

        <div className="profile-actions">
          <button 
            className="btn-location" 
            onClick={getCurrentLocation}
          >
            📍 Update Location
          </button>
        </div>
      </div>
    </div>
  );

  const renderNewOrdersSection = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>New Order Requests</h2>
        <span className="auto-refresh">🔄 Auto-refreshing...</span>
      </div>
      
      {availableOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🚚</div>
          <h3>No new orders available</h3>
          <p>You'll be notified when new orders come in</p>
        </div>
      ) : (
        <div className="orders-grid">
          {availableOrders.map(order => (
            <div key={order._id || order.id} className="order-card new-order">
              <div className="order-header">
                <span className="order-id">#{order._id || order.orderNumber || order.id}</span>
                <span className="estimated-earnings">Rs. {(order.totals?.finalCents || 300) / 100}</span>
              </div>
              
              <div className="order-details">
                <div className="detail-row">
                  <span className="label">🏪 Restaurant:</span>
                  <span className="value">{order.items?.[0]?.seller?.name || order.restaurant || 'Restaurant'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">📍 Station:</span>
                  <span className="value">{order.deliveryInfo?.stationName || order.station || 'Station'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">🔄 Pickup:</span>
                  <span className="value">{order.deliveryInfo?.pickupLocation || order.pickupLocation || 'Station Pickup'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">🎯 Drop-off:</span>
                  <span className="value">{order.deliveryInfo ? `${order.deliveryInfo.coach || 'Coach'}-${order.deliveryInfo.seat || '00'}` : order.dropOffLocation || 'TBD'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">📦 Items:</span>
                  <span className="value">{order.items?.length || 1}</span>
                </div>
                <div className="detail-row">
                  <span className="label">📏 Distance:</span>
                  <span className="value">{order.distance || 'Distance TBD'}</span>
                </div>
              </div>
              
              <div className="order-actions">
                <button 
                  className="btn-reject" 
                  onClick={() => rejectOrder(order._id || order.id)}
                >
                  ❌ Reject
                </button>
                <button 
                  className="btn-accept" 
                  onClick={() => acceptOrder(order._id || order.id)}
                >
                  ✅ Accept (Rs. {(order.totals?.finalCents || 300) / 100})
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderActiveOrdersSection = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>Active Orders</h2>
      </div>
      
      {!activeOrder ? (
        <div className="empty-state">
          <div className="empty-icon">📱</div>
          <h3>No active orders</h3>
          <p>Accept an order to start delivery</p>
        </div>
      ) : (
        <div className="order-card active-order">
          <div className="order-header">
            <span className="order-id">#{activeOrder._id || activeOrder.orderNumber || activeOrder.id}</span>
            <span className="status-badge in-progress">{activeOrder.status}</span>
          </div>
          
          <div className="order-details">
            <div className="detail-row">
              <span className="label">🏪 Restaurant:</span>
              <span className="value">{activeOrder.items?.[0]?.seller?.name || activeOrder.restaurant || 'Restaurant'}</span>
            </div>
            <div className="detail-row">
              <span className="label">📍 Station:</span>
              <span className="value">{activeOrder.deliveryInfo?.stationName || activeOrder.station || 'Station'}</span>
            </div>
            <div className="detail-row">
              <span className="label">👤 Customer:</span>
              <span className="value">{activeOrder.user?.name || activeOrder.customerName || 'Customer'}</span>
            </div>
            <div className="detail-row">
              <span className="label">📞 Phone:</span>
              <span className="value">{activeOrder.user?.phone || activeOrder.customerPhone || 'Not available'}</span>
            </div>
            <div className="detail-row">
              <span className="label">🔄 Pickup:</span>
              <span className="value">{activeOrder.deliveryInfo?.pickupLocation || activeOrder.pickupLocation || 'Station Pickup'}</span>
            </div>
            <div className="detail-row">
              <span className="label">🎯 Drop-off:</span>
              <span className="value">{activeOrder.deliveryInfo ? `${activeOrder.deliveryInfo.coach || 'Coach'}-${activeOrder.deliveryInfo.seat || '00'}` : activeOrder.dropOffLocation || 'TBD'}</span>
            </div>
            <div className="detail-row">
              <span className="label">🕐 Order Time:</span>
              <span className="value">{new Date(activeOrder.createdAt || activeOrder.orderTime).toLocaleString()}</span>
            </div>
          </div>
          
          <div className="delivery-actions">
            {activeOrder.status === 'OUT_FOR_DELIVERY' && (
              <>
                <button 
                  className="btn btn-primary nav-btn" 
                  onClick={() => startNavigation(activeOrder.deliveryInfo?.pickupLocation || activeOrder.pickupLocation)}
                >
                  🗺️ Navigate to Pickup
                </button>
                <button 
                  className="btn btn-success" 
                  onClick={() => updateOrderStatus('PICKED_UP')}
                >
                  📦 Mark as Picked Up
                </button>
              </>
            )}
            {activeOrder.status === 'PICKED_UP' && (
              <>
                <button 
                  className="btn btn-primary nav-btn" 
                  onClick={() => startNavigation(activeOrder.deliveryInfo ? `${activeOrder.deliveryInfo.coach || 'Coach'}-${activeOrder.deliveryInfo.seat || '00'}` : activeOrder.dropOffLocation)}
                >
                  🗺️ Navigate to Delivery
                </button>
                <button 
                  className="btn btn-success" 
                  onClick={() => updateOrderStatus('Out for Delivery')}
                >
                  🚚 Out for Delivery
                </button>
              </>
            )}
            {activeOrder.status === 'Out for Delivery' && (
              <>
                <button 
                  className="btn btn-info" 
                  onClick={() => window.open(`tel:${activeOrder.user?.phone || activeOrder.customerPhone}`)}
                >
                  📞 Call Customer
                </button>
                <button 
                  className="btn btn-success primary" 
                  onClick={() => updateOrderStatus('Delivered')}
                >
                  ✅ Complete Delivery
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderEarningsSection = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>Earnings Panel</h2>
      </div>
      
      <div className="earnings-overview">
        <div className="earnings-card today">
          <h3>Today</h3>
          <div className="earnings-amount">{formatCurrency(earnings?.today?.total || 0)}</div>
          <div className="earnings-details">
            <span>{earnings?.today?.orders || 0} orders</span>
            <span>Avg: {formatCurrency(earnings?.today?.avgPerOrder || 0)}</span>
          </div>
        </div>
        
        <div className="earnings-card week">
          <h3>This Week</h3>
          <div className="earnings-amount">{formatCurrency(earnings?.week?.total || 0)}</div>
          <div className="earnings-details">
            <span>{earnings?.week?.orders || 0} orders</span>
            <span>Avg: {formatCurrency(earnings?.week?.avgPerOrder || 0)}</span>
          </div>
        </div>
        
        <div className="earnings-card month">
          <h3>This Month</h3>
          <div className="earnings-amount">{formatCurrency(earnings?.month?.total || 0)}</div>
          <div className="earnings-details">
            <span>{earnings?.month?.orders || 0} orders</span>
            <span>Avg: {formatCurrency(earnings?.month?.avgPerOrder || 0)}</span>
          </div>
        </div>
      </div>
      
      <div className="payout-info">
        <h4>Pending Payout</h4>
        <div className="payout-amount">{formatCurrency(earnings?.pendingPayout || 0)}</div>
        <p className="payout-status">💰 Ready for payout</p>
      </div>
      
      <div className="incentives-info">
        <h4>💎 Today's Incentives</h4>
        <div className="incentive-item">
          <span>Peak Hour Bonus (2-4 PM):</span>
          <span className="incentive-amount">+{formatCurrency(50)}</span>
        </div>
        <div className="incentive-item">
          <span>Order Completion Bonus:</span>
          <span className="incentive-amount">+{formatCurrency(25)}</span>
        </div>
        <div className="incentive-item">
          <span>Customer Rating Bonus (4.5+ stars):</span>
          <span className="incentive-amount">+{formatCurrency(30)}</span>
        </div>
        <div className="incentive-total">
          <strong>Total Potential Bonus: {formatCurrency(105)}</strong>
        </div>
      </div>
    </div>
  );

  const renderRatingsSection = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>Ratings & Feedback</h2>
      </div>
      
      <div className="ratings-overview">
        <div className="rating-score">
          <div className="score-number">{ratings?.average || 0}</div>
          <div className="stars">⭐⭐⭐⭐⭐</div>
          <div className="total-reviews">Based on {ratings?.totalReviews || 0} reviews</div>
        </div>
      </div>
      
      <div className="feedback-list">
        <h4>Recent Feedback</h4>
        {ratings?.recentFeedback && ratings.recentFeedback.length > 0 ? (
          ratings.recentFeedback.map((feedback, index) => (
            <div key={index} className="feedback-item">
              <div className="feedback-header">
                <div className="feedback-rating">
                  {'⭐'.repeat(feedback.rating || 5)}
                </div>
                <span className="feedback-date">{feedback.date}</span>
              </div>
              <p className="feedback-comment">"{feedback.comment}"</p>
            </div>
          ))
        ) : (
          <p className="no-feedback">No feedback available yet</p>
        )}
      </div>
      
      <div className="performance-stats">
        <h4>Performance Metrics</h4>
        <div className="metric-row">
          <span>On-time Delivery:</span>
          <span className="metric-value">95%</span>
        </div>
        <div className="metric-row">
          <span>Customer Satisfaction:</span>
          <span className="metric-value">4.8/5</span>
        </div>
        <div className="metric-row">
          <span>Order Completion:</span>
          <span className="metric-value">98%</span>
        </div>
      </div>
    </div>
  );

  const renderCompletedOrdersSection = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>Completed Orders History</h2>
      </div>
      
      <div className="completed-orders-list">
        {completedOrders.map(order => (
          <div key={order.id} className="completed-order-card">
            <div className="order-info">
              <div className="order-header-small">
                <span className="order-id">#{order.id}</span>
                <span className="order-date">{order.date}</span>
              </div>
              <div className="order-details-small">
                <span>{order.time} • {order.customer}</span>
              </div>
            </div>
            <div className="order-rating">
              <span className="rating-stars">{'⭐'.repeat(order.rating)}</span>
            </div>
            <div className="order-earnings-small">
              <div className="earning-amount">Rs. {order.earning}</div>
              <div className="commission">Commission: Rs. {order.commission}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>Notifications</h2>
      </div>
      
      <div className="notifications-list">
        {notifications.map(notification => (
          <div key={notification.id} className={`notification-item ${notification.type}`}>
            <div className="notification-content">
              <p className="notification-message">{notification.message}</p>
              <span className="notification-time">{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettingsSection = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>Settings</h2>
      </div>
      
      <div className="settings-list">
        <div className="setting-item">
          <div className="setting-info">
            <h4>📸 Profile Photo</h4>
            <p>Upload or update your profile picture</p>
          </div>
          <button className="btn-setting" onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  setDeliveryInfo(prev => ({ ...prev, profilePhoto: e.target.result }));
                };
                reader.readAsDataURL(file);
              }
            };
            input.click();
          }}>
            Update Photo
          </button>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <h4>🚗 Vehicle Information</h4>
            <p>Update your vehicle type and details</p>
          </div>
          <button className="btn-setting" onClick={() => {
            const vehicleTypes = ['Bike', 'Scooter', 'Car', 'Bicycle'];
            const currentIndex = vehicleTypes.indexOf(deliveryInfo.vehicleType);
            const nextVehicle = vehicleTypes[(currentIndex + 1) % vehicleTypes.length];
            setDeliveryInfo(prev => ({ ...prev, vehicleType: nextVehicle }));
          }}>
            Change to {['Bike', 'Scooter', 'Car', 'Bicycle'][['Bike', 'Scooter', 'Car', 'Bicycle'].indexOf(deliveryInfo.vehicleType) + 1] || 'Bike'}
          </button>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <h4>🔒 Change Password</h4>
            <p>Update your account password</p>
          </div>
          <button className="btn-setting">Change</button>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <h4>📍 Location Permission</h4>
            <p>Allow access to your location for delivery</p>
          </div>
          <button className="btn-setting" onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  setNotifications(prev => [{
                    id: Date.now(),
                    type: 'success',
                    message: 'Location permission granted',
                    time: 'Just now'
                  }, ...prev]);
                },
                (error) => {
                  setNotifications(prev => [{
                    id: Date.now(),
                    type: 'error',
                    message: 'Location permission denied',
                    time: 'Just now'
                  }, ...prev]);
                }
              );
            }
          }}>
            Enable
          </button>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <h4>📱 Notification Settings</h4>
            <p>Manage your notification preferences</p>
          </div>
          <button className="btn-setting">Configure</button>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <h4>📊 Performance Analytics</h4>
            <p>View detailed performance reports</p>
          </div>
          <button className="btn-setting" onClick={() => setActiveTab('ratings')}>
            View Report
          </button>
        </div>
        
        <div className="setting-item logout">
          <div className="setting-info">
            <h4>🚪 Logout</h4>
            <p>Sign out of your delivery account</p>
          </div>
          <button 
            className="btn-setting logout-btn" 
            onClick={() => {
              localStorage.removeItem('deliveryToken');
              localStorage.removeItem('deliveryInfo');
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/delivery/login');
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileSection();
      case 'neworders': return renderNewOrdersSection();
      case 'activeorders': return renderActiveOrdersSection();
      case 'earnings': return renderEarningsSection();
      case 'ratings': return renderRatingsSection();
      case 'history': return renderCompletedOrdersSection();
      case 'notifications': return renderNotificationsSection();
      case 'settings': return renderSettingsSection();
      default: return renderProfileSection();
    }
  };

  return (
    <div className="delivery-dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>🚚 Delivery Agent Dashboard</h1>
          <div className="agent-info">
            <span>Welcome, {deliveryInfo.name || 'Delivery Agent'}</span>
            <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
              <div className="status-dot"></div>
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-layout">
        <nav className="dashboard-sidebar">
          <div className="sidebar-section">
            <h4>Quick Actions</h4>
            <button 
              className={`sidebar-btn ${isOnline ? 'online' : 'offline'}`} 
              onClick={toggleOnline}
            >
              {isOnline ? 'Go Offline' : 'Go Online'}
            </button>
          </div>
          
          <div className="sidebar-section">
            <h4>Navigation</h4>
            <button 
              className={`sidebar-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Profile & Status
            </button>
            <button 
              className={`sidebar-btn ${activeTab === 'neworders' ? 'active' : ''}`}
              onClick={() => setActiveTab('neworders')}
            >
              🔔 New Orders ({availableOrders.length})
            </button>
            <button 
              className={`sidebar-btn ${activeTab === 'activeorders' ? 'active' : ''}`}
              onClick={() => setActiveTab('activeorders')}
            >
              📦 Active Orders
            </button>
            <button 
              className={`sidebar-btn ${activeTab === 'earnings' ? 'active' : ''}`}
              onClick={() => setActiveTab('earnings')}
            >
              💰 Earnings
            </button>
            <button 
              className={`sidebar-btn ${activeTab === 'ratings' ? 'active' : ''}`}
              onClick={() => setActiveTab('ratings')}
            >
              ⭐ Ratings & Feedback
            </button>
            <button 
              className={`sidebar-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              📋 Completed Orders
            </button>
            <button 
              className={`sidebar-btn ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              🔔 Notifications
            </button>
            <button 
              className={`sidebar-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              ⚙️ Settings
            </button>
          </div>
        </nav>

        <main className="dashboard-content">
          {renderContent()}
        </main>
      </div>

      {/* Incoming Job Modal */}
      {showIncomingJobModal && incomingOrder && (
        <IncomingJobModal
          order={{
            orderNumber: incomingOrder.id,
            deliveryInfo: {
              stationName: incomingOrder.station,
              coach: incomingOrder.dropOffLocation.split('-')[0].replace('Coach ', ''),
              seat: incomingOrder.dropOffLocation.split('-')[1],
              contactName: incomingOrder.customerName
            },
            items: [
              { name: 'Mixed Items', qty: incomingOrder.items, seller: { name: incomingOrder.restaurant } }
            ],
            totals: { finalCents: incomingOrder.estimatedEarning * 100 }
          }}
          onAccept={handleIncomingOrderAccept}
          onDecline={handleIncomingOrderDecline}
          onClose={() => setShowIncomingJobModal(false)}
        />
      )}

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <OrderOTPModal
          orderId={currentOrderForOTP}
          onClose={() => setShowOTPModal(false)}
          onConfirm={handleOTPVerification}
        />
      )}
    </div>
  );
};

export default DeliveryDashboard;