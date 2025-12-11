import { useState, useEffect } from 'react';
import { FaCog, FaSave, FaToggleOn, FaToggleOff, FaPalette, FaRupeeSign } from 'react-icons/fa';

const PlatformSettings = () => {
  const [settings, setSettings] = useState({
    deliveryCharge: 40,
    taxRate: 5,
    platformCommission: 10,
    maintenanceMode: false,
    branding: {
      logo: '',
      primaryColor: '#667eea',
      secondaryColor: '#764ba2'
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      // Map backend data structure to frontend format
      setSettings({
        deliveryCharge: data.deliveryFee || 40,
        taxRate: 5, // Default value since backend doesn't have taxRate
        platformCommission: data.commission || 10,
        maintenanceMode: false, // Default value since backend doesn't have maintenanceMode
        branding: {
          logo: '',
          primaryColor: '#667eea',
          secondaryColor: '#764ba2'
        }
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Keep default settings if fetch fails
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      // Map frontend data to backend format
      const backendSettings = {
        platformName: 'TrainFood',
        commission: settings.platformCommission,
        supportEmail: 'support@trainfood.com',
        supportPhone: '+91-XXXXXXXXXX',
        minOrderAmount: 100,
        deliveryFee: settings.deliveryCharge,
        features: {
          enableDelivery: true,
          enablePayments: true,
          enableChat: true
        }
      };
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(backendSettings)
      });
      
      if (response.ok) {
        setMessage('Settings saved successfully!');
      } else {
        setMessage('Error saving settings. Please try again.');
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBrandingChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      branding: {
        ...prev.branding,
        [field]: value
      }
    }));
  };

  if (loading) {
    return <div className="loading-spinner">Loading settings...</div>;
  }

  return (
    <div className="platform-settings">
      {/* Header */}
      <div className="admin-card">
        <h2>⚙️ Platform Settings</h2>
        <p style={{ color: '#636e72', marginTop: '0.5rem' }}>
          Configure your TrainFood platform settings and preferences.
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className={`admin-card ${message.includes('Error') ? 'error' : 'success'}`} style={{
          background: message.includes('Error') ? '#f8d7da' : '#d4edda',
          color: message.includes('Error') ? '#721c24' : '#155724',
          border: `1px solid ${message.includes('Error') ? '#f5c6cb' : '#c3e6cb'}`
        }}>
          {message}
        </div>
      )}

      {/* Financial Settings */}
      <div className="admin-card">
        <h3>💰 Financial Settings</h3>
        <div className="admin-form">
          <div className="form-group">
            <label>
              <FaRupeeSign /> Delivery Charge (₹)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={settings.deliveryCharge}
              onChange={(e) => handleInputChange('deliveryCharge', parseInt(e.target.value))}
            />
            <small style={{ color: '#636e72' }}>
              Amount charged for food delivery
            </small>
          </div>

          <div className="form-group">
            <label>Tax Rate (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={settings.taxRate}
              onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value))}
            />
            <small style={{ color: '#636e72' }}>
              Tax percentage applied to orders
            </small>
          </div>

          <div className="form-group">
            <label>Platform Commission (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={settings.platformCommission}
              onChange={(e) => handleInputChange('platformCommission', parseFloat(e.target.value))}
            />
            <small style={{ color: '#636e72' }}>
              Commission taken from vendor earnings
            </small>
          </div>
        </div>
      </div>

      {/* Platform Status */}
      <div className="admin-card">
        <h3>🚦 Platform Status</h3>
        <div className="admin-form">
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Maintenance Mode
              {settings.maintenanceMode ? (
                <FaToggleOn style={{ color: '#e74c3c' }} />
              ) : (
                <FaToggleOff style={{ color: '#27ae60' }} />
              )}
            </label>
            <div style={{ 
              padding: '1rem', 
              background: '#f8f9fa', 
              borderRadius: '8px',
              border: `2px solid ${settings.maintenanceMode ? '#e74c3c' : '#27ae60'}`
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                />
                <span>
                  {settings.maintenanceMode ? (
                    <span style={{ color: '#e74c3c', fontWeight: '600' }}>
                      ⚠️ Platform is in MAINTENANCE MODE
                    </span>
                  ) : (
                    <span style={{ color: '#27ae60', fontWeight: '600' }}>
                      ✅ Platform is LIVE
                    </span>
                  )}
                </span>
              </label>
              <small style={{ color: '#636e72', display: 'block', marginTop: '0.5rem' }}>
                When enabled, users will see a maintenance message and cannot place orders.
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Branding Settings */}
      <div className="admin-card">
        <h3>
          <FaPalette /> Branding & Appearance
        </h3>
        <div className="admin-form">
          <div className="form-group">
            <label>Logo URL</label>
            <input
              type="url"
              placeholder="https://example.com/logo.png"
              value={settings.branding.logo}
              onChange={(e) => handleBrandingChange('logo', e.target.value)}
            />
            <small style={{ color: '#636e72' }}>
              URL to your company logo
            </small>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '1rem' 
          }}>
            <div className="form-group">
              <label>Primary Color</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="color"
                  value={settings.branding.primaryColor}
                  onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                  style={{ width: '50px', height: '40px', border: 'none', borderRadius: '8px' }}
                />
                <input
                  type="text"
                  value={settings.branding.primaryColor}
                  onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                  placeholder="#667eea"
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Secondary Color</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="color"
                  value={settings.branding.secondaryColor}
                  onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                  style={{ width: '50px', height: '40px', border: 'none', borderRadius: '8px' }}
                />
                <input
                  type="text"
                  value={settings.branding.secondaryColor}
                  onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                  placeholder="#764ba2"
                  style={{ flex: 1 }}
                />
              </div>
            </div>
          </div>

          {/* Color Preview */}
          <div style={{ 
            padding: '1rem', 
            borderRadius: '8px',
            background: `linear-gradient(135deg, ${settings.branding.primaryColor} 0%, ${settings.branding.secondaryColor} 100%)`,
            color: 'white',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            Color Preview
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4>Save Changes</h4>
            <p style={{ color: '#636e72', margin: '0.5rem 0 0 0' }}>
              Click to save all platform settings
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={saveSettings}
            disabled={saving}
            style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
          >
            {saving ? (
              <>Saving...</>
            ) : (
              <>
                <FaSave /> Save Settings
              </>
            )}
          </button>
        </div>
      </div>

      {/* Current Settings Summary */}
      <div className="admin-card">
        <h3>📋 Current Settings Summary</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <strong>Delivery Charge:</strong> ₹{settings.deliveryCharge}
          </div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <strong>Tax Rate:</strong> {settings.taxRate}%
          </div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <strong>Platform Commission:</strong> {settings.platformCommission}%
          </div>
          <div style={{ 
            padding: '1rem', 
            background: settings.maintenanceMode ? '#f8d7da' : '#d4edda', 
            borderRadius: '8px' 
          }}>
            <strong>Status:</strong> {settings.maintenanceMode ? 'Maintenance' : 'Live'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformSettings;
