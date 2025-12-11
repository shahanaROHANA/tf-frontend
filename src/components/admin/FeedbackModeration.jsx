// src/components/admin/FeedbackModeration.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FeedbackModeration.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const FeedbackModeration = () => {
  const [feedback, setFeedback] = useState([]);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [filters, setFilters] = useState({
    status: 'pending',
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionData, setActionData] = useState({
    reason: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (activeTab === 'reports') {
        const reportsResponse = await axios.get(`${API_BASE_URL}/api/feedback/admin/reports`, {
          headers: { Authorization: `Bearer ${token}` },
          params: filters
        });
        setReports(reportsResponse.data.data.reports);
      } else {
        const feedbackResponse = await axios.get(`${API_BASE_URL}/api/feedback/admin/queue`, {
          headers: { Authorization: `Bearer ${token}` },
          params: filters
        });
        setFeedback(feedbackResponse.data.data.feedback);
      }

      const statsResponse = await axios.get(`${API_BASE_URL}/api/feedback/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { timeRange: 30 }
      });
      setStats(statsResponse.data.data);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load moderation data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (feedbackId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/feedback/admin/${feedbackId}/approve`, {
        reason: actionData.reason,
        notes: actionData.notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Feedback approved successfully');
      setShowActionModal(false);
      loadData();
    } catch (error) {
      console.error('Error approving feedback:', error);
      alert('Failed to approve feedback');
    }
  };

  const handleReject = async (feedbackId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/feedback/admin/${feedbackId}/reject`, {
        reason: actionData.reason,
        notes: actionData.notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Feedback rejected successfully');
      setShowActionModal(false);
      loadData();
    } catch (error) {
      console.error('Error rejecting feedback:', error);
      alert('Failed to reject feedback');
    }
  };

  const handleBulkAction = async () => {
    if (selectedItems.length === 0) {
      alert('Please select items to moderate');
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/feedback/admin/bulk`, {
        feedbackIds: selectedItems,
        action: actionType,
        reason: actionData.reason,
        notes: actionData.notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Bulk ${actionType} completed successfully`);
      setShowActionModal(false);
      setSelectedItems([]);
      loadData();
    } catch (error) {
      console.error('Error in bulk action:', error);
      alert('Failed to complete bulk action');
    } finally {
      setActionLoading(false);
    }
  };

  const openActionModal = (type, item = null) => {
    setActionType(type);
    setCurrentItem(item);
    setActionData({ reason: '', notes: '' });
    setShowActionModal(true);
  };

  const openDetailModal = (item) => {
    setCurrentItem(item);
    setShowDetailModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
        ⭐
      </span>
    ));
  };

  const renderStatusBadge = (status) => {
    const badges = {
      pending: 'badge-pending',
      approved: 'badge-approved',
      rejected: 'badge-rejected',
      flagged: 'badge-flagged',
      under_review: 'badge-review'
    };
    return badges[status] || 'badge-default';
  };

  const renderPriorityBadge = (priority) => {
    const badges = {
      low: 'priority-low',
      medium: 'priority-medium',
      high: 'priority-high',
      critical: 'priority-critical'
    };
    return badges[priority] || 'priority-default';
  };

  const renderStatsCards = () => {
    if (!stats) return null;

    return (
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Pending Review</h3>
          <div className="stat-number">{stats.feedback.pendingReview}</div>
        </div>
        <div className="stat-card">
          <h3>Approved</h3>
          <div className="stat-number">{stats.feedback.approved}</div>
        </div>
        <div className="stat-card">
          <h3>Rejected</h3>
          <div className="stat-number">{stats.feedback.rejected}</div>
        </div>
        <div className="stat-card">
          <h3>Flagged</h3>
          <div className="stat-number">{stats.feedback.flagged}</div>
        </div>
        <div className="stat-card">
          <h3>Reports</h3>
          <div className="stat-number">{stats.reports.totalReports}</div>
        </div>
      </div>
    );
  };

  const renderFeedbackList = () => {
    if (loading) return <div className="loading">Loading...</div>;

    const currentData = activeTab === 'reports' ? reports : feedback;

    if (currentData.length === 0) {
      return <div className="no-data">No items found</div>;
    }

    return (
      <div className="feedback-list">
        {currentData.map((item) => (
          <div key={item._id} className="feedback-item">
            <div className="item-select">
              <input
                type="checkbox"
                checked={selectedItems.includes(item._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedItems([...selectedItems, item._id]);
                  } else {
                    setSelectedItems(selectedItems.filter(id => id !== item._id));
                  }
                }}
              />
            </div>
            
            <div className="item-content" onClick={() => openDetailModal(item)}>
              <div className="item-header">
                <div className="item-title">
                  <strong>Feedback ID:</strong> {item.feedbackId}
                  {activeTab === 'reports' && (
                    <span className={`priority-badge ${renderPriorityBadge(item.priority)}`}>
                      {item.priority}
                    </span>
                  )}
                </div>
                <div className="item-meta">
                  <span className={`status-badge ${renderStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                  <span className="item-date">{formatDate(item.createdAt)}</span>
                </div>
              </div>

              <div className="item-rating">
                {renderStars(item.rating)} 
                <span className="rating-text">({item.rating}/5)</span>
              </div>

              <div className="item-comment">
                <strong>Comment:</strong> {item.detailedComment}
              </div>

              {item.summary && (
                <div className="item-summary">
                  <strong>Summary:</strong> {item.summary}
                </div>
              )}

              <div className="item-info">
                <div className="item-user">
                  <strong>User:</strong> {item.user?.name || 'Anonymous'}
                </div>
                <div className="item-target">
                  <strong>Target:</strong> {item.target}
                </div>
                {item.tags && item.tags.length > 0 && (
                  <div className="item-tags">
                    <strong>Tags:</strong> {item.tags.join(', ')}
                  </div>
                )}
              </div>

              {activeTab === 'reports' && (
                <div className="report-info">
                  <strong>Report Reason:</strong> {item.reasonDisplay}
                  {item.description && (
                    <div className="report-description">
                      <strong>Description:</strong> {item.description}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="item-actions">
              {activeTab !== 'reports' && (
                <>
                  <button
                    className="btn-approve"
                    onClick={() => openActionModal('approve', item)}
                    disabled={actionLoading}
                  >
                    Approve
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => openActionModal('reject', item)}
                    disabled={actionLoading}
                  >
                    Reject
                  </button>
                </>
              )}
              {activeTab === 'reports' && (
                <>
                  <button
                    className="btn-approve"
                    onClick={() => openActionModal('resolve', item)}
                    disabled={actionLoading}
                  >
                    Resolve
                  </button>
                  <button
                    className="btn-warning"
                    onClick={() => openActionModal('dismiss', item)}
                    disabled={actionLoading}
                  >
                    Dismiss
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="feedback-moderation">
      <div className="moderation-header">
        <h2>Feedback Moderation</h2>
        {renderStatsCards()}
      </div>

      <div className="moderation-tabs">
        <button
          className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Review ({stats?.feedback?.pendingReview || 0})
        </button>
        <button
          className={`tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          Reports ({stats?.reports?.pendingReports || 0})
        </button>
      </div>

      <div className="moderation-filters">
        <select
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value, page: 1})}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="flagged">Flagged</option>
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
        >
          <option value="createdAt">Date</option>
          <option value="rating">Rating</option>
          <option value="priority">Priority</option>
        </select>

        {selectedItems.length > 0 && (
          <div className="bulk-actions">
            <button
              className="btn-bulk-approve"
              onClick={() => openActionModal('approve')}
              disabled={actionLoading}
            >
              Approve Selected ({selectedItems.length})
            </button>
            <button
              className="btn-bulk-reject"
              onClick={() => openActionModal('reject')}
              disabled={actionLoading}
            >
              Reject Selected ({selectedItems.length})
            </button>
          </div>
        )}
      </div>

      {renderFeedbackList()}

      {/* Detail Modal */}
      {showDetailModal && currentItem && (
        <div className="detail-modal-overlay">
          <div className="detail-modal">
            <div className="modal-header">
              <h3>Feedback Details</h3>
              <button onClick={() => setShowDetailModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="detail-section">
                <strong>Feedback ID:</strong> {currentItem.feedbackId}
              </div>
              <div className="detail-section">
                <strong>Rating:</strong> {renderStars(currentItem.rating)}
              </div>
              <div className="detail-section">
                <strong>Comment:</strong>
                <p>{currentItem.detailedComment}</p>
              </div>
              {currentItem.summary && (
                <div className="detail-section">
                  <strong>Summary:</strong>
                  <p>{currentItem.summary}</p>
                </div>
              )}
              <div className="detail-section">
                <strong>User:</strong> {currentItem.user?.name || 'Anonymous'}
              </div>
              <div className="detail-section">
                <strong>Status:</strong> 
                <span className={`status-badge ${renderStatusBadge(currentItem.status)}`}>
                  {currentItem.status}
                </span>
              </div>
              <div className="detail-section">
                <strong>Created:</strong> {formatDate(currentItem.createdAt)}
              </div>
              {currentItem.moderationHistory && currentItem.moderationHistory.length > 0 && (
                <div className="detail-section">
                  <strong>Moderation History:</strong>
                  <ul>
                    {currentItem.moderationHistory.map((history, index) => (
                      <li key={index}>
                        {history.action} by {history.moderatedBy?.name} on {formatDate(history.moderatedAt)}
                        {history.reason && ` - ${history.reason}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && (
        <div className="action-modal-overlay">
          <div className="action-modal">
            <div className="modal-header">
              <h3>
                {actionType === 'approve' && 'Approve Feedback'}
                {actionType === 'reject' && 'Reject Feedback'}
                {actionType === 'resolve' && 'Resolve Report'}
                {actionType === 'dismiss' && 'Dismiss Report'}
              </h3>
              <button onClick={() => setShowActionModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Reason:</label>
                <input
                  type="text"
                  value={actionData.reason}
                  onChange={(e) => setActionData({...actionData, reason: e.target.value})}
                  placeholder="Reason for action"
                />
              </div>
              <div className="form-group">
                <label>Notes:</label>
                <textarea
                  value={actionData.notes}
                  onChange={(e) => setActionData({...actionData, notes: e.target.value})}
                  placeholder="Additional notes"
                  rows={3}
                />
              </div>
              <div className="modal-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setShowActionModal(false)}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  className={`btn-confirm ${actionType}`}
                  onClick={() => {
                    if (currentItem) {
                      handleApprove(currentItem._id);
                    } else {
                      handleBulkAction();
                    }
                  }}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackModeration;