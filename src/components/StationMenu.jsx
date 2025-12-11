import { useState, useEffect } from 'react';
import axios from 'axios';
import './StationMenu.css';

const StationMenu = ({ onAddToCart }) => {
  const [stations, setStations] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedStation, setSelectedStation] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch available stations on component mount
  useEffect(() => {
    fetchStations();
  }, []);

  // Fetch restaurants when station is selected
  useEffect(() => {
    if (selectedStation) {
      fetchRestaurants(selectedStation);
      setSelectedRestaurant(null);
      setProducts([]);
    } else {
      setRestaurants([]);
      setSelectedRestaurant(null);
      setProducts([]);
    }
  }, [selectedStation]);

  const fetchStations = async (retries = 3) => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/restaurants/stations`);
      setStations(response.data);
      console.log(response.data, "stations");
      setError(''); // Clear any previous error
    } catch (err) {
      console.error('Error fetching stations:', err);
      if (retries > 0) {
        console.log(`Retrying fetch stations... ${retries} attempts left`);
        setTimeout(() => fetchStations(retries - 1), 1000);
      } else {
        setError('Failed to fetch stations. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurants = async (station, retries = 3) => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/restaurants?station=${station}`);
      setRestaurants(response.data);
      setError(''); // Clear any previous error
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      if (retries > 0) {
        console.log(`Retrying fetch restaurants... ${retries} attempts left`);
        setTimeout(() => fetchRestaurants(station, retries - 1), 1000);
      } else {
        setError('Failed to fetch restaurants. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurantProducts = async (restaurant, retries = 3) => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/restaurants/${restaurant._id}`);
      setSelectedRestaurant(response.data.restaurant);
      setProducts(response.data.products);
      setError(''); // Clear any previous error
    } catch (err) {
      console.error('Error fetching products:', err);
      if (retries > 0) {
        console.log(`Retrying fetch products... ${retries} attempts left`);
        setTimeout(() => fetchRestaurantProducts(restaurant, retries - 1), 1000);
      } else {
        setError('Failed to fetch menu items. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to add items to cart');
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL}/cart/add`,
        { productId, quantity },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert('Product added to cart!');
      if (onAddToCart) onAddToCart();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const formatPrice = (priceCents) => {
    return (priceCents / 100).toFixed(2);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Veg': return '#4CAF50';
      case 'Non-Veg': return '#F44336';
      case 'Mixed': return '#FF9800';
      case 'Beverages': return '#2196F3';
      case 'Pizza': return '#9C27B0';
      default: return '#757575';
    }
  };

  const resetSelection = () => {
    setSelectedStation('');
    setSelectedRestaurant(null);
    setRestaurants([]);
    setProducts([]);
  };

  return (
    <div className="station-menu-container">
      <div className="menu-header">
        <h2>🍽️ Train Food Menu</h2>
        <p>Select your station → Choose restaurant → Order food</p>
      </div>

      {/* Station Selection */}
      <div className="selection-section">
        <label className="selection-label">
          🚉 Select Station:
          <select
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
            className="station-dropdown"
            disabled={loading}
          >
            <option value="">-- Choose Station --</option>
            {stations.map((station) => (
              <option key={station} value={station}>
                {station}
              </option>
            ))}
          </select>
        </label>

        {selectedStation && (
          <button onClick={resetSelection} className="reset-btn">
            ✖ Reset
          </button>
        )}
      </div>

      {/* Restaurants Grid */}
      {selectedStation && restaurants.length > 0 && (
        <div className="restaurants-section">
          <h3>🍴 Restaurants at {selectedStation}</h3>
          <div className="restaurants-grid">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className={`restaurant-card ${selectedRestaurant?._id === restaurant._id ? 'selected' : ''}`}
                onClick={() => fetchRestaurantProducts(restaurant)}
              >
                <div className="restaurant-image">
                  {restaurant.imageUrl ? (
                    <img src={restaurant.imageUrl} alt={restaurant.name} />
                  ) : (
                    <div className="placeholder-image">🍽️</div>
                  )}
                </div>
                <div className="restaurant-info">
                  <h4>{restaurant.name}</h4>
                  <p className="restaurant-description">{restaurant.description}</p>
                  <div className="restaurant-meta">
                    <span 
                      className="cuisine-badge"
                      style={{ backgroundColor: getCategoryColor(restaurant.cuisineType) }}
                    >
                      {restaurant.cuisineType}
                    </span>
                    <span className="delivery-time">⏱️ {restaurant.deliveryTimeEstimate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      {selectedRestaurant && (
        <div className="products-section">
          <div className="products-header">
            <h3>🍛 Menu from {selectedRestaurant.name}</h3>
            <p>{selectedRestaurant.description}</p>
          </div>
          
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} />
                  ) : (
                    <div className="placeholder-image">🍽️</div>
                  )}
                </div>
                <div className="product-info">
                  <h4 className="product-name">{product.name}</h4>
                  <p className="product-description">{product.description}</p>
                  <div className="product-meta">
                    <span 
                      className="category-badge"
                      style={{ backgroundColor: getCategoryColor(product.category) }}
                    >
                      {product.category}
                    </span>
                    <span className="delivery-time">⏱️ {product.deliveryTimeEstimate}</span>
                  </div>
                  <div className="product-footer">
                    <span className="product-price">₹{formatPrice(product.priceCents)}</span>
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      className="add-to-cart-btn"
                      disabled={!product.available || loading}
                    >
                      {product.available ? 'Add to Cart' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="no-products">
              <p>No menu items available for this restaurant.</p>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
          <div className="error-actions">
            <button onClick={() => {
              setError('');
              if (!selectedStation) fetchStations();
              else if (!selectedRestaurant) fetchRestaurants(selectedStation);
              else fetchRestaurantProducts(selectedRestaurant);
            }} className="retry-btn">🔄 Retry</button>
            <button onClick={() => setError('')} className="close-error">✖</button>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!selectedStation && !loading && !error && (
        <div className="instructions">
          <h3>🚂 How to Order:</h3>
          <ol>
            <li>Select your train station from the dropdown above</li>
            <li>Choose a restaurant at your station</li>
            <li>Browse the menu and add items to your cart</li>
            <li>Proceed to checkout when ready</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default StationMenu;
