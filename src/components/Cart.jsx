// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import Checkout from './Checkout.jsx';
// import OrderTracking from './OrderTracking.jsx';
// import TrainSchedule from './TrainSchedule.jsx';
// import './Cart.css';

// const Cart = () => {
//   const [cart, setCart] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [currentView, setCurrentView] = useState('cart'); // 'cart', 'checkout', 'schedule'
//   const [selectedOrderId, setSelectedOrderId] = useState(null);

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const fetchCart = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('Please login to view your cart');
//         setLoading(false);
//         return;
//       }

//       const response = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       setCart(response.data);
//     } catch (err) {
//       setError('Failed to fetch cart');
//       console.error('Error fetching cart:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateQuantity = async (productId, quantity) => {
//     try {
//       const token = localStorage.getItem('token');
      
//       await axios.put(
//         `${import.meta.env.VITE_API_URL}/cart/update`,
//         { productId, quantity },
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );

//       // Refresh cart
//       fetchCart();
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to update cart');
//     }
//   };

//   const removeItem = async (productId) => {
//     try {
//       const token = localStorage.getItem('token');
      
//       await axios.delete(`${import.meta.env.VITE_API_URL}/cart/remove/${productId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       // Refresh cart
//       fetchCart();
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to remove item');
//     }
//   };

//   const clearCart = async () => {
//     try {
//       const token = localStorage.getItem('token');
      
//       await axios.delete(`${import.meta.env.VITE_API_URL}/cart/clear`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       // Refresh cart
//       fetchCart();
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to clear cart');
//     }
//   };

//   const calculateTotal = () => {
//     if (!cart || !cart.items) return 0;
    
//     return cart.items.reduce((total, item) => {
//       const itemTotal = (item.priceCents * item.quantity) / 100;
//       return total + itemTotal;
//     }, 0);
//   };

//   const formatPrice = (priceCents) => {
//     return (priceCents / 100).toFixed(2);
//   };

//   const handleCheckoutSuccess = (orderData) => {
//     // Store order data for schedule
//     if (orderData.orderId) {
//       setSelectedOrderId(orderData.orderId);
//       setCurrentView('schedule');
//     }
//   };

//   const handleBackToCart = () => {
//     setCurrentView('cart');
//     setSelectedOrderId(null);
//     fetchCart(); // Refresh cart after potential order
//   };

//   const handleBackToCartFromTracking = () => {
//     setCurrentView('cart');
//     setSelectedOrderId(null);
//   };

//   // Show different views based on currentView state
//   if (currentView === 'checkout') {
//     return (
//       <Checkout 
//         cartItems={cart?.items || []} 
//         onOrderSuccess={handleCheckoutSuccess}
//         onBack={handleBackToCart}
//       />
//     );
//   }

//   if (currentView === 'schedule' && selectedOrderId) {
//     return (
//       <TrainSchedule
//         orderId={selectedOrderId}
//         onBack={handleBackToCartFromTracking}
//       />
//     );
//   }

//   // Cart view
//   if (loading) return <div className="loading">Loading cart...</div>;
//   if (error) return <div className="error">{error}</div>;

//   if (!cart || !cart.items || cart.items.length === 0) {
//     return (
//       <div className="empty-cart">
//         <h2>Your Cart</h2>
//         <p>Your cart is empty</p>
//         <button onClick={() => window.location.href = '/products'} className="continue-shopping-btn">
//           Continue Shopping
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="cart-container">
//       <h2>Your Cart</h2>
      
//       <div className="cart-items">
//         {cart.items.filter(item => item.product !== null).map((item) => (
//           <div key={item.product._id} className="cart-item">
//             <div className="item-info">
//               <h3>{item.product.name}</h3>
//               <p className="item-description">{item.product.description}</p>
//               <p className="item-station">📍 {item.product.station}</p>
//               <p className="item-price">₹{formatPrice(item.priceCents)} each</p>
//             </div>

//             <div className="item-controls">
//               <div className="quantity-controls">
//                 <button
//                   onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
//                   disabled={item.quantity <= 1}
//                   className="quantity-btn"
//                 >
//                   -
//                 </button>
//                 <span className="quantity">{item.quantity}</span>
//                 <button
//                   onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
//                   className="quantity-btn"
//                 >
//                   +
//                 </button>
//               </div>

//               <div className="item-total">
//                 ₹{formatPrice(item.priceCents * item.quantity)}
//               </div>

