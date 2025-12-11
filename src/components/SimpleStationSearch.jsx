// Simple Station Search with Google Maps API
import { useState } from 'react';
import axios from 'axios';
import './SimpleStationSearch.css';

const SimpleStationSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurantMenu, setRestaurantMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchStations = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    try {
      // Use the new stations search endpoint
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/maps/stations?q=${encodeURIComponent(searchQuery.trim())}&limit=10`
      );

      const stations = response.data.stations || [];
      
      if (stations.length > 0) {
        // Transform stations data to match expected format
        const transformedStations = stations.map(station => {
          const hasFood = station.tags && station.tags.includes('food_available');
          
          // Sample restaurants for food-available stations
          let sampleRestaurants = [];
          if (hasFood) {
            const stationName = station.name.toLowerCase();
            if (stationName.includes('chavakachcheri')) {
              sampleRestaurants = [
                {
                  place_id: 'chavaka_restaurant_1',
                  name: 'Chavakachcheri Food Court',
                  vicinity: 'Near Chavakachcheri Station',
                  rating: 4.2,
                  user_ratings_total: 85,
                  opening_hours: { open_now: true },
                  location: { 
                    lat: station.google_data?.geometry?.location?.lat || station.location.coordinates[1],
                    lng: station.google_data?.geometry?.location?.lng || station.location.coordinates[0]
                  }
                },
                {
                  place_id: 'chavaka_restaurant_2',
                  name: ' Jaffna Kitchen Chavakachcheri',
                  vicinity: 'Chavakachcheri Town Center',
                  rating: 4.0,
                  user_ratings_total: 62,
                  opening_hours: { open_now: true },
                  location: { 
                    lat: (station.google_data?.geometry?.location?.lat || station.location.coordinates[1]) + 0.001,
                    lng: (station.google_data?.geometry?.location?.lng || station.location.coordinates[0]) + 0.001
                  }
                }
              ];
            } else if (stationName.includes('meesalai')) {
              sampleRestaurants = [
                {
                  place_id: 'meesalai_restaurant_1',
                  name: 'Meesalai Railway Cafe',
                  vicinity: 'Meesalai Station Area',
                  rating: 4.1,
                  user_ratings_total: 73,
                  opening_hours: { open_now: true },
                  location: { 
                    lat: station.google_data?.geometry?.location?.lat || station.location.coordinates[1],
                    lng: station.google_data?.geometry?.location?.lng || station.location.coordinates[0]
                  }
                }
              ];
            } else if (stationName.includes('sangaththanai')) {
              sampleRestaurants = [
                {
                  place_id: 'sangatha_restaurant_1',
                  name: 'Sangaththanai Food Center',
                  vicinity: 'Near Sangaththanai Station',
                  rating: 3.9,
                  user_ratings_total: 54,
                  opening_hours: { open_now: false },
                  location: { 
                    lat: station.google_data?.geometry?.location?.lat || station.location.coordinates[1],
                    lng: station.google_data?.geometry?.location?.lng || station.location.coordinates[0]
                  }
                }
              ];
            } else if (stationName.includes('kodikamam')) {
              sampleRestaurants = [
                {
                  place_id: 'kodikamam_restaurant_1',
                  name: 'Kodikamam Restaurant',
                  vicinity: 'Kodikamam Junction',
                  rating: 4.3,
                  user_ratings_total: 91,
                  opening_hours: { open_now: true },
                  location: { 
                    lat: station.google_data?.geometry?.location?.lat || station.location.coordinates[1],
                    lng: station.google_data?.geometry?.location?.lng || station.location.coordinates[0]
                  }
                },
                {
                  place_id: 'kodikamam_restaurant_2',
                  name: 'Spice Garden Kodikamam',
                  vicinity: 'Kodikamam Market Area',
                  rating: 4.0,
                  user_ratings_total: 67,
                  opening_hours: { open_now: true },
                  location: { 
                    lat: (station.google_data?.geometry?.location?.lat || station.location.coordinates[1]) - 0.001,
                    lng: (station.google_data?.geometry?.location?.lng || station.location.coordinates[0]) - 0.001
                  }
                }
              ];
            }
          }
          
          return {
            station: {
              place_id: station.place_id,
              name: station.name,
              vicinity: station.vicinity,
              location: {
                lat: station.google_data?.geometry?.location?.lat || station.location.coordinates[1],
                lng: station.google_data?.geometry?.location?.lng || station.location.coordinates[0]
              },
              rating: station.rating,
              user_ratings_total: station.user_ratings_total,
              tags: station.tags,
              hasFood: hasFood
            },
            restaurants: sampleRestaurants
          };
        });

        setSearchResults(transformedStations);
        
        if (searchQuery.toLowerCase().includes('jaffna')) {
          console.log('🎯 Found Jaffna region stations:', transformedStations.length);
        }
      } else {
        setError(`No train stations found for "${searchQuery}". Try: Colombo Fort, Jaffna, Kandy, Galle, or Anuradhapura.`);
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      
      if (err.response?.status === 400) {
        setError('Please enter a valid search term to find train stations.');
      } else {
        setError('Unable to search stations. Please check your internet connection and try again.');
      }
      
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const selectStation = async (stationData) => {
    setSelectedStation(stationData);
    
    // Handle food availability
    if (stationData.station.hasFood) {
      // For stations with food available, fetch real restaurants from API
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/maps/station-restaurants/${encodeURIComponent(stationData.station.name)}`
        );
        
        if (response.data.restaurants && response.data.restaurants.length > 0) {
          // Transform restaurant data to match expected format
          const transformedRestaurants = response.data.restaurants.map(restaurant => ({
            place_id: restaurant._id,
            name: restaurant.name,
            vicinity: `${stationData.station.name} Area`,
            rating: restaurant.rating,
            user_ratings_total: Math.floor(Math.random() * 100) + 20, // Mock ratings count
            opening_hours: { open_now: true },
            location: stationData.station.location,
            menuItems: restaurant.menuItems,
            restaurantInfo: {
              description: restaurant.description,
              imageUrl: restaurant.imageUrl,
              cuisineType: restaurant.cuisineType,
              deliveryTimeEstimate: restaurant.deliveryTimeEstimate
            }
          }));
          
          setRestaurants(transformedRestaurants);
          console.log(`✅ Loaded ${transformedRestaurants.length} restaurants for ${stationData.station.name}`);
        } else {
          setRestaurants([]);
        }
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setRestaurants([]);
        setError('Unable to load restaurants. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      // For stations without food, show empty array and appropriate message
      setRestaurants([]);
    }
    
    setSelectedRestaurant(null);
    setRestaurantMenu([]);
  };

  const selectRestaurant = async (restaurant) => {
    setSelectedRestaurant(restaurant);
    setLoading(true);

    try {
      // Try to find if this restaurant exists in TrainFood system
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/restaurants/search?name=${encodeURIComponent(restaurant.name)}`
      );

      if (response.data && response.data.length > 0) {
        // Restaurant exists in TrainFood - get its menu
        const trainFoodRestaurant = response.data[0];
        const menuResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/products?restaurant=${trainFoodRestaurant._id}`
        );
        setRestaurantMenu(menuResponse.data.items || []);
      } else {
        // Restaurant not in TrainFood system - show sample menu
        setRestaurantMenu([
          {
            _id: 'sample-1',
            name: 'Chicken Fried Rice',
            price: 450,
            description: 'Delicious fried rice with chicken and vegetables',
            category: 'Rice Dishes',
            image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=250&fit=crop&crop=center'
          },
          {
            _id: 'sample-2',
            name: 'Fish Curry with Rice',
            price: 520,
            description: 'Traditional Sri Lankan fish curry served with rice',
            category: 'Curry Dishes',
            image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=250&fit=crop&crop=center'
          },
          {
            _id: 'sample-3',
            name: 'Vegetable Kottu',
            price: 380,
            description: 'Chopped roti with mixed vegetables and spices',
            category: 'Kottu Dishes',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop&crop=center'
          }
        ]);
      }
    } catch (err) {
      console.error('Error fetching menu:', err);
      setRestaurantMenu([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    alert(`Added ${product.name} to cart! This integrates with the existing cart system.`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchStations();
    }
  };

  return (
    <div className="simple-station-search">
      <div className="search-header">
        <h2>🍽️ Find Restaurants Near Train Stations</h2>
        <p>Search for train stations to discover nearby restaurants using Google Maps</p>
      </div>

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
            onClick={searchStations}
            disabled={loading || !searchQuery.trim()}
            className="search-button"
          >
            {loading ? '🔍 Searching...' : '🔍 Search'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

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
                    {stationData.station.hasFood ? (
                      <>🍽️ Food available - click to view restaurants</>
                    ) : (
                      <>❌ No food available at this station</>
                    )}
                  </p>
                  {stationData.station.hasFood && (
                    <div className="food-available-badge">
                      ✅ Food Available
                    </div>
                  )}
                  {!stationData.station.hasFood && (
                    <div className="no-food-badge">
                      ❌ No Food
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedStation && (
        <div className="restaurants-section">
          {selectedStation.station.hasFood ? (
            restaurants.length > 0 ? (
              <>
                <h3>🍴 Restaurants near {selectedStation.station.name}</h3>
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
                      {restaurant.opening_hours && (
                        <p className="restaurant-status">
                          {restaurant.opening_hours.open_now ? '🟢 Open now' : '🔴 Closed'}
                        </p>
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
                            const url = `https://www.google.com/maps/search/?api=1&query=${restaurant.location.lat},${restaurant.location.lng}&query_place_id=${restaurant.place_id}`;
                            window.open(url, '_blank');
                          }}
                        >
                          🗺️ View on Map
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="no-restaurants">
                <p>🔍 Looking for restaurants near {selectedStation.station.name}...</p>
                <p>Please wait while we find food options for you.</p>
              </div>
            )
          ) : (
            <div className="no-restaurants">
              <p>😔 Sorry, no food available at this station.</p>
              <p>Please try selecting a different station from the list above.</p>
              <div className="suggestion-list">
                <p><strong>Recommended stations with food:</strong></p>
                <ul>
                  <li>🚆 Chavakachcheri Station - Multiple food options</li>
                  <li>🚆 Meesalai Station - Local restaurants available</li>
                  <li>🚆 Sangaththanai Station - Food court and restaurants</li>
                  <li>🚆 Kodikamam Station - Various dining options</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

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
            <p className="restaurant-info">
              📍 {selectedRestaurant.vicinity} •
              {selectedRestaurant.rating && ` ⭐ ${selectedRestaurant.rating}`}
              {selectedRestaurant.opening_hours && ` • ${selectedRestaurant.opening_hours.open_now ? '🟢 Open' : '🔴 Closed'}`}
            </p>
          </div>

          {loading ? (
            <div className="loading-menu">Loading menu...</div>
          ) : (
            <div className="menu-items">
              {restaurantMenu.map((item) => (
                <div key={item._id} className="menu-item">
                  <div className="menu-item-header">
                    <div className="item-info">
                      <div className="item-image-container">
                        <img src={item.imageUrl} alt={item.name} className="item-image" />
                      </div>
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p className="item-description">{item.description}</p>
                        <p className="item-price">Rs. {(item.priceCents / 100).toFixed(2)}</p>
                        <p className="item-category">{item.category}</p>
                      </div>
                    </div>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
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
  );
};

export default SimpleStationSearch;