import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = ({ isOpen, onClose, user, seller }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !conversationId) {
      initializeConversation();
    }
  }, [isOpen, conversationId]);

  const initializeConversation = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/bot/conversation`,
        { userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setConversationId(response.data._id);

      // Load existing conversation history
      loadConversationHistory(response.data._id);
    } catch (error) {
      console.error('Error initializing conversation:', error);
    }
  };

  const loadConversationHistory = async (convId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/bot/conversation/${convId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const formattedMessages = response.data.map(msg => ({
        id: msg._id,
        text: msg.text,
        sender: msg.role === 'user' ? 'user' : 'bot',
        timestamp: new Date(msg.createdAt)
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading conversation history:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !conversationId) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/bot/message`,
        {
          conversationId,
          text: userMessage.text
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.reply,
        sender: 'bot',
        timestamp: new Date(),
        intent: response.data.intent,
        needsHandoff: response.data.needsHandoff
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Get user role for role-specific responses
  const getUserRole = () => {
    if (seller) return 'seller';
    if (user?.role) return user.role;
    return 'customer';
  };

  // Generate quick action buttons based on intent and user role
  const getQuickActions = (intent) => {
    const userRole = getUserRole();

    // Role-specific quick actions
    if (userRole === 'deliveryAgent') {
      const deliveryActions = {
        delivery: [
          { text: "How do I accept deliveries?", icon: "📦" },
          { text: "Update order status", icon: "📝" },
          { text: "Contact restaurant", icon: "🏪" }
        ],
        earnings: [
          { text: "Check my earnings", icon: "💰" },
          { text: "View delivery history", icon: "📊" },
          { text: "Available bonuses", icon: "🎁" }
        ],
        app_help: [
          { text: "Navigation help", icon: "🗺️" },
          { text: "App features guide", icon: "📱" },
          { text: "Report app issue", icon: "🐛" }
        ],
        safety: [
          { text: "Safety guidelines", icon: "🛡️" },
          { text: "Emergency contacts", icon: "🚨" },
          { text: "Report incident", icon: "📞" }
        ]
      };
      return deliveryActions[intent] || [
        { text: "What deliveries do I have?", icon: "🚚" },
        { text: "Help with navigation", icon: "🗺️" },
        { text: "Contact support", icon: "📞" }
      ];
    }

    if (userRole === 'seller') {
      const sellerActions = {
        menu_mgmt: [
          { text: "Add new menu item", icon: "➕" },
          { text: "Update prices", icon: "💰" },
          { text: "Manage categories", icon: "📂" }
        ],
        order_mgmt: [
          { text: "View pending orders", icon: "📋" },
          { text: "Update order status", icon: "✅" },
          { text: "Contact delivery agent", icon: "🚚" }
        ],
        analytics: [
          { text: "View sales report", icon: "📊" },
          { text: "Customer feedback", icon: "⭐" },
          { text: "Popular items", icon: "🔥" }
        ]
      };
      return sellerActions[intent] || [
        { text: "Manage my menu", icon: "🍽️" },
        { text: "View orders", icon: "📦" },
        { text: "Check analytics", icon: "📊" }
      ];
    }

    // Default customer actions
    const customerActions = {
      menu: [
        { text: "Show me vegetarian options", icon: "🥬" },
        { text: "What's popular today?", icon: "🔥" },
        { text: "Find restaurants near me", icon: "📍" }
      ],
      order: [
        { text: "How do I place an order?", icon: "🛒" },
        { text: "What's the minimum order?", icon: "💰" },
        { text: "Can I modify my order?", icon: "✏️" }
      ],
      tracking: [
        { text: "Track my latest order", icon: "📦" },
        { text: "When will my food arrive?", icon: "⏰" },
        { text: "Contact delivery agent", icon: "🚚" }
      ],
      payment: [
        { text: "What payment methods do you accept?", icon: "💳" },
        { text: "How do refunds work?", icon: "↩️" },
        { text: "Is my payment secure?", icon: "🔒" }
      ],
      support: [
        { text: "Contact customer support", icon: "📞" },
        { text: "Report an issue", icon: "🚨" },
        { text: "Give feedback", icon: "💬" }
      ]
    };

    return customerActions[intent] || [];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-overlay" onClick={onClose}>
      <div className="chatbot-container" onClick={(e) => e.stopPropagation()}>
        <div className="chatbot-header">
          <div className="chatbot-title">
            <span className="chatbot-icon">🤖</span>
            <span>FoodZTrain Assistant</span>
          </div>
          <button className="chatbot-close" onClick={onClose} title="Close chatbot">
            <span className="close-icon">×</span>
            <span className="close-text">Close</span>
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.length === 0 && !isLoading && (
            <div className="chatbot-welcome">
              {getUserRole() === 'deliveryAgent' ? (
                <>
                  <p>🚚 Hi! I'm your delivery assistant. How can I help you with deliveries today?</p>
                  <div className="chatbot-suggestions">
                    <button onClick={() => setInputMessage("What deliveries do I have?")}>
                      📦 My Deliveries
                    </button>
                    <button onClick={() => setInputMessage("Check my earnings")}>
                      💰 Earnings
                    </button>
                    <button onClick={() => setInputMessage("Navigation help")}>
                      🗺️ Navigation
                    </button>
                    <button onClick={() => setInputMessage("Contact support")}>
                      📞 Support
                    </button>
                  </div>
                </>
              ) : getUserRole() === 'seller' ? (
                <>
                  <p>🍱 Hi! I'm your restaurant assistant. How can I help you manage your business?</p>
                  <div className="chatbot-suggestions">
                    <button onClick={() => setInputMessage("Manage my menu")}>
                      🍽️ Menu Management
                    </button>
                    <button onClick={() => setInputMessage("View pending orders")}>
                      📦 Orders
                    </button>
                    <button onClick={() => setInputMessage("Check analytics")}>
                      📊 Analytics
                    </button>
                    <button onClick={() => setInputMessage("Contact support")}>
                      📞 Support
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p>� Hi! I'm your FoodZTrain assistant. How can I help you today?</p>
                  <div className="chatbot-suggestions">
                    <button onClick={() => setInputMessage("Show me the menu")}>
                      🍽️ Show Menu
                    </button>
                    <button onClick={() => setInputMessage("Track my order")}>
                      📦 Track Order
                    </button>
                    <button onClick={() => setInputMessage("How does delivery work?")}>
                      🚚 Delivery Info
                    </button>
                    <button onClick={() => setInputMessage("Contact support")}>
                      📞 Get Help
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id}>
              <div
                className={`chatbot-message ${message.sender === 'user' ? 'user' : 'bot'}`}
              >
                <div className="message-content">
                  {message.text}
                  {message.needsHandoff && (
                    <div className="handoff-notice">
                      <span className="handoff-icon">👨‍💼</span>
                      <span>Need more help? Contact our support team.</span>
                      <button
                        className="handoff-button"
                        onClick={() => setInputMessage("I need to speak to a human representative")}
                      >
                        Connect to Support
                      </button>
                    </div>
                  )}
                </div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {/* Quick actions for bot messages */}
              {message.sender === 'bot' && message.intent && getQuickActions(message.intent).length > 0 && (
                <div className="quick-actions">
                  {getQuickActions(message.intent).map((action, index) => (
                    <button
                      key={index}
                      className="quick-action-btn"
                      onClick={() => setInputMessage(action.text)}
                    >
                      <span className="action-icon">{action.icon}</span>
                      <span className="action-text">{action.text}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="chatbot-message bot">
              <div className="message-content typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="send-button"
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
