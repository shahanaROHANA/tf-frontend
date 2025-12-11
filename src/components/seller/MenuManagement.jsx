import React, { useState, useEffect } from 'react';
import './MenuManagement.css';

const MenuManagement = ({ mode }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(mode === 'add');
  const [editingProduct, setEditingProduct] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    available: 'all',
  });
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Veg',
    imageUrl: '',
    stock: '',
    deliveryTimeEstimate: '25 mins',
  });

  useEffect(() => {
    if (mode === 'list') {
      fetchProducts();
    }
  }, [filters, mode]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('sellerToken') || localStorage.getItem('token');
      if (!token) {
        setMessage('Authentication required. Please login again.');
        return;
      }

      const queryParams = new URLSearchParams();

      // Add filters
      if (filters.available !== 'all')
        queryParams.append('onlyAvailable', filters.available === 'true');

      // For sellers, we need to get products created by this seller
      // Since the API doesn't have a specific seller endpoint, we'll filter on client side
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const allProducts = data.items || [];
        
        // Filter products to show only those created by the current seller
        // We can identify seller products by checking if they have createdBy field
        // or by getting the user info from token
        let sellerProducts = allProducts;
        
        // If we have user info in token, filter by createdBy
        try {
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          const currentUserId = tokenPayload._id;
          
          if (currentUserId) {
            sellerProducts = allProducts.filter(product => 
              product.createdBy?.toString() === currentUserId.toString() ||
              product.sellerId?.toString() === currentUserId.toString()
            );
          }
        } catch (e) {
          console.log('Could not parse token to filter products');
          // If token parsing fails, show all products (fallback)
        }
        
        console.log(`📊 Found ${allProducts.length} total products, showing ${sellerProducts.length} seller products`);
        setProducts(sellerProducts);
      } else {
        const err = await response.json().catch(() => ({}));
        console.error('Fetch products error:', response.status, err);
        setMessage(err.message || 'Error loading products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessage('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enhanced validation
    if (!formData.name.trim()) {
      setMessage('Product name is required');
      return;
    }
    if (formData.name.trim().length < 2) {
      setMessage('Product name must be at least 2 characters');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setMessage('Valid price is required');
      return;
    }
    
    // Enhanced stock validation
    if (formData.stock !== '' && formData.stock !== null && formData.stock !== undefined) {
      const stockStr = String(formData.stock).trim();
      
      // Reject empty string or whitespace
      if (stockStr === '') {
        setMessage('Stock cannot be empty. Use a positive number or leave blank for unlimited stock');
        return;
      }
      
      const stockNum = Number.parseInt(stockStr, 10);
      
      // Check if it's a valid number
      if (isNaN(stockNum)) {
        setMessage('Stock must be a valid number or empty for unlimited stock');
        return;
      }
      
      // Must be positive integer (no zero, no negative, no decimals)
      if (stockNum <= 0) {
        setMessage('Stock must be a positive number (1 or greater) or leave blank for unlimited stock');
        return;
      }
      
      // Check for decimals
      if (Number.parseFloat(stockStr) !== stockNum) {
        setMessage('Stock must be a whole number (no decimals)');
        return;
      }
    }

    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('sellerToken') || localStorage.getItem('token');
      if (!token) {
        setMessage('Authentication required. Please login again.');
        return;
      }

      const url = editingProduct
        ? `${import.meta.env.VITE_API_URL}/products/${editingProduct._id}`
        : `${import.meta.env.VITE_API_URL}/products`;

      const method = editingProduct ? 'PUT' : 'POST';

      const priceNumber = Number.parseFloat(formData.price);

      // Backend /api/products.create expects priceCents in body
      const submitData = {
        name: formData.name.trim(),
        description: formData.description?.trim() || '',
        priceCents: Math.round(priceNumber * 100),
        available: true, // default true
        imageUrl: formData.imageUrl?.trim() || '',
        stock: formData.stock === '' || formData.stock === null
          ? null
          : (() => {
              const stockNum = Number.parseInt(formData.stock, 10);
              return isNaN(stockNum) ? null : stockNum;
            })(),
        // Include all fields that backend supports
        category: formData.category,
        deliveryTimeEstimate: formData.deliveryTimeEstimate?.trim() || '',
      };

      console.log('🔄 Submitting product data:', submitData);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      console.log('📊 Response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Success response:', result);

        const successMessage = editingProduct
          ? 'Product updated successfully!'
          : 'Product added successfully!';
        setMessage(successMessage);

        if (editingProduct) {
          resetForm();
          if (mode === 'list') {
            fetchProducts();
          }
        } else {
          setFormData({
            name: '',
            description: '',
            price: '',
            category: 'Veg',
            imageUrl: '',
            stock: '',
            deliveryTimeEstimate: '30 mins',
          });
          setEditingProduct(null);
          if (mode === 'list') {
            fetchProducts();
          }
          setTimeout(() => {
            setMessage('');
          }, 3000);
        }
      } else {
        const error = await response.json().catch(() => ({
          message: 'Unknown error',
        }));
        console.error('❌ Error response from backend:', response.status, error);
        
        // Show specific error message
        let errorMessage = error.message || 'Failed to save product';
        if (error.errors && Array.isArray(error.errors)) {
          errorMessage = error.errors.map(err => `${err.field}: ${err.message}`).join(', ');
        }
        
        setMessage(errorMessage);
      }
    } catch (error) {
      console.error('💥 Submit error:', error);
      setMessage('Error saving product. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.priceCents
        ? (product.priceCents / 100).toFixed(2)
        : product.price || '',
      category: product.category || 'Veg',
      imageUrl: product.imageUrl || '',
      stock: product.stock === null || product.stock === undefined
        ? ''
        : String(product.stock),
      deliveryTimeEstimate: product.deliveryTimeEstimate || '30 mins',
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?'))
      return;

    try {
      const token = localStorage.getItem('sellerToken') || localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products/${productId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setMessage('Product deleted successfully!');
        fetchProducts();
      } else {
        const error = await response.json().catch(() => ({}));
        setMessage(error.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessage('Error deleting product. Please try again.');
    }
  };

  const toggleAvailability = async (product) => {
    try {
      const token = localStorage.getItem('sellerToken') || localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products/${product._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ available: !product.available }),
        }
      );

      if (response.ok) {
        setMessage(`Product ${product.available ? 'deactivated' : 'activated'} successfully!`);
        fetchProducts();
      } else {
        const err = await response.json().catch(() => ({}));
        console.error('Toggle availability error:', response.status, err);
        setMessage(err.message || 'Error updating product availability.');
      }
    } catch (error) {
      console.error('Toggle availability error:', error);
      setMessage('Error updating product availability.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Veg',
      imageUrl: '',
      stock: '',
      deliveryTimeEstimate: '30 mins',
    });
    setEditingProduct(null);
    if (mode === 'list') {
      setShowAddForm(false);
    }
  };

  const formatPrice = (centsOrNumber) => {
    if (centsOrNumber == null) return '₹0.00';
    return `₹${(centsOrNumber / 100).toFixed(2)}`;
  };

  if (loading && mode === 'list' && products.length === 0) {
    return (
      <div className="menu-management">
        <div className="card">
          <div className="text-center p-4">
            <div className="loading-spinner"></div>
            <p>Loading menu items...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-management">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            {mode === 'add' ? '➕ Add Product' : '📦 My Products'}
          </h2>
          {mode === 'list' && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                className="btn btn-primary"
                onClick={() => setShowAddForm(true)}
              >
                ➕ Add New Item
              </button>
              <button
                className="btn btn-secondary"
                onClick={fetchProducts}
                disabled={loading}
              >
                🔄 Refresh
              </button>
            </div>
          )}
          {mode === 'add' && (
            <div className="header-info">
              <small className="text-muted">
                💡 Add multiple products quickly - form stays open after each addition
              </small>
            </div>
          )}
        </div>

        {message && (
          <div className={`alert ${message.toLowerCase().includes('success') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}

        {mode === 'list' && (
          <>
            <div className="filters-section">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Availability</label>
                  <select
                    className="form-control"
                    value={filters.available}
                    onChange={(e) => setFilters((prev) => ({ ...prev, available: e.target.value }))}
                  >
                    <option value="all">All Items</option>
                    <option value="true">Available</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="products-list">
              {products.length === 0 ? (
                <div className="text-center p-4">
                  <p>No products found. Add your first menu item!</p>
                </div>
              ) : (
                <div className="products-grid">
                  {products.map((product) => (
                    <div key={product._id} className="product-card">
                      <div className="product-image">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} />
                        ) : (
                          <div className="image-placeholder">🍱</div>
                        )}
                        <div className="product-status">
                          <span className={`status-badge ${product.available ? 'active' : 'inactive'}`}>
                            {product.available ? '✅ Available' : '❌ Out of Stock'}
                          </span>
                        </div>
                      </div>

                      <div className="product-info">
                        <h3>{product.name}</h3>
                        <p className="product-description">{product.description}</p>
                        <div className="product-meta">
                          <span className="price">{formatPrice(product.priceCents)}</span>
                          {product.category && <span className="category">{product.category}</span>}
                        </div>
                        {product.deliveryTimeEstimate && (
                          <p className="delivery-time">⏱️ {product.deliveryTimeEstimate}</p>
                        )}
                        {product.stock !== null && (
                          <p className="stock-info">📦 Stock: {product.stock || 'Unlimited'}</p>
                        )}
                      </div>

                      <div className="product-actions">
                        <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(product)}>
                          ✏️ Edit
                        </button>
                        <button
                          className={`btn btn-sm ${product.available ? 'btn-warning' : 'btn-success'}`}
                          onClick={() => toggleAvailability(product)}
                        >
                          {product.available ? '⏸️ Deactivate' : '▶️ Activate'}
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(product._id)}>
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h3>{editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}</h3>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  if (mode === 'add') {
                    resetForm();
                    setMessage('Form cleared. Ready to add another product!');
                    setTimeout(() => setMessage(''), 3000);
                  } else {
                    resetForm();
                  }
                }}
                disabled={loading}
              >
                {mode === 'add' ? '🗑️ Clear Form' : '❌ Close'}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="form-control"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-control"
                  rows="3"
                  placeholder="Describe your product..."
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="form-control">
                    <option value="Veg">Vegetarian</option>
                    <option value="Non-Veg">Non-Vegetarian</option>
                    <option value="Jain">Jain</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Delivery Time</label>
                  <input
                    type="text"
                    name="deliveryTimeEstimate"
                    value={formData.deliveryTimeEstimate}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="30 mins"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Leave empty for unlimited"
                    min="1"
                    step="1"
                    title="Enter a positive whole number (1 or greater), or leave empty for unlimited stock"
                  />
                  <small className="form-hint">
                    💡 Leave empty for unlimited stock. If entering a number, it must be 1 or greater.
                  </small>
                </div>
                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
                  disabled={loading || !formData.name.trim() || !formData.price}
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner small"></span>
                      {editingProduct ? '💾 Updating...' : '➕ Adding...'}
                    </>
                  ) : editingProduct ? (
                    '💾 Update Product'
                  ) : (
                    '➕ Add Product'
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    if (mode === 'add') {
                      resetForm();
                      setMessage('✅ Form cleared. Ready to add another product!');
                      setTimeout(() => setMessage(''), 3000);
                    } else {
                      resetForm();
                    }
                  }}
                  disabled={loading}
                >
                  {mode === 'add' ? '🗑️ Clear Form' : '❌ Cancel'}
                </button>
              </div>

              <div className="form-hints">
                {!formData.name.trim() && <small className="hint warning">⚠️ Product name is required</small>}
                {(!formData.price || Number.parseFloat(formData.price) <= 0) && (
                  <small className="hint warning">⚠️ Valid price is required</small>
                )}
                {formData.stock !== '' && formData.stock !== null && formData.stock !== undefined && (
                  <>
                    {(() => {
                      const stockStr = String(formData.stock).trim();
                      const stockNum = Number.parseInt(stockStr, 10);
                      
                      if (stockStr === '') {
                        return <small className="hint warning">⚠️ Stock cannot be empty. Use a positive number or leave blank for unlimited stock</small>;
                      }
                      
                      if (isNaN(stockNum)) {
                        return <small className="hint warning">⚠️ Stock must be a valid number or empty for unlimited stock</small>;
                      }
                      
                      if (stockNum <= 0) {
                        return <small className="hint warning">⚠️ Stock must be a positive number (1 or greater) or leave blank for unlimited stock</small>;
                      }
                      
                      if (Number.parseFloat(stockStr) !== stockNum) {
                        return <small className="hint warning">⚠️ Stock must be a whole number (no decimals)</small>;
                      }
                      
                      return <small className="hint success">✅ Stock: {stockNum} units</small>;
                    })()}
                  </>
                )}
                {formData.name.trim() && formData.price && Number.parseFloat(formData.price) > 0 && (
                  <small className="hint success">✅ Ready to submit</small>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;