import React from 'react';

const DeliveryEarnings = ({ earnings }) => {
  if (!earnings) {
    return (
      <div className="delivery-card">
        <h3>💰 Today's Earnings</h3>
        <div className="skeleton" style={{ height: '100px' }}></div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return `₹${(amount / 100).toFixed(2)}`;
  };

  const completionRate = earnings.stats?.completionRate || 0;

  return (
    <div className="delivery-card earnings-card">
      <h3>💰 Today's Earnings</h3>
      
      <div className="earnings-main">
        <div className="earnings-amount-display">
          <span className="currency-symbol">₹</span>
          <span className="earnings-value">
            {((earnings.earnings?.today || 0) / 100).toFixed(2)}
          </span>
        </div>
        <div className="earnings-trend">
          {earnings.earnings?.today > 0 ? (
            <span className="trend-up">📈 Active today</span>
          ) : (
            <span className="trend-neutral">📊 No earnings yet</span>
          )}
        </div>
      </div>

      <div className="earnings-breakdown">
        <div className="breakdown-item">
          <div className="breakdown-label">Total Earned</div>
          <div className="breakdown-value text-success">
            {formatCurrency(earnings.earnings?.total || 0)}
          </div>
        </div>
        
        <div className="breakdown-item">
          <div className="breakdown-label">Pending</div>
          <div className="breakdown-value text-warning">
            {formatCurrency(earnings.earnings?.pending || 0)}
          </div>
        </div>
        
        <div className="breakdown-item">
          <div className="breakdown-label">Cash Collected</div>
          <div className="breakdown-value">
            {formatCurrency(earnings.earnings?.cashCollected || 0)}
          </div>
        </div>
      </div>

      <div className="earnings-stats">
        <div className="stat-item">
          <div className="stat-label">Deliveries</div>
          <div className="stat-value">
            {earnings.stats?.totalDeliveries || 0}
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-label">Success Rate</div>
          <div className="stat-value">
            {completionRate.toFixed(1)}%
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-label">Avg Rating</div>
          <div className="stat-value">
            {earnings.stats?.averageRating ? 
              `${earnings.stats.averageRating.toFixed(1)} ⭐` : 
              'N/A'
            }
          </div>
        </div>
      </div>

      <div className="earnings-actions">
        <button className="btn btn-outline btn-sm btn-block">
          📊 View Detailed Report
        </button>
      </div>
    </div>
  );
};

export default DeliveryEarnings;
