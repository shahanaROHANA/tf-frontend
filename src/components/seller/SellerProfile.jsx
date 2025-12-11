import React, { useState, useEffect } from 'react';

const SellerProfile = ({ sellerData, onUpdate }) => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    restaurantName: '',
    station: '',
    phone: '',
    address: '',
    description: '',
    logoUrl: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (sellerData) {
      setProfile({
        name: sellerData.name || '',
        email: sellerData.email || '',
        restaurantName: sellerData.restaurantName || '',
        station: sellerData.station || '',
        phone: sellerData.phone || '',
        address: sellerData.address || '',
        description: sellerData.description || '',
        logoUrl: sellerData.logoUrl || '',
        isActive: sellerData.isActive !== undefined ? sellerData.isActive : true
      });
    }
  }, [sellerData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if seller is authenticated before making API calls
    const token = localStorage.getItem('sellerToken') || localStorage.getItem('token');
    if (!token) {
      setMessage('Please login to update profile');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/seller/dashboard/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
        setEditing(false);
        onUpdate();
      } else {
        const error = await response.json();
        setMessage(error.message || 'Failed to update profile');
      }
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, simulate image upload
      // In production, you'd upload to a service like Cloudinary or AWS S3
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          logoUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="seller-profile">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">👤 Profile Management</h2>
          <button 
            className={`btn ${editing ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => setEditing(!editing)}
          >
            {editing ? '❌ Cancel' : '✏️ Edit Profile'}
          </button>
        </div>

        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}

        {!editing ? (
          <div className="profile-view">
            <div className="profile-header">
              <div className="profile-avatar">
                {profile.logoUrl ? (
                  <img src={profile.logoUrl} alt="Restaurant Logo" className="avatar-image" />
                ) : (
                  <div className="avatar-placeholder">🍱</div>
                )}
              </div>
              <div className="profile-info">
                <h3>{profile.restaurantName}</h3>
                <p className="text-muted">👨‍🍳 {profile.name}</p>
                <p className="text-muted">📧 {profile.email}</p>
                <div className="profile-status">
                  <span className={`status-badge ${profile.isActive ? 'active' : 'inactive'}`}>
                    {profile.isActive ? '🟢 Active' : '🔴 Inactive'}
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-section">
                <h4>📍 Location</h4>
                <p><strong>Station:</strong> {profile.station}</p>
                {profile.address && <p><strong>Address:</strong> {profile.address}</p>}
                {profile.phone && <p><strong>Phone:</strong> {profile.phone}</p>}
              </div>

              {profile.description && (
                <div className="detail-section">
                  <h4>📝 Description</h4>
                  <p>{profile.description}</p>
                </div>
              )}

              <div className="detail-section">
                <h4>📊 Account Status</h4>
                <p><strong>Approval Status:</strong> {sellerData?.isApproved ? '✅ Approved' : '⏳ Pending'}</p>
                <p><strong>Account Active:</strong> {profile.isActive ? '✅ Yes' : '❌ No'}</p>
                <p><strong>Member Since:</strong> {new Date(sellerData?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Restaurant Name</label>
                <input
                  type="text"
                  name="restaurantName"
                  value={profile.restaurantName}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Station</label>
                <input
                  type="text"
                  name="station"
                  value={profile.station}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Platform 2, Near Food Court"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Restaurant Description</label>
              <textarea
                name="description"
                value={profile.description}
                onChange={handleChange}
                className="form-control"
                rows="4"
                placeholder="Tell customers about your restaurant, specialties, etc."
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Restaurant Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="form-control"
              />
              {profile.logoUrl && (
                <div className="image-preview">
                  <img src={profile.logoUrl} alt="Logo preview" className="preview-image" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={profile.isActive}
                  onChange={handleChange}
                  style={{ marginRight: '8px' }}
                />
                Restaurant is currently active and accepting orders
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="loading-spinner"></span> : '💾 Save Changes'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
};

export default SellerProfile;
