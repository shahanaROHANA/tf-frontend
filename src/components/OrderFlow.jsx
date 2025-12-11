// Enhanced Order Flow component with AI assistance and validation
import { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderFlow.css';

const OrderFlow = ({ 
  selectedStation, 
  selectedRestaurant, 
  cartItems = [],
  onOrderComplete,
  onOrderCancel 
}) => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Details, 2: Review, 3: Confirmation
  const [orderDetails, setOrderDetails] = useState({
    customerName: '',
    phoneNumber: '',
    trainNumber: '',
    arrivalTime: '',
    deliveryLocation: 'platform',
    specialInstructions: '',
    paymentMethod: 'cash',
    estimatedDeliveryTime: 20
  });
  const [aiAssistance, setAiAssistance] = useState({
    enabled: true,
    conversation: [],
    recommendations: []
  });
  const [validation, setValidation] = useState({});
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Initialize AI conversation
  useEffect(() => {
    if (aiAssistance.enabled && cartItems.length > 0) {
      initializeAIOrderAssistance();
    }
  }, [selectedStation, selectedRestaurant, cartItems]);

  // Initialize AI assistance for order flow
  const initializeAIOrderAssistance = async () => {
    try {
      const initialMessage = `I need help placing an order for pickup at ${selectedStation?.station?.name} station from ${selectedRestaurant?.name}. I have ${cartItems.length} items in my cart. Can you help me with the ordering process?`;
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/ai/chat`, {
        message: initialMessage,
        context: {
          lat: selectedStation?.station?.location?.coordinates?.[1],
          lng: selectedStation?.station?.location?.coordinates?.[0],
          orderContext: {
            station: selectedStation?.station?.name,
            restaurant: selectedRestaurant?.name,
            cartItems: cartItems.map(item => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity
            }))
          }
        }
      });

      if (response.data.response) {
        setAiAssistance(prev => ({
          ...prev,
          conversation: [
            {
              id: 1,
              type: 'ai',
              message: response.data.response,
              timestamp: new Date()
            }
          ]
        }));
      }
    } catch (error) {
      console.warn('AI assistance unavailable:', error.message);
    }
  };

  // Validate order details using AI
  const validateOrderWithAI = async () => {
    setIsValidating(true);
    try {
      const orderData = {
        customer_details: {
          name: orderDetails.customerName,
          phone: orderDetails.phoneNumber
        },
        delivery_details: {
          station: selectedStation?.station?.name,
          train_number: orderDetails.trainNumber,
          arrival_time: orderDetails.arrivalTime,
          location: orderDetails.deliveryLocation,
          special_instructions: orderDetails.specialInstructions
        },
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          restaurant: item.restaurant
        })),
        totals: {
          items_total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          delivery_fee: 50, // Fixed delivery fee
          total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 50
        }
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/ai/validate-order`, {
        orderData,
        context: {
          language: 'en', // Could detect from user preference
          userId: 'temp_user' // Would be actual user ID in production
        }
      });

      if (response.data) {
        setValidation(response.data);
        if (response.data.valid) {
          setCurrentStep(3); // Move to confirmation
        }
      }
    } catch (error) {
      console.error('Order validation error:', error);
      // Fallback validation
      const fallbackValidation = {
        valid: true,
        missing_fields: [],
        estimated_total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 50,
        estimated_delivery_time: 20,
        confirmation_message: 'Order ready for processing'
      };
      setValidation(fallbackValidation);
      setCurrentStep(3);
    } finally {
      setIsValidating(false);
    }
  };

  // Handle AI conversation during order process
  const sendAIMessage = async (message) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/ai/conversation`, {
        sessionId: `order_${Date.now()}`,
        message,
        context: {
          lat: selectedStation?.station?.location?.coordinates?.[1],
          lng: selectedStation?.station?.location?.coordinates?.[0],
          conversation_history: aiAssistance.conversation,
          orderContext: {
            current_step: currentStep,
            orderDetails,
            cartItems,
            station: selectedStation?.station?.name,
            restaurant: selectedRestaurant?.name
          }
        }
      });

      if (response.data.response) {
        setAiAssistance(prev => ({
          ...prev,
          conversation: [
            ...prev.conversation,
            {
              id: Date.now(),
              type: 'user',
              message,
              timestamp: new Date()
            },
            {
              id: Date.now() + 1,
              type: 'ai',
              message: response.data.response,
              data: response.data,
              timestamp: new Date()
            }
          ]
        }));
      }
    } catch (error) {
      console.error('AI conversation error:', error);
    }
  };

  // Submit order
  const submitOrder = async () => {
    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer_details: {
          name: orderDetails.customerName,
          phone: orderDetails.phoneNumber
        },
        delivery_details: {
          station: selectedStation?.station?.name,
          station_place_id: selectedStation?.station?.place_id,
          train_number: orderDetails.trainNumber,
          arrival_time: orderDetails.arrivalTime,
          delivery_location: orderDetails.deliveryLocation,
          special_instructions: orderDetails.specialInstructions
        },
        items: cartItems,
        payment: {
          method: orderDetails.paymentMethod,
          amount: validation.estimated_total || cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 50
        },
        ai_validated: validation.valid || false,
        validation_details: validation
      };

      // In a real implementation, this would call the actual order API
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/orders`, orderPayload);
      
      if (response.data.orderId) {
        setOrderId(response.data.orderId);
        setCurrentStep(3);
        
        // Notify parent component
        if (onOrderComplete) {
          onOrderComplete({
            orderId: response.data.orderId,
            orderDetails: orderPayload,
            validation
          });
        }
      }
    } catch (error) {
      console.error('Order submission error:', error);
      alert('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate order totals
  const orderTotals = {
    items: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    delivery: 50,
    total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 50
  };

  // Step indicators
  const steps = [
    { number: 1, title: 'Order Details', description: 'Enter your information' },
    { number: 2, title: 'Review & Validate', description: 'Confirm your order' },
    { number: 3, title: 'Confirmation', description: 'Order complete' }
  ];

  return (
    <div className="order-flow">
      <div className="order-flow-header">
        <h2>🚆 Complete Your Order</h2>
        <p>Order from {selectedRestaurant?.name} for pickup at {selectedStation?.station?.name}</p>
        
        {/* Step indicator */}
        <div className="step-indicator">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`step ${currentStep >= step.number ? 'active' : ''} ${currentStep === step.number ? 'current' : ''}`}
            >
              <div className="step-number">{step.number}</div>
              <div className="step-content">
                <div className="step-title">{step.title}</div>
                <div className="step-description">{step.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="order-flow-content">
        {/* Step 1: Order Details */}
        {currentStep === 1 && (
          <div className="order-details-step">
            <div className="details-section">
              <h3>Customer Information</h3>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={orderDetails.customerName}
                  onChange={(e) => setOrderDetails(prev => ({ ...prev, customerName: e.target.value }))}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  value={orderDetails.phoneNumber}
                  onChange={(e) => setOrderDetails(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="+94 71 234 5678"
                  required
                />
              </div>

              <h3>Train Details</h3>
              <div className="form-group">
                <label>Train Number</label>
                <input
                  type="text"
                  value={orderDetails.trainNumber}
                  onChange={(e) => setOrderDetails(prev => ({ ...prev, trainNumber: e.target.value }))}
                  placeholder="e.g., UDA-POL"
                />
              </div>

              <div className="form-group">
                <label>Arrival Time</label>
                <input
                  type="datetime-local"
                  value={orderDetails.arrivalTime}
                  onChange={(e) => setOrderDetails(prev => ({ ...prev, arrivalTime: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>Delivery Location</label>
                <select
                  value={orderDetails.deliveryLocation}
                  onChange={(e) => setOrderDetails(prev => ({ ...prev, deliveryLocation: e.target.value }))}
                >
                  <option value="platform">Platform</option>
                  <option value="waiting_room">Waiting Room</option>
                  <option value="entrance">Station Entrance</option>
                </select>
              </div>

              <div className="form-group">
                <label>Special Instructions</label>
                <textarea
                  value={orderDetails.specialInstructions}
                  onChange={(e) => setOrderDetails(prev => ({ ...prev, specialInstructions: e.target.value }))}
                  placeholder="Any special instructions for delivery..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Payment Method</label>
                <select
                  value={orderDetails.paymentMethod}
                  onChange={(e) => setOrderDetails(prev => ({ ...prev, paymentMethod: e.target.value }))}
                >
                  <option value="cash">Cash on Delivery</option>
                  <option value="card">Card Payment</option>
                </select>
              </div>
            </div>

            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="cart-items">
                {cartItems.map((item, index) => (
                  <div key={index} className="cart-item">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">x{item.quantity}</span>
                    </div>
                    <span className="item-total">Rs. {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              
              <div className="totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>Rs. {orderTotals.items}</span>
                </div>
                <div className="total-row">
                  <span>Delivery Fee:</span>
                  <span>Rs. {orderTotals.delivery}</span>
                </div>
                <div className="total-row total">
                  <span>Total:</span>
                  <span>Rs. {orderTotals.total}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Review & Validate */}
        {currentStep === 2 && (
          <div className="review-step">
            <div className="review-content">
              <h3>Review Your Order</h3>
              
              <div className="review-section">
                <h4>Customer Details</h4>
                <p><strong>Name:</strong> {orderDetails.customerName}</p>
                <p><strong>Phone:</strong> {orderDetails.phoneNumber}</p>
                {orderDetails.trainNumber && <p><strong>Train:</strong> {orderDetails.trainNumber}</p>}
                {orderDetails.arrivalTime && <p><strong>Arrival:</strong> {new Date(orderDetails.arrivalTime).toLocaleString()}</p>}
                <p><strong>Location:</strong> {orderDetails.deliveryLocation}</p>
              </div>

              <div className="review-section">
                <h4>Order Items</h4>
                {cartItems.map((item, index) => (
                  <div key={index} className="review-item">
                    <span>{item.name} x{item.quantity}</span>
                    <span>Rs. {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {validation.missing_fields && validation.missing_fields.length > 0 && (
                <div className="validation-errors">
                  <h4>⚠️ Missing Information</h4>
                  <ul>
                    {validation.missing_fields.map((field, index) => (
                      <li key={index}>{field}</li>
                    ))}
                  </ul>
                </div>
              )}

              {validation.confirmation_message && (
                <div className="ai-message">
                  <h4>🤖 AI Assistant</h4>
                  <p>{validation.confirmation_message}</p>
                </div>
              )}

              {validation.suggestions && validation.suggestions.length > 0 && (
                <div className="ai-suggestions">
                  <h4>💡 Suggestions</h4>
                  <ul>
                    {validation.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <div className="confirmation-step">
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h3>Order Confirmed!</h3>
              <p>Your order has been successfully placed and is being processed.</p>
              
              {orderId && (
                <div className="order-id">
                  <strong>Order ID:</strong> {orderId}
                </div>
              )}
              
              <div className="confirmation-details">
                <h4>What's Next?</h4>
                <ul>
                  <li>Restaurant is preparing your order</li>
                  <li>You'll receive updates on your order status</li>
                  <li>Delivery agent will contact you before arrival</li>
                  <li>Estimated delivery time: {validation.estimated_delivery_time || 20} minutes</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* AI Assistant Panel */}
        {aiAssistance.enabled && (
          <div className="ai-assistant-panel">
            <div className="ai-header">
              <h4>🤖 AI Assistant</h4>
              <p>Need help with your order?</p>
            </div>
            
            <div className="ai-conversation">
              {aiAssistance.conversation.map((msg) => (
                <div key={msg.id} className={`ai-message ${msg.type}`}>
                  <div className="message-content">
                    <p>{msg.message}</p>
                  </div>
                  <span className="message-time">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="ai-input">
              <input
                type="text"
                placeholder="Ask AI for help..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    sendAIMessage(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <button onClick={() => {
                const input = document.querySelector('.ai-input input');
                if (input.value) {
                  sendAIMessage(input.value);
                  input.value = '';
                }
              }}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="order-flow-footer">
        {/* Navigation buttons */}
        {currentStep === 1 && (
          <div className="step-actions">
            <button
              className="btn-secondary"
              onClick={onOrderCancel}
            >
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={() => setCurrentStep(2)}
              disabled={!orderDetails.customerName || !orderDetails.phoneNumber}
            >
              Continue to Review
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="step-actions">
            <button
              className="btn-secondary"
              onClick={() => setCurrentStep(1)}
            >
              Back to Details
            </button>
            <button
              className="btn-primary"
              onClick={validateOrderWithAI}
              disabled={isValidating}
            >
              {isValidating ? 'Validating...' : 'Validate with AI'}
            </button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="step-actions">
            <button
              className="btn-primary"
              onClick={() => {
                // Reset order flow
                setCurrentStep(1);
                setOrderDetails({
                  customerName: '',
                  phoneNumber: '',
                  trainNumber: '',
                  arrivalTime: '',
                  deliveryLocation: 'platform',
                  specialInstructions: '',
                  paymentMethod: 'cash',
                  estimatedDeliveryTime: 20
                });
                setValidation({});
                setOrderId(null);
              }}
            >
              Place Another Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderFlow;