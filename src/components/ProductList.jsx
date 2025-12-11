import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './ProductList.css';

const ProductList = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStation, setSelectedStation] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchProducts();

    // Connect to socket for real-time updates
    const token = localStorage.getItem('token');
    if (token) {
      const socketConnection = io(import.meta.env.VITE_API_URL.replace('/api', ''), {
        auth: { token }
      });

      socketConnection.on('connect', () => {
        console.log('Connected to real-time updates');
      });

      socketConnection.on('product.created', (data) => {
        console.log('New product received:', data);
        // Add new product to the list if it matches current filters
        setProducts(prevProducts => {
          const newProduct = {
            ...data.product,
            restaurantName: data.restaurantName
          };

          // Check if product matches current station filter
          if (selectedStation && newProduct.station !== selectedStation) {
            return prevProducts; // Don't add if station doesn't match
          }

          // Check if product matches search term
          if (searchTerm && !newProduct.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return prevProducts; // Don't add if search doesn't match
          }

          // Add to beginning of list (newest first)
          return [newProduct, ...prevProducts];
        });
      });

      socketConnection.on('disconnect', () => {
        console.log('Disconnected from real-time updates');
      });

      setSocket(socketConnection);

      return () => {
        socketConnection.disconnect();
      };
    }
  }, [searchTerm, selectedStation]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.q = searchTerm;
      if (selectedStation) params.station = selectedStation;
      params.onlyAvailable = 'true';

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/products`, { params });
      setProducts(response.data.items || []);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
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

      // Get product details for stock validation
      const product = products.find(p => p._id === productId);
      if (product && product.stock !== null && product.stock < quantity) {
        alert(`Only ${product.stock} items available in stock`);
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

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-list-container">
      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={selectedStation}
          onChange={(e) => setSelectedStation(e.target.value)}
          className="station-select"
        >
          <option value="">All Stations</option>
          <option value="kilinochchi">Kilinochchi</option>
          <option value="kodikamam">Kodikamam</option>
          <option value="meesalai">Meesalai</option>
          <option value="sangaththanai">Sangaththanai</option>
          <option value="chavakachcheri">Chavakachcheri</option>
        </select>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <div className="product-image">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} />
              ) : (
                <div className="placeholder-image">No Image</div>
              )}
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-station">📍 {product.station}</p>
              
              {/* Stock Information */}
              <div className="stock-info">
                {product.stock !== null && product.stock !== undefined ? (
                  <span className={`stock-level ${product.stock < 10 ? 'low-stock' : 'in-stock'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                ) : (
                  <span className="stock-level unlimited">Unlimited stock</span>
                )}
              </div>
              
              <div className="product-footer">
                <span className="product-price">₹{formatPrice(product.priceCents)}</span>
                <div className="cart-controls">
                  <button
                    onClick={() => handleAddToCart(product._id, 1)}
                    className="add-to-cart-btn"
                    disabled={!product.available || (product.stock === 0)}
                  >
                    {product.available ? 'Add to Cart' : 'Unavailable'}
                  </button>
                  {product.stock && product.stock > 1 && (
                    <button
                      onClick={() => handleAddToCart(product._id, 2)}
                      className="add-two-btn"
                      disabled={!product.available || product.stock < 2}
                    >
                      Add 2
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="no-products">
          <p>No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
