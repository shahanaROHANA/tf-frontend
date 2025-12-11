// src/components/FeedbackModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FeedbackModal.css';

const FeedbackModal = ({ 
  isOpen, 
  onClose, 
  orderId, 
  orderNumber, 
  sellerInfo,
  deliveryAgentInfo,
  onFeedbackSubmitted 
}) => {
  const [formData, setFormData] = useState({
    rating: 0,
    summary: '',
    detailedComment: '',
    target: 'seller',
    tags: [],
    isAnonymous: false
  });
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [characterCounts, setCharacterCounts] = useState({
    summary: 0,
    detailedComment: 0
  });

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const targetOptions = [
    { value: 'seller', label: 'Restaurant/Seller', icon: '🏪' },
    { value: 'delivery_agent', label: 'Delivery Agent', icon: '🚚' },
    { value: 'platform', label: 'Platform', icon: '📱' },
    { value: 'general', label: 'General', icon: '💬' }
  ];

  const tagOptions = [
    { value: 'food_quality', label: 'Food Quality', icon: '🍽️' },
    { value: 'delivery_speed', label: 'Delivery Speed', icon: '⚡' },
    { value: 'packaging', label: 'Packaging', icon: '📦' },
    { value: 'customer_service', label: 'Customer Service', icon: '🤝' },
    { value: 'price_value', label: 'Price Value', icon: '💰' },
    { value: 'accuracy', label: 'Order Accuracy', icon: '✓' },
    { value: 'cleanliness', label: 'Cleanliness', icon: '🧼' },
    { value: 'friendliness', label: 'Friendliness', icon: '😊' },
    { value: 'navigation', label: 'Navigation', icon: '🧭' },
    { value: 'app_experience', label: 'App Experience', icon: '📱' },
    { value: 'payment_issues', label: 'Payment Issues', icon: '💳' },
    { value: 'other', label: 'Other', icon: '📝' }
  ];

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        rating: 0,
        summary: '',
        detailedComment: '',
        target: 'seller',
        tags: [],
        isAnonymous: false
      });
      setMediaFiles([]);
      setMediaPreviews([]);
      setErrors({});
      setCharacterCounts({ summary: 0, detailedComment: 0 });
    }
  }, [isOpen]);

  // Update character counts
  useEffect(() => {
    setCharacterCounts({
      summary: formData.summary.length,
      detailedComment: formData.detailedComment.length
    });
  }, [formData.summary, formData.detailedComment]);

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
    setErrors(prev => ({ ...prev, rating: '' }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTagToggle = (tagValue) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagValue)
        ? prev.tags.filter(t => t !== tagValue)
        : [...prev.tags, tagValue]
    }));
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
      if (!validTypes.includes(file.type)) {
        alert(`File type ${file.type} is not supported. Please use JPEG, PNG, GIF, or MP4.`);
        return false;
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }
      return true;
    });

    if (mediaFiles.length + validFiles.length > 5) {
      alert('Maximum 5 files allowed.');
      return;
    }

    setMediaFiles(prev => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreviews(prev => [...prev, {
          file,
          url: e.target.result,
          type: file.type.startsWith('image/') ? 'image' : 'video'
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    if (!formData.detailedComment.trim()) {
      newErrors.detailedComment = 'Detailed comment is required';
    } else if (formData.detailedComment.length < 10) {
      newErrors.detailedComment = 'Comment must be at least 10 characters long';
    }

    if (formData.detailedComment.length > 2000) {
      newErrors.detailedComment = 'Comment cannot exceed 2000 characters';
    }

    if (formData.summary.length > 200) {
      newErrors.summary = 'Summary cannot exceed 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();

      // Add form fields
      formDataToSend.append('orderId', orderId);
      formDataToSend.append('rating', formData.rating);
      formDataToSend.append('summary', formData.summary);
      formDataToSend.append('detailedComment', formData.detailedComment);
      formDataToSend.append('target', formData.target);
      formDataToSend.append('tags', JSON.stringify(formData.tags));
      formDataToSend.append('isAnonymous', formData.isAnonymous);

      // Add media files
      mediaFiles.forEach((file, index) => {
        formDataToSend.append('media', file);
      });

      const response = await axios.post(
        `${API_BASE_URL}/api/feedback/create`,
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        alert('Feedback submitted successfully! It will be reviewed and published soon.');
        onFeedbackSubmitted?.(response.data.data);
        onClose();
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit feedback';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="rating-input">
        <span className="rating-label">Overall Rating *</span>
        <div className="stars-container">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`star ${formData.rating >= star ? 'filled' : ''}`}
              onClick={() => handleRatingClick(star)}
              disabled={isSubmitting}
            >
              ⭐
            </button>
          ))}
        </div>
        {errors.rating && <span className="error-text">{errors.rating}</span>}
        {formData.rating > 0 && (
          <span className="rating-text">
            {formData.rating} {formData.rating === 1 ? 'star' : 'stars'}
          </span>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="feedback-modal-overlay">
      <div className="feedback-modal">
        <div className="modal-header">
          <h2>Share Your Feedback</h2>
          <button className="close-button" onClick={onClose} disabled={isSubmitting}>
            ×
          </button>
        </div>

        <div className="order-info">
          <div className="order-details">
            <span className="order-number">Order #{orderNumber}</span>
            {sellerInfo && (
              <span className="seller-info">for {sellerInfo.restaurantName}</span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          {/* Rating */}
          {renderStars()}

          {/* Target Selection */}
          <div className="form-group">
            <label className="form-label">Feedback About *</label>
            <div className="target-options">
              {targetOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`target-option ${formData.target === option.value ? 'selected' : ''}`}
                  onClick={() => handleInputChange('target', option.value)}
                  disabled={isSubmitting}
                >
                  <span className="target-icon">{option.icon}</span>
                  <span className="target-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="form-group">
            <label className="form-label">
              Quick Summary (Optional)
              <span className="char-count">{characterCounts.summary}/200</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={formData.summary}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              placeholder="e.g., Great food, fast delivery!"
              maxLength={200}
              disabled={isSubmitting}
            />
            {errors.summary && <span className="error-text">{errors.summary}</span>}
          </div>

          {/* Detailed Comment */}
          <div className="form-group">
            <label className="form-label">
              Detailed Comment *
              <span className="char-count">{characterCounts.detailedComment}/2000</span>
            </label>
            <textarea
              className={`form-textarea ${errors.detailedComment ? 'error' : ''}`}
              value={formData.detailedComment}
              onChange={(e) => handleInputChange('detailedComment', e.target.value)}
              placeholder="Tell us about your experience in detail..."
              maxLength={2000}
              rows={4}
              disabled={isSubmitting}
            />
            {errors.detailedComment && <span className="error-text">{errors.detailedComment}</span>}
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">What can we improve? (Optional)</label>
            <div className="tags-container">
              {tagOptions.map((tag) => (
                <button
                  key={tag.value}
                  type="button"
                  className={`tag-option ${formData.tags.includes(tag.value) ? 'selected' : ''}`}
                  onClick={() => handleTagToggle(tag.value)}
                  disabled={isSubmitting}
                >
                  <span className="tag-icon">{tag.icon}</span>
                  <span className="tag-label">{tag.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Media Upload */}
          <div className="form-group">
            <label className="form-label">Add Photos/Videos (Optional)</label>
            <div className="media-upload">
              <input
                type="file"
                multiple
                accept="image/*,video/mp4"
                onChange={handleFileSelect}
                disabled={isSubmitting || mediaFiles.length >= 5}
                className="file-input"
                id="media-upload"
              />
              <label htmlFor="media-upload" className="file-upload-label">
                📎 Add Photos/Videos ({mediaFiles.length}/5)
              </label>
              <span className="upload-info">Max 5 files, 5MB each</span>
            </div>

            {/* Media Previews */}
            {mediaPreviews.length > 0 && (
              <div className="media-previews">
                {mediaPreviews.map((preview, index) => (
                  <div key={index} className="media-preview">
                    {preview.type === 'image' ? (
                      <img src={preview.url} alt={`Preview ${index + 1}`} />
                    ) : (
                      <video src={preview.url} controls />
                    )}
                    <button
                      type="button"
                      className="remove-media"
                      onClick={() => removeMedia(index)}
                      disabled={isSubmitting}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Anonymous Toggle */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.isAnonymous}
                onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
                disabled={isSubmitting}
              />
              <span className="checkmark"></span>
              Submit anonymously
            </label>
            <p className="anonymous-note">
              Your name will be hidden from public display, but we'll still know it's your review.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting || formData.rating === 0}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;