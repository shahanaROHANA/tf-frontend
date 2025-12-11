// src/components/FeedbackDisplay.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FeedbackDisplay.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const FeedbackDisplay = ({ 
  targetType, 
  targetId, 
  title = "Customer Reviews", 
  showStatistics = true,
  maxReviews = 10,
  allowFiltering = true
}) => {
  const [feedback, setFeedback] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: maxReviews,
    rating: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: maxReviews,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    loadFeedback();
  }, [targetType, targetId, filters]);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = {
        targetType,
        targetId,
        status: 'approved',
        ...filters
      };

      const response = await axios.get(`${API_BASE_URL}/api/feedback`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      setFeedback(response.data.data.feedback);
      setPagination(response.data.data.pagination);
      
      if (showStatistics && response.data.data.statistics) {
        setStatistics(response.data.data.statistics);
      }
    } catch (error) {
      console.error('Error loading feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating, size = 'medium') => {
    return (
      <div className={`stars-container stars-${size}`}>
        {Array.from({ length: 5 }, (_, i) => (
          <span 
            key={i} 
            className={`star ${i < rating ? 'filled' : ''}`}
          >
            ⭐
          </span>
        ))}
        <span className="rating-number">({rating}/5)</span>
      </div>
    );
  };

  const renderRatingDistribution = () => {
    if (!statistics?.ratingDistribution) return null;

    const distribution = statistics.ratingDistribution;
    const totalReviews = statistics.totalReviews;

    return (
      <div className="rating-distribution">
        <h4>Rating Distribution</h4>
        {[5, 4, 3, 2, 1].map(rating => {
          const count = distribution[rating] || 0;
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          
          return (
            <div key={rating} className="rating-row">
              <span className="rating-label">{rating} star</span>
              <div className="rating-bar">
                <div 
                  className="rating-fill" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="rating-count">({count})</span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderStatistics = () => {
    if (!statistics || !showStatistics) return null;

    return (
      <div className="feedback-statistics">
        <div className="overall-rating">
          <div className="rating-number">
            {statistics.averageRating || 0}
          </div>
          <div className="rating-stars">
            {renderStars(Math.round(statistics.averageRating || 0), 'large')}
          </div>
          <div className="review-count">
            Based on {statistics.totalReviews || 0} reviews
          </div>
        </div>
        
        {renderRatingDistribution()}
      </div>
    );
  };

  const renderFeedbackItem = (item) => {
    return (
      <div key={item._id} className="feedback-item">
        <div className="feedback-header">
          <div className="feedback-meta">
            <div className="user-info">
              <span className="user-name">
                {item.isAnonymous ? 'Anonymous User' : (item.user?.name || 'Anonymous')}
              </span>
              <span className="review-date">{formatDate(item.createdAt)}</span>
            </div>
            <div className="feedback-rating">
              {renderStars(item.rating, 'small')}
            </div>
          </div>
          
          {item.summary && (
            <div className="feedback-summary">
              <strong>{item.summary}</strong>
            </div>
          )}
        </div>

        <div className="feedback-content">
          <p className="feedback-comment">{item.detailedComment}</p>
          
          {item.tags && item.tags.length > 0 && (
            <div className="feedback-tags">
              {item.tags.map(tag => (
                <span key={tag} className="tag">{tag.replace('_', ' ')}</span>
              ))}
            </div>
          )}

          {item.media && item.media.length > 0 && (
            <div className="feedback-media">
              {item.media.map((media, index) => (
                <div key={index} className="media-item">
                  {media.type === 'image' ? (
                    <img 
                      src={media.url} 
                      alt={`Review media ${index + 1}`}
                      className="media-image"
                    />
                  ) : (
                    <video 
                      src={media.url} 
                      controls 
                      className="media-video"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {item.replies && item.replies.length > 0 && (
            <div className="feedback-replies">
              {item.replies.map(reply => (
                <div key={reply._id} className="reply-item">
                  <div className="reply-header">
                    <span className="reply-author">{reply.author?.name}</span>
                    <span className="reply-role">({reply.authorRole})</span>
                    <span className="reply-date">{formatDate(reply.createdAt)}</span>
                  </div>
                  <p className="reply-content">{reply.message}</p>
                </div>
              ))}
            </div>
          )}

          <div className="feedback-actions">
            <button className="helpful-btn" disabled>
              👍 Helpful ({item.helpfulVotes?.count || 0})
            </button>
            <button 
              className="report-btn"
              onClick={() => handleReport(item._id)}
            >
              Report
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleReport = async (feedbackId) => {
    try {
      const reason = prompt('Please select a reason for reporting this review:');
      if (!reason) return;

      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/feedback/${feedbackId}/report`, {
        reason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Thank you for your report. We will review it shortly.');
    } catch (error) {
      console.error('Error reporting feedback:', error);
      alert('Failed to report feedback. Please try again.');
    }
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const renderPagination = () => {
    if (pagination.pages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, pagination.page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.pages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="pagination">
        <button
          className="pagination-btn"
          disabled={pagination.page === 1}
          onClick={() => handlePageChange(pagination.page - 1)}
        >
          Previous
        </button>
        
        {startPage > 1 && (
          <>
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(1)}
            >
              1
            </button>
            {startPage > 2 && <span className="pagination-ellipsis">...</span>}
          </>
        )}
        
        {pages.map(page => (
          <button
            key={page}
            className={`pagination-btn ${page === pagination.page ? 'active' : ''}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
        
        {endPage < pagination.pages && (
          <>
            {endPage < pagination.pages - 1 && <span className="pagination-ellipsis">...</span>}
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(pagination.pages)}
            >
              {pagination.pages}
            </button>
          </>
        )}
        
        <button
          className="pagination-btn"
          disabled={pagination.page === pagination.pages}
          onClick={() => handlePageChange(pagination.page + 1)}
        >
          Next
        </button>
      </div>
    );
  };

  const renderFilters = () => {
    if (!allowFiltering) return null;

    return (
      <div className="feedback-filters">
        <select
          value={filters.rating}
          onChange={(e) => setFilters({...filters, rating: e.target.value, page: 1})}
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
        >
          <option value="createdAt">Most Recent</option>
          <option value="rating">Highest Rating</option>
          <option value="helpfulVotes.count">Most Helpful</option>
        </select>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="feedback-display">
        <div className="loading">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="feedback-display">
      <div className="feedback-header-section">
        <h3 className="feedback-title">{title}</h3>
        {renderFilters()}
      </div>

      {renderStatistics()}

      <div className="feedback-list">
        {feedback.length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to leave a review!</p>
          </div>
        ) : (
          feedback.map(renderFeedbackItem)
        )}
      </div>

      {renderPagination()}
    </div>
  );
};

export default FeedbackDisplay;