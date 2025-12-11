// import React, { useState } from "react";
// import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
// import { useNavigate } from "react-router-dom";

// const CheckoutForm = ({ orderId }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();

//   const [message, setMessage] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!stripe || !elements) return;

//     setIsLoading(true);
//     setMessage("");

//     // 2. Confirm payment with Stripe
//     const { error, paymentIntent } = await stripe.confirmPayment({
//       elements,
//       redirect: "if_required", // IMPORTANT: Prevents redirect if not needed (e.g. Cards)
//     });

//     if (error) {
//       // Show error to your customer
//       setMessage(error.message);
//       setIsLoading(false);
//     } else if (paymentIntent && paymentIntent.status === "succeeded") {
//       // 3. Payment successful on Stripe side!
//       // Now verify with our backend to update DB
//       await verifyPaymentWithBackend(paymentIntent.id);
//     } else {
//       setMessage("Unexpected payment status: " + paymentIntent.status);
//       setIsLoading(false);
//     }
//   };

//   const verifyPaymentWithBackend = async (paymentIntentId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/payment/confirm`, {
//         method: "POST",
//         headers: { 
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify({ orderId, paymentIntentId }),
//       });

//       const data = await res.json();

//       if (res.ok && data.success) {
//         // 4. Success! Redirect to success page
//         navigate("/order-success", { state: { orderId, status: "success" } });
//       } else {
//         setMessage("Payment succeeded but verification failed. Please contact support.");
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage("Network error verifying payment.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form id="payment-form" onSubmit={handleSubmit}>
//       <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      
//       <button disabled={isLoading || !stripe || !elements} id="submit" className="pay-btn">
//         {isLoading ? <div className="spinner"></div> : "Pay Now"}
//       </button>
      
//       {message && <div id="payment-message" className="alert-message">{message}</div>}
//     </form>
//   );
// };

// export default CheckoutForm;


import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ orderId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    setMessage("");

    // Confirm payment with Stripe
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required", 
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Verify with backend
      await verifyPaymentWithBackend(paymentIntent.id);
    } else {
      setMessage("Unexpected payment status: " + paymentIntent.status);
      setIsLoading(false);
    }
  };

  const verifyPaymentWithBackend = async (paymentIntentId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/payment/confirm`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ orderId, paymentIntentId }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Redirect to Orders page or Success page
        navigate("/orders"); 
        alert("Payment Successful!");
      } else {
        setMessage("Payment succeeded but verification failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error verifying payment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={{ layout: "accordion" }} />
      
      <button disabled={isLoading || !stripe || !elements} id="submit" className="pay-btn-stripe">
        {isLoading ? (
          <>
            <div className="spinner"></div>
            Processing Payment...
          </>
        ) : (
          <>
            🔒 Pay Securely Now
          </>
        )}
      </button>
      
      {message && <div className="error-message">❌ {message}</div>}
    </form>
  );
};

export default CheckoutForm;