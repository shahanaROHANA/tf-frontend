// Seller Dashboard Menu Management Integration
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SellerMenuIntegration.css';

const SellerMenuIntegration = ({ seller, onMenuUpdate }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form states
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    cuisine: '',
    tags: [],
    available: true,
    train_friendly: false,
    preparation_time: 15,
    image: ''
  });

  useEffect(() => {
    if (seller) {
      loadSellerRestaurants();
    }
  }, [seller]);

  // Load restaurants owned by the seller
  const loadSellerRestaurants = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would filter restaurants by seller
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/maps/restaurants?seller=${seller._id}`
      );
      
      if (response.data.restaurants) {
        setRestaurants(response.data.restaurants);
        
        // Auto-select first restaurant if only one exists
        if (response.data.restaurants.length === 1) {
          selectRestaurant(response.data.restaurants[0]);
        }
      }
    } catch (err) {
      console.error('Error loading seller restaurants:', err);
      setError('Failed to load your restaurants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Select restaurant and load its menu
  const selectRestaurant = async (restaurant) => {
    setSelectedRestaurant(restaurant);
    setLoading(true);
    
    try {
      // Get restaurant details and menu from Google Maps integration
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/maps/place-details/${restaurant.place_id}?fields=opening_hours,rating,user_ratings_total,formatted_phone_number,website`
      );
      
      if (response.data) {
        // Merge Google data with our restaurant data
        const enhancedRestaurant = {
          ...restaurant,
          google_details: response.data
        };
        setSelectedRestaurant(enhancedRestaurant);
      }
      
      // Load existing menu or create empty state
      if (restaurant.menu && restaurant.menu.length > 0) {
        setMenuItems(restaurant.menu);
      } else {
        setMenuItems([]);
      }
      
    } catch (err) {
      console.error('Error loading restaurant details:', err);
      setError('Failed to load restaurant details.');
    } finally {
      setLoading(false);
    }
  };

  // Add new menu item
  const addMenuItem = async () => {
    if (!newItem.name || !newItem.price) {
      setError('Name and price are required.');
      return;
    }

    setSaving(true);
    try {
      const itemToAdd = {
        ...newItem,
        itemId: `item_${Date.now()}`,
        price: parseFloat(newItem.price),
        preparation_time: parseInt(newItem.preparation_time) || 15,
        tags: newItem.tags.filter(tag => tag.trim() !== ''),
        created_at: new Date().toISOString()
      };

      const updatedMenu = [...menuItems, itemToAdd];
      setMenuItems(updatedMenu);
      
      // Reset form
      setNewItem({
        name: '',
        price: '',
        description: '',
        category: '',
        cuisine: '',
        tags: [],
        available: true,
        train_friendly: false,
        preparation_time: 15,
        image: ''
      });
      
      setSuccess('Menu item added successfully!');
      
      // Auto-save after adding
      setTimeout(() => saveMenu(), 500);
      
    } catch (err) {
      console.error('Error adding menu item:', err);
      setError('Failed to add menu item.');
    } finally {
      setSaving(false);
    }
  };

  // Edit menu item
  const editMenuItem = (item) => {
    setEditingItem({ ...item });
  };

  // Update menu item
  const updateMenuItem = async () => {
    if (!editingItem.name || !editingItem.price) {
      setError('Name and price are required.');
      return;
    }

    setSaving(true);
    try {
      const updatedMenu = menuItems.map(item => 
        item.itemId === editingItem.itemId 
          ? { 
              ...editingItem, 
              price: parseFloat(editingItem.price),
              preparation_time: parseInt(editingItem.preparation_time) || 15,
              updated_at: new Date().toISOString()
            }
          : item
      );
      
      setMenuItems(updatedMenu);
      setEditingItem(null);
      setSuccess('Menu item updated successfully!');
      
      // Auto-save after updating
      setTimeout(() => saveMenu(), 500);
      
    } catch (err) {
      console.error('Error updating menu item:', err);
      setError('Failed to update menu item.');
    } finally {
      setSaving(false);
    }
  };

  // Delete menu item
  const deleteMenuItem = async (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    setSaving(true);
    try {
      const updatedMenu = menuItems.filter(item => item.itemId !== itemId);
      setMenuItems(updatedMenu);
      setSuccess('Menu item deleted successfully!');
      
      // Auto-save after deleting
      setTimeout(() => saveMenu(), 500);
      
    } catch (err) {
      console.error('Error deleting menu item:', err);
      setError('Failed to delete menu item.');
    } finally {
      setSaving(false);
    }
  };

  // Save complete menu to Google Maps integration
  const saveMenu = async () => {
    if (!selectedRestaurant) return;

    setSaving(true);
    try {
      const menuData = {
        custom_data: {
          ...selectedRestaurant.custom_data,
          menu: menuItems,
          menu_last_updated: new Date().toISOString(),
          menu_version: incrementVersion(selectedRestaurant.seller_info?.menu_version || '1.0')
        },
        seller_info: {
          ...selectedRestaurant.seller_info,
          claimed_by_seller: true,
          seller_id: seller._id,
          last_menu_update: new Date().toISOString()
        }
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/maps/restaurant/${selectedRestaurant.place_id}/custom-data`,
        { custom_data: menuData.custom_data }
      );

      if (response.data) {
        setSuccess('Menu saved successfully to Google Maps integration!');
        
        // Update local state
        setSelectedRestaurant({
          ...selectedRestaurant,
          menu: menuItems,
          custom_data: menuData.custom_data,
          seller_info: menuData.seller_info
        });
        
        // Notify parent component
        if (onMenuUpdate) {
          onMenuUpdate({
            restaurant: selectedRestaurant,
            menuItems,
            timestamp: new Date().toISOString()
          });
        }
      }
      
    } catch (err) {
      console.error('Error saving menu:', err);
      setError('Failed to save menu. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Update restaurant delivery settings
  const updateDeliverySettings = async (settings) => {
    if (!selectedRestaurant) return;

    setSaving(true);
    try {
      const updatedData = {
        custom_data: {
          ...selectedRestaurant.custom_data,
          delivery_info: {
            ...selectedRestaurant.custom_data?.delivery_info,
            ...settings
          }
        }
      };

      await axios.put(
        `${import.meta.env.VITE_API_URL}/maps/restaurant/${selectedRestaurant.place_id}/custom-data`,
        updatedData
      );

      setSelectedRestaurant({
        ...selectedRestaurant,
        custom_data: updatedData.custom_data
      });

      setSuccess('Delivery settings updated successfully!');
      
    } catch (err) {
      console.error('Error updating delivery settings:', err);
      setError('Failed to update delivery settings.');
    } finally {
      setSaving(false);
    }
  };

  // Helper function to increment version number
  const incrementVersion = (currentVersion) => {
    const [major, minor] = currentVersion.split('.').map(Number);
    return `${major}.${minor + 1}`;
  };

  // Handle tag input for menu items
  const handleTagInput = (tags, setTags, value) => {
    if (value.includes(',')) {
      const newTags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
      setTags([...tags, ...newTags]);
      return '';
    }
    return value;
  };

  return (
    <div className="seller-menu-integration">
      <div className="integration-header">
        <h2>🍽️ Google Maps Menu Integration</h2>
        <p>Manage your restaurant's menu and delivery information for TrainFood integration</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span>✅ {success}</span>
          <button onClick={() => setSuccess('')}>×</button>
        </div>
      )}

      <div className="integration-content">
        {/* Restaurant Selection */}
        <div className="restaurant-selector">
          <h3>Select Your Restaurant</h3>
          {loading ? (
            <div className="loading">Loading your restaurants...</div>
          ) : restaurants.length > 0 ? (
            <div className="restaurant-list">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.place_id}
                  className={`restaurant-item ${selectedRestaurant?.place_id === restaurant.place_id ? 'selected' : ''}`}
                  onClick={() => selectRestaurant(restaurant)}
                >
                  <div className="restaurant-info">
                    <h4>{restaurant.name}</h4>
                    <p>{restaurant.vicinity}</p>
                    {restaurant.rating && (
                      <span className="rating">⭐ {restaurant.rating} ({restaurant.user_ratings_total || 0} reviews)</span>
                    )}
                  </div>
                  <div className="restaurant-status">
                    {restaurant.seller_info?.claimed_by_seller ? (
                      <span className="claimed">✓ Claimed</span>
                    ) : (
                      <span className="unclaimed">Unclaimed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-restaurants">
              <p>No restaurants found for your account.</p>
              <p>Contact support to claim your restaurant listing.</p>
            </div>
          )}
        </div>

        {/* Menu Management */}
        {selectedRestaurant && (
          <div className="menu-management">
            <div className="restaurant-header">
              <h3>🍽️ {selectedRestaurant.name}</h3>
              <div className="restaurant-meta">
                <span>📍 {selectedRestaurant.vicinity}</span>
                {selectedRestaurant.google_details?.opening_hours && (
                  <span className={`status ${selectedRestaurant.google_details.opening_hours.open_now ? 'open' : 'closed'}`}>
                    {selectedRestaurant.google_details.opening_hours.open_now ? '🟢 Open' : '🔴 Closed'}
                  </span>
                )}
              </div>
              
              <div className="menu-actions">
                <button 
                  className="btn-primary"
                  onClick={saveMenu}
                  disabled={saving || menuItems.length === 0}
                >
                  {saving ? '💾 Saving...' : '💾 Save to Google Maps'}
                </button>
              </div>
            </div>

            {/* Delivery Settings */}
            <div className="delivery-settings">
              <h4>🚆 Train Delivery Settings</h4>
              <div className="settings-grid">
                <div className="setting-item">
                  <label>Delivery to Train Stations</label>
                  <select
                    value={selectedRestaurant.custom_data?.delivery_info?.delivery_to_train ? 'yes' : 'no'}
                    onChange={(e) => updateDeliverySettings({ delivery_to_train: e.target.value === 'yes' })}
                    disabled={saving}
                  >
                    <option value="yes">Enabled</option>
                    <option value="no">Disabled</option>
                  </select>
                </div>
                
                <div className="setting-item">
                  <label>Estimated Delivery Time (minutes)</label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={selectedRestaurant.custom_data?.delivery_info?.estimated_delivery_time || 20}
                    onChange={(e) => updateDeliverySettings({ estimated_delivery_time: parseInt(e.target.value) })}
                    disabled={saving}
                  />
                </div>
                
                <div className="setting-item">
                  <label>Delivery Radius (meters)</label>
                  <input
                    type="number"
                    min="100"
                    max="2000"
                    value={selectedRestaurant.custom_data?.delivery_info?.delivery_radius || 500}
                    onChange={(e) => updateDeliverySettings({ delivery_radius: parseInt(e.target.value) })}
                    disabled={saving}
                  />
                </div>
                
                <div className="setting-item">
                  <label>Price Tier</label>
                  <select
                    value={selectedRestaurant.custom_data?.delivery_info?.price_tier || 'mid'}
                    onChange={(e) => updateDeliverySettings({ price_tier: e.target.value })}
                    disabled={saving}
                  >
                    <option value="budget">Budget ($)</option>
                    <option value="mid">Moderate ($$)</option>
                    <option value="premium">Premium ($$$)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="menu-items-section">
              <div className="section-header">
                <h4>Menu Items ({menuItems.length})</h4>
                <button 
                  className="btn-secondary"
                  onClick={() => setEditingItem({ 
                    name: '', 
                    price: '', 
                    description: '', 
                    category: '',
                    cuisine: '',
                    tags: [],
                    available: true,
                    train_friendly: false,
                    preparation_time: 15
                  })}
                >
                  ➕ Add Item
                </button>
              </div>

              {/* Existing Menu Items */}
              {menuItems.length > 0 ? (
                <div className="menu-items-list">
                  {menuItems.map((item) => (
                    <div key={item.itemId} className="menu-item-card">
                      <div className="item-header">
                        <div className="item-info">
                          <h5>{item.name}</h5>
                          <span className="price">Rs. {item.price}</span>
                          {item.category && <span className="category">{item.category}</span>}
                          {item.train_friendly && <span className="train-badge">🚆 Train-Friendly</span>}
                        </div>
                        <div className="item-actions">
                          <button 
                            className="btn-small"
                            onClick={() => editMenuItem(item)}
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            className="btn-small btn-danger"
                            onClick={() => deleteMenuItem(item.itemId)}
                            disabled={saving}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                      
                      {item.description && (
                        <p className="item-description">{item.description}</p>
                      )}
                      
                      <div className="item-meta">
                        <span className={`availability ${item.available ? 'available' : 'unavailable'}`}>
                          {item.available ? '✅ Available' : '❌ Unavailable'}
                        </span>
                        {item.preparation_time && (
                          <span className="prep-time">⏱️ {item.preparation_time} min</span>
                        )}
                        {item.tags && item.tags.length > 0 && (
                          <div className="item-tags">
                            {item.tags.map((tag, index) => (
                              <span key={index} className="tag">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-menu">
                  <p>No menu items added yet.</p>
                  <p>Click "Add Item" to start building your menu.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Item Modal */}
      {editingItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingItem.itemId ? 'Edit Menu Item' : 'Add Menu Item'}</h3>
              <button 
                className="modal-close"
                onClick={() => setEditingItem(null)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Item Name *</label>
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    placeholder="e.g., Chicken Fried Rice"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Price (Rs.) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                    placeholder="450.00"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    <option value="Rice Dishes">Rice Dishes</option>
                    <option value="Curry Dishes">Curry Dishes</option>
                    <option value="Kottu Dishes">Kottu Dishes</option>
                    <option value="Appetizers">Appetizers</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Cuisine Type</label>
                  <select
                    value={editingItem.cuisine}
                    onChange={(e) => setEditingItem({ ...editingItem, cuisine: e.target.value })}
                  >
                    <option value="">Select Cuisine</option>
                    <option value="sri_lankan">Sri Lankan</option>
                    <option value="chinese">Chinese</option>
                    <option value="indian">Indian</option>
                    <option value="italian">Italian</option>
                    <option value="seafood">Seafood</option>
                  </select>
                </div>
                
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    placeholder="Describe the dish, ingredients, and special features..."
                    rows="3"
                  />
                </div>
                
                <div className="form-group">
                  <label>Preparation Time (minutes)</label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={editingItem.preparation_time}
                    onChange={(e) => setEditingItem({ ...editingItem, preparation_time: e.target.value })}
                  />
                </div>
                
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={editingItem.available}
                      onChange={(e) => setEditingItem({ ...editingItem, available: e.target.checked })}
                    />
                    Available for Order
                  </label>
                </div>
                
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={editingItem.train_friendly}
                      onChange={(e) => setEditingItem({ ...editingItem, train_friendly: e.target.checked })}
                    />
                    🚆 Train-Friendly (travels well)
                  </label>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setEditingItem(null)}
                disabled={saving}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={editingItem.itemId ? updateMenuItem : addMenuItem}
                disabled={saving || !editingItem.name || !editingItem.price}
              >
                {saving ? 'Saving...' : (editingItem.itemId ? 'Update Item' : 'Add Item')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerMenuIntegration;