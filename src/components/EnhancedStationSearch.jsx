// Enhanced AI-powered Station Search with natural language support
import { useState, useEffect } from 'react';
import axios from 'axios';
import './EnhancedStationSearch.css';

const EnhancedStationSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurantMenu, setRestaurantMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  
  // AI Chat states
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSessionId, setAiSessionId] = useState('');

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    cuisine: '',
    dietary: [],
    priceRange: '',
    openNow: false,
    minRating: 0
  });

  // Initialize session and location
  useEffect(() => {
    // Generate session ID
    setAiSessionId('session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
    
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  }, []);

  // Enhanced search stations with improved error handling and API support
  const searchStations = async (query = searchQuery) => {
    if (!query.trim() && !userLocation) {
      setError('Please enter a search term or allow location access.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      let stations = [];
      
      if (query.trim()) {
        // Use text search for specific queries
        const searchParams = new URLSearchParams({
          q: query.trim(),
          limit: '10'
        });
        
        if (userLocation) {
          searchParams.append('lat', userLocation.lat.toString());
          searchParams.append('lng', userLocation.lng.toString());
          searchParams.append('radius', '5000');
        }

        const stationResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/maps/stations?${searchParams.toString()}`
        );

        if (stationResponse.data.stations && stationResponse.data.stations.length > 0) {
          // For each found station, get nearby restaurants
          const stationsWithRestaurants = await Promise.all(
            stationResponse.data.stations.map(async (station) => {
              try {
                const restaurantResponse = await axios.get(
                  `${import.meta.env.VITE_API_URL}/maps/restaurants?lat=${station.location.coordinates[1]}&lng=${station.location.coordinates[0]}&radius=500&deliveryOnly=true&limit=20`
                );
                
                return {
                  station,
                  restaurants: restaurantResponse.data.restaurants || []
                };
              } catch (restaurantErr) {
                console.warn(`Failed to fetch restaurants for station ${station.name}:`, restaurantErr.message);
                return {
                  station,
                  restaurants: []
                };
              }
            })
          );
          
          stations = stationsWithRestaurants;
        } else {
          setError(`No stations found for "${query}". Try: Colombo Fort, Jaffna, Kandy, Galle, or Anuradhapura.`);
          setSearchResults([]);
          return;
        }
      } else {
        // Use location-based search when no query provided
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/maps/stations-with-restaurants?lat=${userLocation.lat}&lng=${userLocation.lng}&stationLimit=5&restaurantRadius=800&includeDetails=true`
        );

        stations = response.data.stations || [];
      }
      
      // Additional filtering and validation
      const validStations = stations.filter(stationData => 
        stationData.station && 
        stationData.station.name && 
        stationData.station.location &&
        stationData.station.is_active !== false
      );

      if (validStations.length > 0) {
        setSearchResults(validStations);
        
        // Show success message with results count
        if (query.trim()) {
          const totalRestaurants = validStations.reduce((sum, s) => sum + (s.restaurants?.length || 0), 0);
          setError(`Found ${validStations.length} stations with ${totalRestaurants} restaurants nearby.`);
          setTimeout(() => setError(''), 3000); // Clear after 3 seconds
        }
      } else {
        setError('No active train stations found in this area. Try searching for major stations like Colombo Fort, Jaffna, or Kandy.');
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      
      // Provide more specific error messages
      if (err.response?.status === 429) {
        setError('Too many requests. Please wait a moment and try again.');
      } else if (err.response?.status === 503) {
        setError('Search service is temporarily unavailable. Please try again later.');
      } else if (!navigator.geolocation && !query.trim()) {
        setError('Location access denied. Please enter a station name to search.');
      } else {
        setError('Unable to search stations. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Enhanced AI Chat functionality with conversation context
  const sendAiMessage = async () => {
    if (!aiInput.trim()) return;

    const userMessage = aiInput.trim();
    setAiInput('');
    setIsAiLoading(true);

    // Add user message to chat
    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      message: userMessage,
      timestamp: new Date()
    };
    setAiMessages(prev => [...prev, newUserMessage]);

    try {
      // Prepare conversation context
      const conversationHistory = aiMessages.map(msg => ({
        type: msg.type,
        message: msg.message,
        data: msg.data,
        timestamp: msg.timestamp
      }));

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/ai/conversation`, {
        sessionId: aiSessionId,
        message: userMessage,
        context: {
          lat: userLocation?.lat,
          lng: userLocation?.lng,
          conversation_history: conversationHistory,
          conversationTurn: aiMessages.length / 2 + 1, // Each turn has 2 messages (user + ai)
          requestStartTime: Date.now()
        }
      });

      // Add AI response to chat
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: response.data.response || 'I\'m here to help you find great food near train stations!',
        data: response.data,
        timestamp: new Date(),
        confidence: response.data.conversation_metadata?.intent_confidence || 0.5
      };
      setAiMessages(prev => [...prev, aiMessage]);

      // Enhanced handling of AI response actions
      if (response.data.stations && response.data.stations.length > 0) {
        setSearchResults(response.data.stations);
        setSelectedStation(null);
        setRestaurants([]);
        setSelectedRestaurant(null);
        setRestaurantMenu([]);
      }

      if (response.data.restaurants && response.data.restaurants.length > 0) {
        if (response.data.stations && response.data.stations.length > 0) {
          setSearchResults(response.data.stations);
        }
      }

      // Handle specific AI actions
      if (response.data.action_required) {
        handleAiAction(response.data.action_required, response.data);
      }

      // Show feedback option for poor confidence responses
      if (response.data.conversation_metadata?.intent_confidence < 0.3) {
        setTimeout(() => {
          const feedbackMessage = {
            id: Date.now() + 2,
            type: 'ai',
            message: 'I want to make sure I understood you correctly. Was this helpful? Please let me know if I can assist you better!',
            data: { action_required: 'feedback' },
            timestamp: new Date()
          };
          setAiMessages(prev => [...prev, feedbackMessage]);
        }, 1000);
      }

    } catch (err) {
      console.error('AI chat error:', err);
      
      // Provide more helpful error messages
      let errorMessage = 'I\'m having trouble connecting right now. ';
      if (err.response?.status === 503) {
        errorMessage += 'The AI service is temporarily unavailable. Please try the search function instead.';
      } else if (err.response?.status === 429) {
        errorMessage += 'Too many requests. Please wait a moment and try again.';
      } else {
        errorMessage += 'Please try again or use the search function.';
      }

      const errorChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: errorMessage,
        data: { action_required: 'fallback_search' },
        timestamp: new Date()
      };
      setAiMessages(prev => [...prev, errorChatMessage]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Handle AI-initiated actions
  const handleAiAction = (action, data) => {
    switch (action) {
      case 'select_station':
        if (data.stations && data.stations.length > 0) {
          selectStation(data.stations[0]);
        }
        break;
      case 'select_restaurant':
        if (data.restaurants && data.restaurants.length > 0) {
          selectRestaurant(data.restaurants[0]);
        }
        break;
      case 'show_menu':
        if (data.restaurants && data.restaurants.length > 0) {
          selectRestaurant(data.restaurants[0]);
        }
        break;
      case 'feedback':
        // Show feedback interface
        break;
      case 'fallback_search':
        // Focus on search input
        const searchInput = document.querySelector('.station-search-input');
        if (searchInput) {
          searchInput.focus();
        }
        break;
      default:
        console.log('Unhandled AI action:', action);
    }
  };

  // Apply filters to restaurant search
  const applyFilters = async () => {
    if (!selectedStation) return;

    setLoading(true);
    try {
      const filterParams = new URLSearchParams();
      if (userLocation) {
        filterParams.append('lat', userLocation.lat);
        filterParams.append('lng', userLocation.lng);
      }
      
      if (filters.cuisine) filterParams.append('cuisine', filters.cuisine);
      if (filters.dietary.length > 0) filterParams.append('dietary', filters.dietary.join(','));
      if (filters.priceRange) filterParams.append('priceLevel', filters.priceRange);
      if (filters.openNow) filterParams.append('openNow', 'true');
      if (filters.minRating > 0) filterParams.append('minRating', filters.minRating.toString());
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/maps/restaurants?${filterParams.toString()}`
      );

      // Filter restaurants by distance from selected station
      const stationLocation = selectedStation.station.location;
      const nearbyRestaurants = response.data.restaurants.filter(restaurant => {
        const restaurantLat = restaurant.location.coordinates[1];
        const restaurantLng = restaurant.location.coordinates[0];
        const stationLat = stationLocation.coordinates[1];
        const stationLng = stationLocation.coordinates[0];
        
        // Calculate distance (simplified)
        const distance = Math.sqrt(
          Math.pow(restaurantLat - stationLat, 2) + 
          Math.pow(restaurantLng - stationLng, 2)
        ) * 111000; // Rough conversion to meters
        
        return distance <= 800; // 800m radius
      });

      setRestaurants(nearbyRestaurants);
      setShowFilters(false);
    } catch (err) {
      console.error('Filter error:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectStation = (stationData) => {
    setSelectedStation(stationData);
    setRestaurants(stationData.restaurants || []);
    setSelectedRestaurant(null);
    setRestaurantMenu([]);
  };

  // Enhanced restaurant selection with better menu integration
  const selectRestaurant = async (restaurant) => {
    setSelectedRestaurant(restaurant);
    setLoading(true);
    setRestaurantMenu([]);

    try {
      let menuItems = [];
      
      // First, try to get menu from TrainFood system if restaurant is integrated
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/restaurants/search?name=${encodeURIComponent(restaurant.name)}`
        );

        if (response.data && response.data.length > 0) {
          const trainFoodRestaurant = response.data[0];
          const menuResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/products?restaurant=${trainFoodRestaurant._id}`
          );
          
          if (menuResponse.data && menuResponse.data.length > 0) {
            menuItems = menuResponse.data.map(item => ({
              _id: item._id,
              name: item.name,
              price: item.price,
              description: item.description || '',
              category: item.category || 'General',
              image: item.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop&crop=center',
              available: item.available !== false
            }));
          }
        }
      } catch (integrationError) {
        console.warn('TrainFood integration not available:', integrationError.message);
      }

      // If no TrainFood menu, use restaurant's own menu data
      if (menuItems.length === 0 && restaurant.menu && restaurant.menu.length > 0) {
        menuItems = restaurant.menu.map(item => ({
          _id: item.itemId || `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          name: item.name,
          price: item.price,
          description: item.description || '',
          category: item.cuisine || 'General',
          image: item.image || getDefaultImageForCategory(item.cuisine || 'General'),
          available: item.available !== false,
          train_friendly: item.tags?.includes('train_friendly') || false
        }));
      }

      // If still no menu, provide contextual suggestions based on cuisine
      if (menuItems.length === 0) {
        const cuisineType = restaurant.custom_data?.cuisine_tags?.[0] || 'general';
        menuItems = getSampleMenuForCuisine(cuisineType, restaurant.name);
      }

      setRestaurantMenu(menuItems);
      
      // Show success message with menu count
      if (menuItems.length > 0) {
        const message = `Loaded ${menuItems.length} items from ${restaurant.name}'s menu`;
        console.log(message);
      } else {
        setError('Menu information not available for this restaurant. Please contact them directly.');
      }

    } catch (err) {
      console.error('Error fetching menu:', err);
      setError('Unable to load menu. Please try again or select a different restaurant.');
      setRestaurantMenu([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get default images for cuisine types
  const getDefaultImageForCategory = (category) => {
    const categoryImages = {
      'sri_lankan': 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=250&fit=crop&crop=center',
      'chinese': 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=250&fit=crop&crop=center',
      'indian': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=250&fit=crop&crop=center',
      'kottu': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop&crop=center',
      'seafood': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=250&fit=crop&crop=center',
      'vegetarian': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=250&fit=crop&crop=center'
    };
    
    return categoryImages[category.toLowerCase()] || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop&crop=center';
  };

  // Helper function to generate contextual sample menus
  const getSampleMenuForCuisine = (cuisineType, restaurantName) => {
    const sampleMenus = {
      'sri_lankan': [
        {
          _id: 'sl-1',
          name: 'Chicken Rice & Curry',
          price: 480,
          description: 'Traditional Sri Lankan rice with chicken curry, dhal, and accompaniments',
          category: 'Rice & Curry',
          image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=250&fit=crop&crop=center',
          train_friendly: true
        },
        {
          _id: 'sl-2',
          name: 'Fish Curry with Rice',
          price: 520,
          description: 'Fresh fish curry with coconut rice and vegetables',
          category: 'Rice & Curry',
          image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=250&fit=crop&crop=center'
        },
        {
          _id: 'sl-3',
          name: 'Vegetable Kottu',
          price: 420,
          description: 'Chopped roti with mixed vegetables and curry sauce',
          category: 'Kottu',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop&crop=center',
          train_friendly: true
        }
      ],
      'chinese': [
        {
          _id: 'cn-1',
          name: 'Chicken Fried Rice',
          price: 450,
          description: 'Wok-fried rice with chicken and vegetables',
          category: 'Rice Dishes',
          image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=250&fit=crop&crop=center',
          train_friendly: true
        },
        {
          _id: 'cn-2',
          name: 'Sweet & Sour Chicken',
          price: 520,
          description: 'Crispy chicken in sweet and sour sauce with vegetables',
          category: 'Chicken Dishes',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop&crop=center'
        }
      ],
      'indian': [
        {
          _id: 'in-1',
          name: 'Chicken Biryani',
          price: 580,
          description: 'Fragrant basmati rice with spiced chicken and herbs',
          category: 'Biryani',
          image: 'https://images.unsplash.com/photo-1563379091339-03246963d7d7?w=400&h=250&fit=crop&crop=center',
          train_friendly: true
        },
        {
          _id: 'in-2',
          name: 'Butter Chicken',
          price: 620,
          description: 'Tender chicken in creamy tomato-based curry sauce',
          category: 'Curry',
          image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=250&fit=crop&crop=center'
        }
      ]
    };

    return sampleMenus[cuisineType] || [
      {
        _id: 'default-1',
        name: 'Assorted Meal',
        price: 450,
        description: 'Popular dishes from this restaurant',
        category: 'Specialties',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop&crop=center',
        train_friendly: true
      },
      {
        _id: 'default-2',
        name: 'Signature Dish',
        price: 520,
        description: 'Chef\'s recommendation',
        category: 'Specialties',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop&crop=center'
      }
    ];
  };

  // Enhanced add to cart with better UX and integration
  const addToCart = async (product) => {
    try {
      // Create cart item object
      const cartItem = {
        id: product._id,
        name: product.name,
        price: product.price,
        restaurant: selectedRestaurant.name,
        station: selectedStation?.station?.name || 'Unknown Station',
        category: product.category,
        image: product.image,
        quantity: 1,
        subtotal: product.price,
        added_at: new Date().toISOString(),
        train_friendly: product.train_friendly || false
      };

      // Check if cart functionality exists (integrate with existing cart system)
      const existingCart = localStorage.getItem('trainfood_cart');
      let cart = existingCart ? JSON.parse(existingCart) : [];
      
      // Check if item already exists in cart
      const existingItemIndex = cart.findIndex(item => item.id === cartItem.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        cart[existingItemIndex].quantity += 1;
        cart[existingItemIndex].subtotal = cart[existingItemIndex].quantity * cart[existingItemIndex].price;
      } else {
        // Add new item to cart
        cart.push(cartItem);
      }

      // Save to localStorage
      localStorage.setItem('trainfood_cart', JSON.stringify(cart));
      
      // Calculate cart summary
      const cartSummary = {
        total_items: cart.reduce((sum, item) => sum + item.quantity, 0),
        total_amount: cart.reduce((sum, item) => sum + item.subtotal, 0),
        restaurants: [...new Set(cart.map(item => item.restaurant))].length
      };

      // Show success message with cart summary
      const successMessage = `Added ${product.name} to cart!\n\nCart Summary:\n• Items: ${cartSummary.total_items}\n• Total: Rs. ${cartSummary.total_amount}\n• Restaurants: ${cartSummary.restaurants}`;
      
      // You can replace this with a toast notification or modal
      alert(successMessage);
      
      // Dispatch cart update event (for components listening to cart changes)
      window.dispatchEvent(new CustomEvent('cartUpdated', { 
        detail: { cart, cartSummary } 
      }));

      // Optional: Send analytics event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'add_to_cart', {
          currency: 'LKR',
          value: product.price,
          items: [{
            item_id: product._id,
            item_name: product.name,
            category: product.category,
            price: product.price,
            quantity: 1
          }]
        });
      }

      console.log('Item added to cart:', cartItem);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  // Quick add function for train-friendly items
  const quickAddTrainFriendly = () => {
    const trainFriendlyItems = restaurantMenu.filter(item => item.train_friendly);
    if (trainFriendlyItems.length > 0) {
      trainFriendlyItems.forEach(item => addToCart(item));
    } else {
      alert('No train-friendly items available for quick add.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchStations();
    }
  };

  const handleAiKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendAiMessage();
    }
  };

  // Sample AI suggestions
  const aiSuggestions = [
    'Find restaurants near Colombo Fort',
    'Show me vegetarian options',
    'What\'s open now near Kandy station?',
    'Recommend quick train food',
    'ஜப்னா ஸ்டேஷனுக்கு அருகில் உணவகங்கள்',
    'சைவ உணவு விருப்பங்கள்'
  ];

  return (
    <div className="enhanced-station-search">
      <div className="search-header">
        <h2>🍽️ AI-Powered Train Food Finder</h2>
        <p>Find the best restaurants near train stations with natural language search</p>
      </div>

      {/* AI Chat Section */}
      <div className="ai-chat-section">
        <div className="ai-chat-header">
          <h3>🤖 Ask the Food Assistant</h3>
          <p>Talk to our AI in Tamil or English</p>
        </div>
        
        <div className="ai-suggestions">
          <span className="suggestions-label">Try asking:</span>
          <div className="suggestions-list">
            {aiSuggestions.map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-chip"
                onClick={() => setAiInput(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="ai-chat-container">
          <div className="ai-messages">
            {aiMessages.length === 0 && (
              <div className="ai-welcome-message">
                <p>👋 Hi! I'm your TrainFood assistant. Ask me anything about:</p>
                <ul>
                  <li>Finding restaurants near train stations</li>
                  <li>Getting food recommendations</li>
                  <li>Checking opening hours</li>
                  <li>Placing orders for pickup</li>
                </ul>
                <p>You can ask in Tamil or English!</p>
              </div>
            )}
            {aiMessages.map((msg) => (
              <div key={msg.id} className={`ai-message ${msg.type}`}>
                <div className="message-content">
                  <p>{msg.message}</p>
                  {msg.data && msg.data.recommendations && (
                    <div className="ai-recommendations">
                      <h4>Recommendations:</h4>
                      {msg.data.recommendations.slice(0, 3).map((rec, index) => (
                        <div key={index} className="recommendation-item">
                          <strong>{rec.name}</strong>
                          {rec.rating && <span> ⭐ {rec.rating}</span>}
                          {rec.vicinity && <span className="location">📍 {rec.vicinity}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {isAiLoading && (
              <div className="ai-message ai">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="ai-input-container">
            <textarea
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyPress={handleAiKeyPress}
              placeholder="Ask me about food near train stations..."
              className="ai-input"
              rows="2"
            />
            <button
              onClick={sendAiMessage}
              disabled={isAiLoading || !aiInput.trim()}
              className="ai-send-button"
            >
              {isAiLoading ? '⏳' : '🚀'}
            </button>
          </div>
        </div>
      </div>

      {/* Traditional Search Section */}
      <div className="traditional-search-section">
        <div className="search-input-section">
          <div className="search-input-group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter train station name (e.g., Colombo Fort, Jaffna, Kandy)"
              className="station-search-input"
            />
            <button
              onClick={() => searchStations()}
              disabled={loading || !searchQuery.trim()}
              className="search-button"
            >
              {loading ? '🔍 Searching...' : '🔍 Search'}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="filters-button"
            >
              🔧 Filters
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {/* Filter Panel */}
        {showFilters && (
          <div className="filter-panel">
            <h4>🔍 Filter Restaurants</h4>
            <div className="filter-row">
              <label>Cuisine:</label>
              <select
                value={filters.cuisine}
                onChange={(e) => setFilters(prev => ({ ...prev, cuisine: e.target.value }))}
              >
                <option value="">All Cuisines</option>
                <option value="chinese">Chinese</option>
                <option value="sri_lankan">Sri Lankan</option>
                <option value="italian">Italian</option>
                <option value="indian">Indian</option>
              </select>
            </div>
            
            <div className="filter-row">
              <label>Dietary:</label>
              <div className="checkbox-group">
                {['vegetarian', 'halal', 'vegan'].map(diet => (
                  <label key={diet} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.dietary.includes(diet)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters(prev => ({ ...prev, dietary: [...prev.dietary, diet] }));
                        } else {
                          setFilters(prev => ({ ...prev, dietary: prev.dietary.filter(d => d !== diet) }));
                        }
                      }}
                    />
                    {diet.charAt(0).toUpperCase() + diet.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-row">
              <label>Price Range:</label>
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
              >
                <option value="">All Prices</option>
                <option value="1">Budget ($)</option>
                <option value="2">Moderate ($$)</option>
                <option value="3">Premium ($$$)</option>
              </select>
            </div>

            <div className="filter-row">
              <label>Minimum Rating:</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={filters.minRating}
                onChange={(e) => setFilters(prev => ({ ...prev, minRating: parseFloat(e.target.value) }))}
              />
              <span>{filters.minRating}+ stars</span>
            </div>

            <div className="filter-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.openNow}
                  onChange={(e) => setFilters(prev => ({ ...prev, openNow: e.target.checked }))}
                />
                Open Now Only
              </label>
            </div>

            <div className="filter-actions">
              <button onClick={applyFilters} className="apply-filters-btn">
                Apply Filters
              </button>
              <button onClick={() => setShowFilters(false)} className="cancel-filters-btn">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="stations-list">
            <h3>📍 Select a Station</h3>
            <div className="stations-grid">
              {searchResults.map((stationData, index) => (
                <div
                  key={index}
                  className={`station-card ${selectedStation?.station.place_id === stationData.station.place_id ? 'selected' : ''}`}
                  onClick={() => selectStation(stationData)}
                >
                  <div className="station-info">
                    <h4>🚆 {stationData.station.name}</h4>
                    <p className="station-address">{stationData.station.vicinity}</p>
                    <p className="restaurant-count">
                      🍽️ {stationData.restaurants.length} restaurants nearby
                    </p>
                    {stationData.station.rating && (
                      <p className="station-rating">
                        ⭐ {stationData.station.rating} ({stationData.station.user_ratings_total || 0} reviews)
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Restaurants Section */}
        {selectedStation && restaurants.length > 0 && (
          <div className="restaurants-section">
            <div className="restaurants-header">
              <h3>🍴 Restaurants near {selectedStation.station.name}</h3>
              {selectedStation.station.rating && (
                <span className="station-info-badge">
                  ⭐ {selectedStation.station.rating} rated station
                </span>
              )}
            </div>
            <div className="restaurants-grid">
              {restaurants.map((restaurant, index) => (
                <div key={index} className="restaurant-card" onClick={() => selectRestaurant(restaurant)}>
                  <div className="restaurant-header">
                    <h4>{restaurant.name}</h4>
                    {restaurant.rating && (
                      <div className="rating">
                        ⭐ {restaurant.rating} ({restaurant.user_ratings_total || 0} reviews)
                      </div>
                    )}
                  </div>
                  <p className="restaurant-address">{restaurant.vicinity}</p>
                  {restaurant.google_data?.opening_hours && (
                    <p className="restaurant-status">
                      {restaurant.google_data.opening_hours.open_now ? '🟢 Open now' : '🔴 Closed'}
                    </p>
                  )}
                  {restaurant.custom_data?.cuisine_tags && restaurant.custom_data.cuisine_tags.length > 0 && (
                    <div className="cuisine-tags">
                      {restaurant.custom_data.cuisine_tags.slice(0, 3).map((tag, tagIndex) => (
                        <span key={tagIndex} className="cuisine-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                  <div className="restaurant-actions">
                    <button
                      className="view-menu-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectRestaurant(restaurant);
                      }}
                    >
                      🍽️ View Menu
                    </button>
                    <button
                      className="view-on-map-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        const lat = restaurant.location.coordinates[1];
                        const lng = restaurant.location.coordinates[0];
                        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${restaurant.place_id}`;
                        window.open(url, '_blank');
                      }}
                    >
                      🗺️ View on Map
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Menu Section */}
        {selectedRestaurant && (
          <div className="restaurant-menu-section">
            <div className="menu-header">
              <button
                className="back-btn"
                onClick={() => setSelectedRestaurant(null)}
              >
                ← Back to Restaurants
              </button>
              <h3>🍽️ {selectedRestaurant.name} - Menu</h3>
              <div className="restaurant-info">
                <span>📍 {selectedRestaurant.vicinity}</span>
                {selectedRestaurant.rating && <span> ⭐ {selectedRestaurant.rating}</span>}
                {selectedRestaurant.google_data?.opening_hours && (
                  <span className={`status-badge ${selectedRestaurant.google_data.opening_hours.open_now ? 'open' : 'closed'}`}>
                    {selectedRestaurant.google_data.opening_hours.open_now ? '🟢 Open' : '🔴 Closed'}
                  </span>
                )}
              </div>
              
              {/* Quick Actions */}
              <div className="menu-actions">
                <button 
                  className="quick-add-train-friendly-btn"
                  onClick={quickAddTrainFriendly}
                  title="Add all train-friendly items to cart"
                >
                  🚆 Quick Add Train-Friendly Items
                </button>
                <span className="menu-count">
                  {restaurantMenu.length} items available
                </span>
              </div>
            </div>

            {loading ? (
              <div className="loading-menu">
                <div className="loading-spinner"></div>
                <p>Loading delicious menu items...</p>
              </div>
            ) : (
              <div className="menu-items">
                {restaurantMenu.length > 0 ? (
                  <>
                    {/* Train-friendly items highlighted */}
                    {restaurantMenu.filter(item => item.train_friendly).length > 0 && (
                      <div className="train-friendly-section">
                        <h4 className="section-title">🚆 Perfect for Train Journeys</h4>
                        <div className="train-friendly-items">
                          {restaurantMenu.filter(item => item.train_friendly).map((item) => (
                            <div key={item._id} className="menu-item train-friendly">
                              <div className="menu-item-header">
                                <div className="item-info">
                                  <div className="item-image-container">
                                    <img src={item.image} alt={item.name} className="item-image" />
                                    <div className="train-badge">🚆 Train-Friendly</div>
                                  </div>
                                  <div className="item-details">
                                    <h4>{item.name}</h4>
                                    <p className="item-description">{item.description}</p>
                                    <div className="item-meta">
                                      <span className="item-price">Rs. {item.price}</span>
                                      {item.category && <span className="item-category">{item.category}</span>}
                                    </div>
                                  </div>
                                </div>
                                <button
                                  className="add-to-cart-btn primary"
                                  onClick={() => addToCart(item)}
                                  disabled={item.available === false}
                                >
                                  {item.available === false ? 'Unavailable' : 'Add to Cart'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Regular menu items */}
                    <div className="regular-menu-items">
                      {restaurantMenu.filter(item => !item.train_friendly).map((item) => (
                        <div key={item._id} className="menu-item">
                          <div className="menu-item-header">
                            <div className="item-info">
                              <div className="item-image-container">
                                <img src={item.image} alt={item.name} className="item-image" />
                              </div>
                              <div className="item-details">
                                <h4>{item.name}</h4>
                                <p className="item-description">{item.description}</p>
                                <div className="item-meta">
                                  <span className="item-price">Rs. {item.price}</span>
                                  {item.category && <span className="item-category">{item.category}</span>}
                                </div>
                              </div>
                            </div>
                            <button
                              className="add-to-cart-btn"
                              onClick={() => addToCart(item)}
                              disabled={item.available === false}
                            >
                              {item.available === false ? 'Unavailable' : 'Add to Cart'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="no-menu-items">
                    <div className="no-menu-content">
                      <h4>Menu Not Available</h4>
                      <p>We're having trouble loading the menu for {selectedRestaurant.name}.</p>
                      <div className="alternative-actions">
                        <button 
                          className="contact-restaurant-btn"
                          onClick={() => {
                            if (selectedRestaurant.google_data?.formatted_phone_number) {
                              window.open(`tel:${selectedRestaurant.google_data.formatted_phone_number}`);
                            } else {
                              alert('Phone number not available');
                            }
                          }}
                        >
                          📞 Contact Restaurant
                        </button>
                        <button 
                          className="view-google-maps-btn"
                          onClick={() => {
                            const lat = selectedRestaurant.location.coordinates[1];
                            const lng = selectedRestaurant.location.coordinates[0];
                            window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${selectedRestaurant.place_id}`, '_blank');
                          }}
                        >
                          🗺️ View on Google Maps
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {selectedStation && restaurants.length === 0 && (
          <div className="no-restaurants">
            <p>😔 No restaurants found near {selectedStation.station.name}</p>
            <p>Try selecting a different station or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedStationSearch;