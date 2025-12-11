import React, { useState, useEffect } from 'react';
import { api } from '../../utils/authUtils.js';

const RatingsFeedback = () => {
  const [ratings, setRatings] = useState([]);
  const [stats, setStats] = useState({ totalRatings: 0, averageRating: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    // Check if seller is authenticated before making API calls
    const token = localStorage.getItem('sellerToken') || localStorage.getItem('token');
    if (!token) {
      setMessage('Please login to view ratings');
      setLoading(false);
      return;
    }
    fetchRatings();
  }, [page]);

  const fetchRatings = async () => {
    try {
      const response = await api.get(`/seller/dashboard/ratings?page=${page}`);
      setRatings(response.data.ratings || []);
      setStats(response.data.stats || { totalRatings: 0, averageRating: 0 });
    } catch (error) {
      console.error('Error fetching ratings:', error);
      setMessage(error.response?.data?.message || 'Failed to load ratings');
    } finally {
      setLoading(false);
    }
  };

  const submitResponse = async (ratingId) => {
    if (!responseText.trim()) return;

    try {
      setRespondingTo(ratingId);
      const token = localStorage.getItem('sellerToken');
      
      // This would need to be implemented in backend
      // For now, just update local state
      setRatings(prev => 
        prev.map(rating => 
          rating.orderId === ratingId 
            ? { ...rating, sellerResponse: responseText, respondedAt: new Date() }
            : rating
        )
      );
      
      setMessage('Response submitted successfully!');
      setResponseText('');
      setRespondingTo(null);
    } catch (error) {
      setMessage('Error submitting response');
      setRespondingTo(null);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : 'empty'}`}>
        ★
      </span>
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratings.forEach(rating => {
      if (rating.rating >= 1 && rating.rating <= 5) {
        distribution[rating.rating]++;
      }
    });
    return distribution;
  };

  if (loading) {
    return (
      <div className="ratings-feedback">
        <div className="card">
          <div className="text-center p-4">
            <div className="loading-spinner"></div>
            <p>Loading ratings and feedback...</p>
          </div>
        </div>
      </div>
    );
  }

  const distribution = getRatingDistribution();

  return (
    <div className="ratings-feedback">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📝 Ratings & Feedback</h2>
          <div className="header-actions">
            <span className="total-ratings">
              ⭐ {stats.averageRating.toFixed(1)} ({stats.totalRatings} reviews)
            </span>
          </div>
        </div>

        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}

        {/* Rating Overview */}
        <div className="rating-overview">
          <div className="overview-grid">
            <div className="overview-card main">
              <div className="rating-display">
                <div className="big-rating">{stats.averageRating.toFixed(1)}</div>
                <div className="rating-stars">
                  {renderStars(Math.round(stats.averageRating))}
                </div>
                <div className="total-text">{stats.totalRatings} total ratings</div>
              </div>
            </div>
            
            <div className="overview-card distribution">
              <h4>Rating Distribution</h4>
              <div className="distribution-bars">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = distribution[star] || 0;
                  const percentage = stats.totalRatings > 0 ? (count / stats.totalRatings) * 100 : 0;
                  
                  return (
                    <div key={star} className="distribution-row">
                      <div className="distribution-label">
                        {star} {star === 1 ? 'star' : 'stars'}
                      </div>
                      <div className="distribution-bar-container">
                        <div 
                          className="distribution-bar"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="distribution-count">{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="reviews-section">
          <h3>📋 Customer Reviews</h3>
          
          {ratings.length === 0 ? (
            <div className="text-center p-4">
              <div className="empty-state">
                <div className="empty-icon">⭐</div>
                <h3>No reviews yet</h3>
                <p>Start delivering amazing food to get customer reviews!</p>
              </div>
            </div>
          ) : (
            <div className="reviews-list">
              {ratings.map((rating, index) => (
                <div key={index} className="review-card">
                  <div className="review-header">
                    <div className="customer-info">
                      <div className="customer-avatar">👤</div>
                      <div className="customer-details">
                        <h4>{rating.customerName}</h4>
                        <p className="review-date">🕐 {formatDate(rating.createdAt)}</p>
                      </div>
                    </div>
                    <div className="rating-info">
                      <div className="rating-stars">
                        {renderStars(rating.rating)}
                      </div>
                      <span className="rating-number">{rating.rating}.0</span>
                    </div>
                  </div>

                  <div className="review-content">
                    <p className="review-text">{rating.review}</p>
                    
                    {rating.items && rating.items.length > 0 && (
                      <div className="reviewed-items">
                        <h5>🍱 Ordered Items:</h5>
                        <div className="items-list">
                          {rating.items.map((item, itemIndex) => (
                            <span key={itemIndex} className="item-tag">
                              {item.product?.name || 'Unknown Item'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {rating.sellerResponse ? (
                    <div className="seller-response">
                      <div className="response-header">
                        <h5>📝 Your Response</h5>
                        <span className="response-date">
                          {formatDate(rating.respondedAt)}
                        </span>
                      </div>
                      <p className="response-text">{rating.sellerResponse}</p>
                    </div>
                  ) : (
                    <div className="response-section">
                      {respondingTo === rating.orderId ? (
                        <div className="response-form">
                          <textarea
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            className="form-control"
                            rows="3"
                            placeholder="Thank you for your feedback! Please share your response..."
                          ></textarea>
                          <div className="response-actions">
                            <button 
                              className="btn btn-sm btn-primary"
                              onClick={() => submitResponse(rating.orderId)}
                              disabled={respondingTo === rating.orderId && !responseText.trim()}
                            >
                              {respondingTo === rating.orderId ? (
                                <span className="loading-spinner"></span>
                              ) : (
                                '📤 Send Response'
                              )}
                            </button>
                            <button 
                              className="btn btn-sm btn-secondary"
                              onClick={() => {
                                setRespondingTo(null);
                                setResponseText('');
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => setRespondingTo(rating.orderId)}
                        >
                          💬 Respond to Review
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {stats.totalRatings > 10 && (
          <div className="pagination">
            <button 
              className="btn btn-secondary"
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              ← Previous
            </button>
            <span className="page-info">
              Page {page}
            </span>
            <button 
              className="btn btn-secondary"
              onClick={() => setPage(prev => prev + 1)}
            >
              Next →
            </button>
          </div>
        )}

        {/* Improvement Tips */}
        <div className="improvement-tips">
          <h3>💡 Improvement Tips</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">🍽</div>
              <h4>Food Quality</h4>
              <p>Consistent quality leads to better ratings</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">⏱️</div>
              <h4>Delivery Time</h4>
              <p>Fast delivery improves customer satisfaction</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">📦</div>
              <h4>Packaging</h4>
              <p>Good packaging prevents spills and damage</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">💬</div>
              <h4>Communication</h4>
              <p>Respond to reviews to show you care</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .header-actions {
          display: flex;
          align-items: center;
        }

        .total-ratings {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
        }

        .rating-overview {
          margin-bottom: 2rem;
        }

        .overview-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .overview-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .overview-card.main {
          text-align: center;
        }

        .big-rating {
          font-size: 3rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .rating-stars {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .star {
          color: #ddd;
        }

        .star.filled {
          color: #ffc107;
        }

        .total-text {
          color: #718096;
          font-size: 0.9rem;
        }

        .distribution h4 {
          margin: 0 0 1rem 0;
          color: #2d3748;
        }

        .distribution-bars {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .distribution-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .distribution-label {
          min-width: 60px;
          color: #4a5568;
          font-size: 0.9rem;
        }

        .distribution-bar-container {
          flex: 1;
          height: 20px;
          background: #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
        }

        .distribution-bar {
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s ease;
        }

        .distribution-count {
          min-width: 30px;
          text-align: right;
          color: #4a5568;
          font-weight: 600;
        }

        .reviews-section {
          margin-bottom: 2rem;
        }

        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .review-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          transition: transform 0.3s ease;
        }

        .review-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .customer-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .customer-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .customer-details h4 {
          margin: 0 0 0.25rem 0;
          color: #2d3748;
        }

        .review-date {
          margin: 0;
          color: #718096;
          font-size: 0.9rem;
        }

        .rating-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .rating-number {
          font-weight: 600;
          color: #2d3748;
        }

        .review-text {
          margin: 0 0 1rem 0;
          color: #4a5568;
          line-height: 1.6;
        }

        .reviewed-items {
          margin-bottom: 1rem;
        }

        .reviewed-items h5 {
          margin: 0 0 0.5rem 0;
          color: #2d3748;
          font-size: 0.9rem;
        }

        .items-list {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .item-tag {
          background: #e2e8f0;
          color: #4a5568;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
        }

        .seller-response {
          background: #f0f9ff;
          border: 1px solid #bee3f8;
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1rem;
        }

        .response-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .response-header h5 {
          margin: 0;
          color: #2c5282;
        }

        .response-date {
          color: #2c5282;
          font-size: 0.8rem;
        }

        .response-text {
          margin: 0;
          color: #2c5282;
          line-height: 1.5;
        }

        .response-section {
          margin-top: 1rem;
        }

        .response-form {
          margin-top: 1rem;
        }

        .response-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
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

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin: 2rem 0;
        }

        .page-info {
          color: #4a5568;
          font-weight: 500;
        }

        .improvement-tips {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
        }

        .tips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .tip-card {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
          border: 1px solid #e2e8f0;
        }

        .tip-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .tip-card h4 {
          margin: 0.5rem 0;
          color: #2d3748;
          font-size: 1rem;
        }

        .tip-card p {
          margin: 0;
          color: #718096;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .overview-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .review-header {
            flex-direction: column;
            gap: 1rem;
          }

          .customer-info {
            align-self: flex-start;
          }

          .response-actions {
            flex-direction: column;
          }

          .tips-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default RatingsFeedback;
