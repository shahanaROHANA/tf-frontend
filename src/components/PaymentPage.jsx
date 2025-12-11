// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";
// import CheckoutForm from "./CheckoutForm"; // Created below
// import "./PaymentPage.css"; // Your styles

// // Load your publishable key
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// const PaymentPage = () => {
//   const [clientSecret, setClientSecret] = useState("");
//   const location = useLocation();
//   const navigate = useNavigate();
  
//   // We expect orderId to be passed via navigation state or URL
//   // e.g., navigate('/payment', { state: { orderId: '12345' } })
//   const orderId = location.state?.orderId;

//   useEffect(() => {
//     if (!orderId) {
//       console.error("No orderId found");
//       navigate("/orders"); // Redirect if lost
//       return;
//     }

//     // 1. Ask backend for payment intent
//     const fetchPaymentIntent = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await fetch(`${import.meta.env.VITE_API_URL}/payment/create-intent`, {
//           method: "POST",
//           headers: { 
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`
//           },
//           body: JSON.stringify({ orderId }),
//         });

//         const data = await res.json();
//         if (res.ok) {
//           setClientSecret(data.clientSecret);
//         } else {
//           console.error("Failed to init payment:", data.message);
//           alert(`Error: ${data.message}`);
//         }
//       } catch (error) {
//         console.error("Network error:", error);
//       }
//     };

//     fetchPaymentIntent();
//   }, [orderId, navigate]);

//   const appearance = { theme: 'stripe' };
//   const options = { clientSecret, appearance };

//   return (
//     <div className="payment-container">
//       <h2>Complete Your Payment</h2>
//       {clientSecret ? (
//         <Elements options={options} stripe={stripePromise}>
//           <CheckoutForm orderId={orderId} />
//         </Elements>
//       ) : (
//         <div className="loading">Loading Payment Gateway...</div>
//       )}
//     </div>
//   );
// };

// export default PaymentPage;

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm"; 
import "./PaymentPage.css"; 

// Load your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentPage = () => {
  const [clientSecret, setClientSecret] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get orderId passed from Checkout.jsx
  const orderId = location.state?.orderId;

  useEffect(() => {
    if (!orderId) {
      console.error("No orderId found");
      navigate("/orders"); // Redirect if lost
      return;
    }

    // Ask backend for payment intent
    const fetchPaymentIntent = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/payment/create-intent`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ orderId }),
        });

        const data = await res.json();
        if (res.ok) {
          setClientSecret(data.clientSecret);
        } else {
          console.error("Failed to init payment:", data.message);
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    fetchPaymentIntent();
  }, [orderId, navigate]);

  const appearance = { theme: 'stripe' };
  const options = { clientSecret, appearance };

  return (
    <div className="payment-container">
      <div className="payment-header">
        <span className="payment-icon">💳</span>
        <h2>Complete Your Payment</h2>
        <p className="payment-subtitle">Secure payment powered by Stripe</p>
      </div>
      
      {clientSecret ? (
        <div className="payment-form">
          <div className="payment-methods-preview">
            <div className="method-icon">💳</div>
            <div className="method-icon">📱</div>
            <div className="method-icon">🏦</div>
            <div className="method-icon">💰</div>
          </div>
          
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm orderId={orderId} />
          </Elements>
          
          <div className="security-info">
            <span className="security-icon">🔒</span>
            <p>Your payment information is secure and encrypted</p>
          </div>
          
          <div className="payment-features">
            <h3>Why pay with TrainFood?</h3>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span>Instant Payment</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🛡️</span>
                <span>Bank-Level Security</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💯</span>
                <span>100% Safe</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <span>Easy & Fast</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="loading">
          <div className="spinner"></div>
          <div className="loading-text">Setting up secure payment...</div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;