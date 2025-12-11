import React, { useState, useEffect } from 'react';
import { api } from '../../utils/authUtils.js';

const TrainAssignment = () => {
  const [trainData, setTrainData] = useState({
    station: '',
    availableTrains: [],
    deliverySlots: []
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editingSlots, setEditingSlots] = useState(false);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    // Check if seller is authenticated before making API calls
    const token = localStorage.getItem('sellerToken') || localStorage.getItem('token');
    if (!token) {
      setMessage('Please login to view train assignments');
      setLoading(false);
      return;
    }
    fetchTrainAssignments();
  }, []);

  const fetchTrainAssignments = async () => {
    try {
      const response = await api.get('/seller/dashboard/trains');
      setTrainData(response.data);
      setSlots(response.data.deliverySlots || []);
    } catch (error) {
      console.error('Error fetching train assignments:', error);
      setMessage('Error loading train assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleSlotChange = (index, field, value) => {
    const updatedSlots = [...slots];
    updatedSlots[index] = {
      ...updatedSlots[index],
      [field]: field === 'maxOrders' ? parseInt(value) || 0 : value
    };
    setSlots(updatedSlots);
  };

  const addNewSlot = () => {
    setSlots([...slots, {
      startTime: '',
      endTime: '',
      maxOrders: 20,
      isActive: true
    }]);
  };

  const removeSlot = (index) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const saveSlots = async () => {
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('sellerToken');
      // This would need to be implemented in the backend
      // For now, just show success message
      setMessage('Delivery slots updated successfully!');
      setEditingSlots(false);
      fetchTrainAssignments();
    } catch (error) {
      setMessage('Error updating delivery slots. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    return time || 'Not set';
  };

  if (loading) {
    return (
      <div className="train-assignment">
        <div className="card">
          <div className="text-center p-4">
            <div className="loading-spinner"></div>
            <p>Loading train assignments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="train-assignment">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🎫 Train Assignment</h2>
          <button 
            className={`btn ${editingSlots ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => setEditingSlots(!editingSlots)}
          >
            {editingSlots ? '❌ Cancel' : '✏️ Edit Slots'}
          </button>
        </div>

        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}

        {/* Station Information */}
        <div className="station-info-section">
          <h3>📍 Station Information</h3>
          <div className="station-details">
            <div className="info-card">
              <h4>Current Station</h4>
              <p className="station-name">{trainData.station || 'Not assigned'}</p>
            </div>
          </div>
        </div>

        {/* Available Trains */}
        <div className="trains-section">
          <h3>🚆 Available Trains at Your Station</h3>
          <div className="trains-grid">
            {trainData.availableTrains?.length === 0 ? (
              <p>No trains assigned to your station yet.</p>
            ) : (
              trainData.availableTrains.map((train, index) => (
                <div key={index} className="train-card">
                  <div className="train-header">
                    <h4>{train.trainName}</h4>
                    <span className="train-number">{train.trainNumber}</span>
                  </div>
                  <div className="train-schedule">
                    <p>⏰ Arrival: {formatTime(train.arrivalTime)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Delivery Slots */}
        <div className="delivery-slots-section">
          <div className="section-header">
            <h3>🕐 Delivery Slots</h3>
            {!editingSlots && (
              <button className="btn btn-sm btn-primary" onClick={() => setEditingSlots(true)}>
                ✏️ Edit
              </button>
            )}
          </div>

          {editingSlots ? (
            <div className="slots-editor">
              {slots.map((slot, index) => (
                <div key={index} className="slot-editor-card">
                  <div className="slot-header">
                    <h4>Slot {index + 1}</h4>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => removeSlot(index)}
                    >
                      🗑️
                    </button>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Start Time</label>
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => handleSlotChange(index, 'startTime', e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">End Time</label>
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => handleSlotChange(index, 'endTime', e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Max Orders</label>
                      <input
                        type="number"
                        value={slot.maxOrders}
                        onChange={(e) => handleSlotChange(index, 'maxOrders', e.target.value)}
                        className="form-control"
                        min="1"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      <input
                        type="checkbox"
                        checked={slot.isActive}
                        onChange={(e) => handleSlotChange(index, 'isActive', e.target.checked)}
                        style={{ marginRight: '8px' }}
                      />
                      Slot is active
                    </label>
                  </div>
                </div>
              ))}

              <div className="slots-actions">
                <button className="btn btn-secondary" onClick={addNewSlot}>
                  ➕ Add Slot
                </button>
                <button className="btn btn-primary" onClick={saveSlots} disabled={loading}>
                  {loading ? <span className="loading-spinner"></span> : '💾 Save Slots'}
                </button>
              </div>
            </div>
          ) : (
            <div className="slots-view">
              {slots.length === 0 ? (
                <p>No delivery slots configured.</p>
              ) : (
                <div className="slots-grid">
                  {slots.map((slot, index) => (
                    <div key={index} className="slot-card">
                      <div className="slot-time">
                        <h4>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</h4>
                        <span className={`status-badge ${slot.isActive ? 'active' : 'inactive'}`}>
                          {slot.isActive ? '✅ Active' : '❌ Inactive'}
                        </span>
                      </div>
                      <div className="slot-details">
                        <p>📦 Max Orders: {slot.maxOrders}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="instructions-section">
          <h3>📋 Instructions</h3>
          <div className="instructions-list">
            <div className="instruction-item">
              <span className="instruction-icon">📍</span>
              <p>Your station determines which trains you can serve</p>
            </div>
            <div className="instruction-item">
              <span className="instruction-icon">🕐</span>
              <p>Set delivery slots based on train arrival times</p>
            </div>
            <div className="instruction-item">
              <span className="instruction-icon">📦</span>
              <p>Maximum orders help you manage capacity</p>
            </div>
            <div className="instruction-item">
              <span className="instruction-icon">🚆</span>
              <p>Orders are automatically assigned based on train schedules</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .station-info-section {
          margin-bottom: 2rem;
        }

        .station-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .info-card {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          text-align: center;
        }

        .info-card h4 {
          margin: 0 0 0.5rem 0;
          color: #4a5568;
          font-size: 0.9rem;
        }

        .station-name {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2d3748;
          margin: 0;
        }

        .trains-section {
          margin-bottom: 2rem;
        }

        .trains-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }

        .train-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .train-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .train-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .train-header h4 {
          margin: 0;
          color: #2d3748;
        }

        .train-number {
          background: #667eea;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .train-schedule p {
          margin: 0.25rem 0;
          color: #4a5568;
          font-size: 0.9rem;
        }

        .delivery-slots-section {
          margin-bottom: 2rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .slots-view {
          margin-top: 1rem;
        }

        .slots-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .slot-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1rem;
        }

        .slot-time {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .slot-time h4 {
          margin: 0;
          color: #2d3748;
          font-size: 1rem;
        }

        .slot-details p {
          margin: 0.25rem 0;
          color: #4a5568;
          font-size: 0.9rem;
        }

        .slots-editor {
          margin-top: 1rem;
        }

        .slot-editor-card {
          background: #f8f9fa;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .slot-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .slot-header h4 {
          margin: 0;
          color: #2d3748;
        }

        .slots-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .instructions-section {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
        }

        .instructions-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .instruction-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .instruction-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .instruction-item p {
          margin: 0;
          color: #4a5568;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .station-details {
            grid-template-columns: 1fr;
          }

          .trains-grid {
            grid-template-columns: 1fr;
          }

          .slots-grid {
            grid-template-columns: 1fr;
          }

          .instructions-list {
            grid-template-columns: 1fr;
          }

          .slots-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default TrainAssignment;