//               <button
//                 onClick={() => removeItem(item.product._id)}
//                 className="remove-btn"
//               >
//                 Remove
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="cart-summary">
//         <div className="summary-row">
//           <span>Subtotal:</span>
//           <span>₹{calculateTotal().toFixed(2)}</span>
//         </div>
//         <div className="summary-row">
//           <span>Delivery Fee:</span>
//           <span>₹20.00</span>
//         </div>
//         <div className="summary-row total">
//           <span>Total:</span>
//           <span>₹{(calculateTotal() + 20).toFixed(2)}</span>
//         </div>
        
//         <div className="cart-actions">
//           <button onClick={clearCart} className="clear-cart-btn">
//             Clear Cart
//           </button>
//           <button
//             onClick={() => setCurrentView('checkout')}
//             disabled={loading || cart.items.length === 0}
//             className="checkout-btn"
//           >
//             Proceed to Checkout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;
import { useState, useEffect } from 'react';
import { api } from '../utils/authUtils';
import Checkout from './Checkout.jsx';
import TrainSchedule from './TrainSchedule.jsx';
import './Cart.css';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentView, setCurrentView] = useState('cart'); // 'cart', 'checkout', 'schedule'
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      setCart(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Please login to view your cart');
      } else {
        setError('Failed to fetch cart');
        console.error('Error fetching cart:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await api.put('/cart/update', { productId, quantity });
      fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update cart');
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete(`/cart/remove/${productId}`);
      fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear');
      fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to clear cart');
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    
    return cart.items.reduce((total, item) => {
      const itemTotal = (item.priceCents * item.quantity) / 100;
      return total + itemTotal;
    }, 0);
  };

  const formatPrice = (priceCents) => {
    return (priceCents / 100).toFixed(2);
  };

  const handleCheckoutSuccess = (orderData) => {
    if (orderData.orderId) {
      setSelectedOrderId(orderData.orderId);
      setCurrentView('schedule');
    }
  };

  const handleBackToCart = () => {
    setCurrentView('cart');
    setSelectedOrderId(null);
    fetchCart();
  };

  const handleBackToCartFromTracking = () => {
    setCurrentView('cart');
    setSelectedOrderId(null);
  };

  if (currentView === 'checkout') {
    return (
      <Checkout 
        cartItems={cart?.items || []} 
        onOrderSuccess={handleCheckoutSuccess}
        onBack={handleBackToCart}
      />
    );
  }

  if (currentView === 'schedule' && selectedOrderId) {
    return (
      <TrainSchedule
        orderId={selectedOrderId}
        onBack={handleBackToCartFromTracking}
      />
    );
  }

  if (loading) return <div className="loading">Loading cart...</div>;
  if (error) return <div className="error">{error}</div>;

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-header">
          <span className="cart-icon">🛒</span>
          <h2>Your Cart</h2>
        </div>
        <div className="empty-cart">
          <span className="empty-icon">🤔</span>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any delicious items yet.<br/>Start exploring our menu to add some tasty treats!</p>
          <button onClick={() => window.location.href = '/products'} className="continue-shopping-btn">
            🍽️ Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <span className="cart-icon">🛒</span>
        <h2>Your Cart</h2>
      </div>
      
      <div className="cart-items">
        {cart.items.filter(item => item.product !== null).map((item) => (
          <div key={item.product._id} className="cart-item">
            <div className="item-content">
              <div className="item-info">
                <h3>{item.product.name}</h3>
                <p className="item-description">{item.product.description}</p>
                <div className="item-meta">
                  <span className="item-station">📍 {item.product.station}</span>
                </div>
                <p className="item-price">₹{formatPrice(item.priceCents)} each</p>
              </div>

              <div className="item-controls">
                <div className="quantity-controls">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="item-total">
                ₹{formatPrice(item.priceCents * item.quantity)}
              </div>

              <button
                onClick={() => removeItem(item.product._id)}
                className="remove-btn"
              >
                🗑️ Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>₹{calculateTotal().toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Delivery Fee:</span>
          <span>₹20.00</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>₹{(calculateTotal() + 20).toFixed(2)}</span>
        </div>
        
        <div className="cart-actions">
          <button onClick={clearCart} className="clear-cart-btn">
            🗑️ Clear Cart
          </button>
          <button
            onClick={() => setCurrentView('checkout')}
            disabled={loading || cart.items.length === 0}
            className="checkout-btn"
          >
            💳 Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;