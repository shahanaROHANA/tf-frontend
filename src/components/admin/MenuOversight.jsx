import { useState, useEffect } from 'react';
import { FaUtensils, FaFlag, FaToggleOn, FaToggleOff, FaEye, FaEdit } from 'react-icons/fa';

const MenuOversight = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/menus`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMenuItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL}/admin/menus/${itemId}/toggle`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchMenuItems();
    } catch (error) {
      console.error('Error toggling menu item:', error);
    }
  };

  const flagMenuItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL}/admin/menus/${itemId}/flag`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: flagReason })
      });
      fetchMenuItems();
      setShowFlagModal(false);
      setFlagReason('');
    } catch (error) {
      console.error('Error flagging menu item:', error);
    }
  };

  const filteredItems = menuItems.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'active') return item.isActive;
    if (filter === 'inactive') return !item.isActive;
    if (filter === 'flagged') return item.isFlagged;
    return true;
  });

  if (loading) {
    return <div className="loading-spinner">Loading menu items...</div>;
  }

  return (
    <div className="menu-oversight">
      {/* Header */}
      <div className="admin-card">
        <h2>🍽️ Menu Oversight</h2>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
          <label style={{ fontWeight: '600' }}>Filter:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '8px', border: '2px solid #ecf0f1' }}
          >
            <option value="all">All Items</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="flagged">Flagged</option>
          </select>
          <span style={{ color: '#636e72' }}>
            Showing {filteredItems.length} of {menuItems.length} items
          </span>
        </div>
      </div>

      {/* Menu Items Grid */}
      {filteredItems.length > 0 ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {filteredItems.map((item) => (
            <div key={item._id} className="admin-card">
              <div style={{ position: 'relative' }}>
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    style={{ 
                      width: '100%', 
                      height: '200px', 
                      objectFit: 'cover',
                      borderRadius: '12px 12px 0 0'
                    }}
                  />
                )}
                {item.isFlagged && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#e74c3c',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <FaFlag /> Flagged
                  </div>
                )}
                {!item.isActive && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: '#95a5a6',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    Inactive
                  </div>
                )}
              </div>
              
              <div style={{ padding: '1rem 0' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3436' }}>
                  {item.name}
                </h3>
                <p style={{ 
                  margin: '0 0 1rem 0', 
                  color: '#636e72',
                  fontSize: '0.9rem',
                  lineHeight: '1.4'
                }}>
                  {item.description || 'No description available'}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <span style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 'bold', 
                    color: '#27ae60' 
                  }}>
                    ₹{(item.priceCents / 100).toFixed(2)}
                  </span>
                  <span className={`status-badge ${item.category ? 'status-active' : 'status-inactive'}`}>
                    {item.category || 'Uncategorized'}
                  </span>
                </div>

                <div style={{ 
                  fontSize: '0.8rem', 
                  color: '#636e72',
                  marginBottom: '1rem'
                }}>
                  <div>📍 {item.station || 'No station'}</div>
                  <div>🏪 {item.seller?.name || 'Unknown vendor'}</div>
                  <div>📦 Stock: {item.stock === null ? 'Unlimited' : item.stock}</div>
                </div>

                {item.isFlagged && item.flagReason && (
                  <div style={{
                    background: '#ffeaa7',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    color: '#d63031',
                    marginBottom: '1rem'
                  }}>
                    <strong>Flag Reason:</strong> {item.flagReason}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button
                    className={`btn ${item.isActive ? 'btn-warning' : 'btn-success'}`}
                    onClick={() => toggleMenuItem(item._id)}
                    title={item.isActive ? 'Deactivate Item' : 'Activate Item'}
                  >
                    {item.isActive ? <FaToggleOn /> : <FaToggleOff />}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      setSelectedItem(item);
                      setShowFlagModal(true);
                    }}
                    title="Flag Item"
                  >
                    <FaFlag />
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => setSelectedItem(item)}
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No menu items found</h3>
          <p>
            {filter === 'all' 
              ? 'No menu items have been added yet.' 
              : `No ${filter} menu items found.`}
          </p>
        </div>
      )}

      {/* Flag Modal */}
      {showFlagModal && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowFlagModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Flag Menu Item</h2>
              <button className="close-modal" onClick={() => setShowFlagModal(false)}>
                ×
              </button>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <p><strong>Item:</strong> {selectedItem.name}</p>
              <p><strong>Vendor:</strong> {selectedItem.seller?.name}</p>
            </div>
            <form 
              className="admin-form"
              onSubmit={(e) => {
                e.preventDefault();
                flagMenuItem(selectedItem._id);
              }}
            >
              <div className="form-group">
                <label>Flag Reason</label>
                <textarea 
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  placeholder="Please provide a reason for flagging this item..."
                  rows={4}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowFlagModal(false);
                    setFlagReason('');
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger">
                  Flag Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Item Details Modal */}
      {selectedItem && !showFlagModal && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Menu Item Details</h2>
              <button className="close-modal" onClick={() => setSelectedItem(null)}>
                ×
              </button>
            </div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {selectedItem.imageUrl && (
                <img 
                  src={selectedItem.imageUrl} 
                  alt={selectedItem.name}
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              )}
              <div>
                <h3>{selectedItem.name}</h3>
                <p style={{ color: '#636e72', lineHeight: '1.4' }}>
                  {selectedItem.description || 'No description available'}
                </p>
              </div>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '1rem' 
              }}>
                <div>
                  <strong>Price:</strong> ₹{(selectedItem.priceCents / 100).toFixed(2)}
                </div>
                <div>
                  <strong>Category:</strong> {selectedItem.category || 'Uncategorized'}
                </div>
                <div>
                  <strong>Station:</strong> {selectedItem.station || 'Not specified'}
                </div>
                <div>
                  <strong>Stock:</strong> {selectedItem.stock === null ? 'Unlimited' : selectedItem.stock}
                </div>
                <div>
                  <strong>Vendor:</strong> {selectedItem.seller?.name || 'Unknown'}
                </div>
                <div>
                  <strong>Status:</strong> 
                  <span className={`status-badge ${selectedItem.isActive ? 'status-active' : 'status-inactive'}`}>
                    {selectedItem.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              {selectedItem.isFlagged && (
                <div style={{
                  background: '#ffeaa7',
                  padding: '1rem',
                  borderRadius: '8px',
                  color: '#d63031'
                }}>
                  <strong>⚠️ Flagged:</strong> {selectedItem.flagReason}
                </div>
              )}
              <div style={{ fontSize: '0.8rem', color: '#636e72' }}>
                <strong>Created:</strong> {new Date(selectedItem.createdAt).toLocaleDateString()}
                <br />
                <strong>Last Updated:</strong> {new Date(selectedItem.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}Analytics.jsx:16 
      GET http://localhost:5173/api/admin/analytics?period=monthly 401 (Unauthorized)
     Analytics.jsx:16 
      GET http://localhost:5173/api/admin/analytics?period=monthly 401 (Unauthorized)
     Analytics.jsx:117 Uncaught TypeError: Cannot read properties of undefined (reading 'toFixed')
         at Analytics (Analytics.jsx:117:43)
     
    </div>
  );
};

export default MenuOversight;
