import React, { useState } from 'react';

const OrderOTPModal = ({ orderId, onClose, onConfirm }) => {
  const [otp, setOtp] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGenerateOTP, setShowGenerateOTP] = useState(false);

  const handleGenerateOTP = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('deliveryToken');
      const response = await fetch(`/api/delivery/otp/${orderId}/generate`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedOTP(data.otp);
        setShowGenerateOTP(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to generate OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    const proof = {
      type: 'OTP',
      value: otp,
      timestamp: new Date().toISOString()
    };

    onConfirm(proof);
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('deliveryToken');
      const response = await fetch('/api/delivery/otp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId, otp })
      });

      if (response.ok) {
        const proof = {
          type: 'OTP',
          value: otp,
          timestamp: new Date().toISOString()
        };

        onConfirm(proof);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoProof = () => {
    // In a real app, this would open camera
    const proof = {
      type: 'PHOTO',
      value: 'photo_url_placeholder', // Would be actual photo URL
      timestamp: new Date().toISOString()
    };

    onConfirm(proof);
  };

  const handleSignatureProof = () => {
    // In a real app, this would open signature pad
    const proof = {
      type: 'SIGNATURE',
      value: 'signature_url_placeholder', // Would be actual signature URL
      timestamp: new Date().toISOString()
    };

    onConfirm(proof);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>✅ Complete Delivery</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="delivery-verification">
            <h4>Choose Verification Method:</h4>
            
            <div className="verification-options">
              <div className="verification-option">
                <button 
                  className="btn btn-outline btn-block"
                  onClick={() => setShowGenerateOTP(true)}
                >
                  🔢 Generate OTP
                </button>
                <p className="option-description">
                  Generate OTP and send to customer
                </p>
              </div>

              <div className="verification-option">
                <button 
                  className="btn btn-outline btn-block"
                  onClick={handlePhotoProof}
                >
                  📷 Take Photo
                </button>
                <p className="option-description">
                  Take photo of delivered items
                </p>
              </div>

              <div className="verification-option">
                <button 
                  className="btn btn-outline btn-block"
                  onClick={handleSignatureProof}
                >
                  ✍️ Get Signature
                </button>
                <p className="option-description">
                  Get customer signature
                </p>
              </div>
            </div>

            {showGenerateOTP && (
              <div className="otp-section">
                <h5>OTP Verification</h5>
                
                {generatedOTP ? (
                  <div className="generated-otp">
                    <p>OTP has been generated and sent to customer:</p>
                    <div className="otp-display">{generatedOTP}</div>
                    <p className="otp-note">
                      Ask customer to provide this OTP for verification
                    </p>
                  </div>
                ) : (
                  <div className="otp-generate">
                    <p>Click Generate OTP to create a verification code</p>
                    <button 
                      className="btn btn-primary"
                      onClick={handleGenerateOTP}
                      disabled={loading}
                    >
                      {loading ? 'Generating...' : 'Generate OTP'}
                    </button>
                  </div>
                )}

                {generatedOTP && (
                  <div className="otp-verify">
                    <label>Enter OTP provided by customer:</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit OTP"
                      className="otp-input"
                    />
                    <button 
                      className="btn btn-success btn-block"
                      onClick={handleVerifyOTP}
                      disabled={loading || otp.length !== 6}
                    >
                      {loading ? 'Verifying...' : 'Verify OTP & Complete'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderOTPModal;
