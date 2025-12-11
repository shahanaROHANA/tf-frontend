// import { Link } from 'react-router-dom';
// import './Home.css';

// const Home = () => {
//   return (
//     <div className="home-container">
//       {/* Hero Section */}
//       <section className="hero">
//         <div className="hero-bg">
//           <div className="hero-gradient"></div>
//           <div className="hero-pattern"></div>
//         </div>
        
//         <div className="hero-container">
//           <div className="hero-content">
//             <div className="hero-badge">
//               <span>🍱 Fresh Food On The Go</span>
//             </div>
            
//             <h1 className="hero-title">
//               Delicious Meals
//               <span className="highlight"> Delivered to Your Train</span>
//             </h1>
            
//             <p className="hero-description">
//               Experience premium dining while traveling. Order from top-rated restaurants at major stations and enjoy hot, fresh meals right at your seat.
//             </p>
            
//             <div className="hero-actions">
//               <Link to="/products" className="btn btn-primary btn-large">
//                 <span>Order Now</span>
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M5 12h14M12 5l7 7-7 7"/>
//                 </svg>
//               </Link>
//               <Link to="/vendors" className="btn btn-outline btn-large">
//                 <span>View Partners</span>
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
//                 </svg>
//               </Link>
//             </div>
            
//             <div className="hero-stats">
//               <div className="stat">
                
//                 <span className="stat-label">Partner Restaurants</span>
//               </div>
//               <div className="stat">
                
//                 <span className="stat-label">Happy Customers</span>
//               </div>
//               <div className="stat">
                
//                 <span className="stat-label">Major Stations</span>
//               </div>
//             </div>
//           </div>
          
//           <div className="hero-visual">
//             <div className="floating-cards">
//               <div className="card card-1">
//                 <div className="card-image">🍕</div>
//                 <span>Pizza</span>
//               </div>
//               <div className="card card-2">
//                 <div className="card-image">🍔</div>
//                 <span>Burger</span>
//               </div>
//               <div className="card card-3">
//                 <div className="card-image">🥘</div>
//                 <span>Biryani</span>
//               </div>
//               <div className="card card-4">
//                 <div className="card-image">🍱</div>
//                 <span>Thali</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
   

//       {/* Food Categories Section */}
//       <section className="food-categories">
//         <div className="container">
//           <div className="section-header">
//             <h2 className="section-title">Popular Food Categories</h2>
//             <p className="section-subtitle">Delicious options to satisfy every craving</p>
//           </div>
          
//           <div className="food-grid">
//             <div className="food-category food-pizza">
//               <div className="food-icon">🍕</div>
//               <h3>Pizza</h3>
//               <p>Fresh baked with premium toppings</p>
//               <div className="food-animation">
//                 <div className="floating-ingredients">
//                   <span className="ingredient ingredient-1">🧀</span>
//                   <span className="ingredient ingredient-2">🍅</span>
//                   <span className="ingredient ingredient-3">🌿</span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="food-category food-burger">
//               <div className="food-icon">🍔</div>
//               <h3>Burger</h3>
//               <p>Juicy burgers with crispy fries</p>
//               <div className="food-animation">
//                 <div className="floating-ingredients">
//                   <span className="ingredient ingredient-1">🥬</span>
//                   <span className="ingredient ingredient-2">🍅</span>
//                   <span className="ingredient ingredient-3">🧀</span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="food-category food-biryani">
//               <div className="food-icon">🥘</div>
//               <h3>Biryani</h3>
//               <p>Fragrant rice with tender meat</p>
//               <div className="food-animation">
//                 <div className="floating-ingredients">
//                   <span className="ingredient ingredient-1">🍗</span>
//                   <span className="ingredient ingredient-2">🌶️</span>
//                   <span className="ingredient ingredient-3">🧅</span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="food-category food-thali">
//               <div className="food-icon">🍱</div>
//               <h3>Thali</h3>
//               <p>Complete meal with variety of dishes</p>
//               <div className="food-animation">
//                 <div className="floating-ingredients">
//                   <span className="ingredient ingredient-1">🍛</span>
//                   <span className="ingredient ingredient-2">🥗</span>
//                   <span className="ingredient ingredient-3">🫓</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* How It Works */}
//       <section className="how-it-works">
//         <div className="container">
//           <div className="section-header">
//             <h2 className="section-title">How FoodZTrain Works</h2>
//             <p className="section-subtitle">Ordering food on train is now simpler than ever</p>
//           </div>
          
//           <div className="steps-grid">
//             <div className="step">
//               <div className="step-icon">
//                 <div className="icon-bg">📍</div>
//                 <div className="step-number">1</div>
//               </div>
//               <h3>Enter Your Journey</h3>
//               <p>Share your train number, boarding station, and destination</p>
//             </div>
            
//             <div className="step">
//               <div className="step-icon">
//                 <div className="icon-bg">🍽️</div>
//                 <div className="step-number">2</div>
//               </div>
//               <h3>Browse Menu</h3>
//               <p>Explore restaurants at your boarding station with real-time availability</p>
//             </div>
            
//             <div className="step">
//               <div className="step-icon">
//                 <div className="icon-bg">💳</div>
//                 <div className="step-number">3</div>
//               </div>
//               <h3>Order & Pay</h3>
//               <p>Place your order securely with multiple payment options</p>
//             </div>
            
//             <div className="step">
//               <div className="step-icon">
//                 <div className="icon-bg">🚂</div>
//                 <div className="step-number">4</div>
//               </div>
//               <h3>Enjoy Your Meal</h3>
//               <p>Receive fresh, hot food delivered right to your train seat</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features */}
//       <section className="features">
//         <div className="container">
//           <div className="section-header">
//             <h2 className="section-title">Why Choose FoodZTrain?</h2>
            
//           </div>
          
//           <div className="features-grid">
//             <div className="feature">
//               <div className="feature-icon">
//                 <div className="icon-wrapper">🔄</div>
//               </div>
//               <h3>Live Train Tracking</h3>
              
//             </div>
            
//             <div className="feature">
//               <div className="feature-icon">
//                 <div className="icon-wrapper">⭐</div>
//               </div>
//               <h3>Quality Assured</h3>
              
//             </div>
            
//             <div className="feature">
//               <div className="feature-icon">
//                 <div className="icon-wrapper">🔒</div>
//               </div>
//               <h3>Secure Payments</h3>
              
//             </div>
            
//             <div className="feature">
//               <div className="feature-icon">
//                 <div className="icon-wrapper">📱</div>
//               </div>
//               <h3>Easy Ordering</h3>
              
//             </div>
            
//             <div className="feature">
//               <div className="feature-icon">
//                 <div className="icon-wrapper">🕐</div>
//               </div>
//               <h3>On-Time Delivery</h3>
              
//             </div>
            
            
//           </div>
//         </div>
//       </section>

//       {/* Popular Stations */}
//       <section className="popular-stations">
//         <div className="container">
//           <div className="section-header">
//             <h2 className="section-title">Available Stations</h2>
//             <p className="section-subtitle">We deliver at major railway stations across the country</p>
//           </div>
          
//           <div className="stations-grid">
//             <div className="station">
//               <div className="station-icon">🏢</div>
//               <h4>Kilinochchi</h4>
//               <p>5+ Restaurants</p>
//             </div>
//             <div className="station">
//               <div className="station-icon">🏢</div>
//               <h4>Kodikamam</h4>
//               <p>3+ Restaurants</p>
//             </div>
            
            
//             <div className="station">
//               <div className="station-icon">🏢</div>
//               <h4>Sangaththanai</h4>
//               <p> 1 Restaurant</p>
//             </div>
//             <div className="station">
//               <div className="station-icon">🏢</div>
//               <h4>Meesalai</h4>
//               <p>3 Restaurants</p>
//             </div>
//             <div className="station">
//               <div className="station-icon">🏢</div>
//               <h4>Chavakachcheri</h4>
//               <p>3 Restaurants</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="cta">
//         <div className="container">
//           <div className="cta-content">
//             <h2>Ready to Transform Your Train Journey?</h2>
//             <p>Join thousands of satisfied customers who enjoy delicious meals while traveling</p>
//             <div className="cta-actions">
//               <Link to="/register" className="btn btn-primary btn-large">
//                 Download App
//               </Link>
//               <Link to="/products" className="btn btn-outline btn-large">
//                 Browse Menu
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="footer">
//         <div className="container">
//           <div className="footer-content">
//             <div className="footer-brand">
//               <div className="footer-logo">
//                 <div className="logo-icon">🚆</div>
//                 <span className="logo-text">FoodZTrain</span>
//               </div>
//               <p>Premium train food delivery service bringing restaurant-quality meals to your journey.</p>
//               <div className="social-links">
//                 <a href="#" className="social-link">f</a>
//                 <a href="#" className="social-link">t</a>
//                 <a href="#" className="social-link">i</a>
//                 <a href="#" className="social-link">in</a>
//               </div>
//             </div>
            
//             <div className="footer-section">
//               <h4>Quick Links</h4>
//               <ul>
//                 <li><Link to="/">Home</Link></li>
//                 <li><Link to="/products">Order Food</Link></li>
//                 <li><Link to="/vendors">Partner With Us</Link></li>
//                 <li><Link to="/about">About</Link></li>
//               </ul>
//             </div>
            
//             <div className="footer-section">
//               <h4>Support</h4>
//               <ul>
//                 <li><Link to="/contact">Contact Us</Link></li>
//                 <li><Link to="/help">Help Center</Link></li>
//                 <li><Link to="/faq">FAQs</Link></li>
//                 <li><Link to="/terms">Terms & Conditions</Link></li>
//               </ul>
//             </div>
            
//             <div className="footer-section">
//               <h4>Contact Info</h4>
//               <div className="contact-info">
//                 <p>📞 +91 98765 43210</p>
//                 <p>✉️ support@foodztrain.com</p>
                
//               </div>
//             </div>
//           </div>
          
//           <div className="footer-bottom">
//             <p>&copy; 2024 FoodZTrain. All rights reserved. Made with ❤️ for train travelers.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Home;

// import { useEffect, useRef, useState } from 'react';
// import { Link } from 'react-router-dom';
// import './Home.css';

// const useReveal = (selector = '.reveal', options = { threshold: 0.15 }) => {
//   useEffect(() => {
//     const els = Array.from(document.querySelectorAll(selector));
//     if (!els.length) return;
//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           entry.target.classList.add('in-view');
//         }
//       });
//     }, options);

//     els.forEach((el) => observer.observe(el));
//     return () => observer.disconnect();
//   }, [selector, options.threshold]);
// };

// const animateCount = (el, to, duration = 1200) => {
//   if (!el) return;
//   const start = 0;
//   const startTime = performance.now();
//   const step = (now) => {
//     const progress = Math.min((now - startTime) / duration, 1);
//     const current = Math.floor(progress * (to - start) + start);
//     el.textContent = current.toLocaleString();
//     if (progress < 1) requestAnimationFrame(step);
//   };
//   requestAnimationFrame(step);
// };

// const Home = () => {
//   // Stats target values
//   const stats = {
//     partners: 128,
//     customers: 25480,
//     stations: 42,
//   };

//   const partnersRef = useRef(null);
//   const customersRef = useRef(null);
//   const stationsRef = useRef(null);
//   const statsContainerRef = useRef(null);
//   const [statsAnimated, setStatsAnimated] = useState(false);

//   // Reveal hook for sections
//   useReveal('.reveal');

//   // Animate stats when visible
//   useEffect(() => {
//     const node = statsContainerRef.current;
//     if (!node) return;
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting && !statsAnimated) {
//             setStatsAnimated(true);
//             animateCount(partnersRef.current, stats.partners, 1000);
//             animateCount(customersRef.current, stats.customers, 1200);
//             animateCount(stationsRef.current, stats.stations, 1000);
//           }
//         });
//       },
//       { threshold: 0.4 }
//     );
//     observer.observe(node);
//     return () => observer.disconnect();
//   }, [statsAnimated]);

//   return (
//     <div className="home-container">
//       {/* Hero Section */}
//       <section className="hero">
//         <div className="hero-bg" aria-hidden>
//           <div className="hero-gradient"></div>
//           <div className="hero-pattern"></div>
//         </div>

//         <div className="hero-container">
//           <div className="hero-content">
//             <div className="hero-badge reveal">
//               <span>🍱 Fresh Food On The Go</span>
//             </div>

//             <h1 className="hero-title reveal">
//               Delicious Meals
//               <span className="highlight"> Delivered to Your Train</span>
//             </h1>

//             <p className="hero-description reveal">
//               Experience premium dining while traveling. Order from top-rated restaurants at major stations and enjoy hot, fresh meals right at your seat.
//             </p>

//             <div className="hero-actions reveal">
//               <Link to="/products" className="btn btn-primary btn-large">
//                 <span>Order Now</span>
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M5 12h14M12 5l7 7-7 7" />
//                 </svg>
//               </Link>
//               <Link to="/vendors" className="btn btn-outline btn-large">
//                 <span>View Partners</span>
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
//                 </svg>
//               </Link>
//             </div>

//             <div className="hero-stats reveal" ref={statsContainerRef}>
//               <div className="stat">
//                 <span className="stat-number" ref={partnersRef}>0</span>
//                 <span className="stat-label">Partner Restaurants</span>
//               </div>
//               <div className="stat">
//                 <span className="stat-number" ref={customersRef}>0</span>
//                 <span className="stat-label">Happy Customers</span>
//               </div>
//               <div className="stat">
//                 <span className="stat-number" ref={stationsRef}>0</span>
//                 <span className="stat-label">Major Stations</span>
//               </div>
//             </div>
//           </div>

//           <div className="hero-visual">
//             <div className="floating-cards">
//               <div className="card card-1 reveal" style={{ animationDelay: '0.1s' }}>
//                 <div className="card-image">🍕</div>
//                 <span>Pizza</span>
//               </div>
//               <div className="card card-2 reveal" style={{ animationDelay: '0.3s' }}>
//                 <div className="card-image">🍔</div>
//                 <span>Burger</span>
//               </div>
//               <div className="card card-3 reveal" style={{ animationDelay: '0.5s' }}>
//                 <div className="card-image">🥘</div>
//                 <span>Biryani</span>
//               </div>
//               <div className="card card-4 reveal" style={{ animationDelay: '0.7s' }}>
//                 <div className="card-image">🍱</div>
//                 <span>Thali</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* How It Works */}
//       <section className="how-it-works reveal">
//         <div className="container">
//           <div className="section-header">
//             <h2 className="section-title">How FoodZTrain Works</h2>
//             <p className="section-subtitle">Ordering food on train is now simpler than ever</p>
//           </div>

//           <div className="steps-grid">
//             <div className="step reveal">
//               <div className="step-icon">
//                 <div className="icon-bg">📍</div>
//                 <div className="step-number">1</div>
//               </div>
//               <h3>Enter Your Journey</h3>
//               <p>Share your train number, boarding station, and destination</p>
//             </div>

//             <div className="step reveal">
//               <div className="step-icon">
//                 <div className="icon-bg">🍽️</div>
//                 <div className="step-number">2</div>
//               </div>
//               <h3>Browse Menu</h3>
//               <p>Explore restaurants at your boarding station with real-time availability</p>
//             </div>

//             <div className="step reveal">
//               <div className="step-icon">
//                 <div className="icon-bg">💳</div>
//                 <div className="step-number">3</div>
//               </div>
//               <h3>Order & Pay</h3>
//               <p>Place your order securely with multiple payment options</p>
//             </div>

//             <div className="step reveal">
//               <div className="step-icon">
//                 <div className="icon-bg">🚂</div>
//                 <div className="step-number">4</div>
//               </div>
//               <h3>Enjoy Your Meal</h3>
//               <p>Receive fresh, hot food delivered right to your train seat</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features */}
//       <section className="features reveal">
//         <div className="container">
//           <div className="section-header">
//             <h2 className="section-title">Why Choose FoodZTrain?</h2>
//           </div>

//           <div className="features-grid">
//             <div className="feature reveal">
//               <div className="feature-icon">
//                 <div className="icon-wrapper">🔄</div>
//               </div>
//               <div>
//                 <h3>Live Train Tracking</h3>
//                 <p>Know exactly when your meal will be delivered onboard.</p>
//               </div>
//             </div>

//             <div className="feature reveal">
//               <div className="feature-icon">
//                 <div className="icon-wrapper">⭐</div>
//               </div>
//               <div>
//                 <h3>Quality Assured</h3>
//                 <p>Only top-rated restaurants partner with FoodZTrain.</p>
//               </div>
//             </div>

//             <div className="feature reveal">
//               <div className="feature-icon">
//                 <div className="icon-wrapper">🔒</div>
//               </div>
//               <div>
//                 <h3>Secure Payments</h3>
//                 <p>Multiple safe payment options with encryption.</p>
//               </div>
//             </div>

//             <div className="feature reveal">
//               <div className="feature-icon">
//                 <div className="icon-wrapper">📱</div>
//               </div>
//               <div>
//                 <h3>Easy Ordering</h3>
//                 <p>Fast checkout and saved preferences for repeat orders.</p>
//               </div>
//             </div>

//             <div className="feature reveal">
//               <div className="feature-icon">
//                 <div className="icon-wrapper">🕐</div>
//               </div>
//               <div>
//                 <h3>On-Time Delivery</h3>
//                 <p>We sync with station schedules to deliver on time.</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Popular Stations */}
//       <section className="popular-stations reveal">
//         <div className="container">
//           <div className="section-header">
//             <h2 className="section-title">Available Stations</h2>
//             <p className="section-subtitle">We deliver at major railway stations across the country</p>
//           </div>

//           <div className="stations-grid">
//             <div className="station reveal">
//               <div className="station-icon">🏢</div>
//               <h4>Kilinochchi</h4>
//               <p>5+ Restaurants</p>
//             </div>
//             <div className="station reveal">
//               <div className="station-icon">🏢</div>
//               <h4>Kodikamam</h4>
//               <p>3+ Restaurants</p>
//             </div>
//             <div className="station reveal">
//               <div className="station-icon">🏢</div>
//               <h4>Sangaththanai</h4>
//               <p>1 Restaurant</p>
//             </div>
//             <div className="station reveal">
//               <div className="station-icon">🏢</div>
//               <h4>Meesalai</h4>
//               <p>3 Restaurants</p>
//             </div>
//             <div className="station reveal">
//               <div className="station-icon">🏢</div>
//               <h4>Chavakachcheri</h4>
//               <p>3 Restaurants</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="cta reveal">
//         <div className="container">
//           <div className="cta-content">
//             <h2>Ready to Transform Your Train Journey?</h2>
//             <p>Join thousands of satisfied customers who enjoy delicious meals while traveling</p>
//             <div className="cta-actions">
//               <Link to="/register" className="btn btn-primary btn-large">Download App</Link>
//               <Link to="/products" className="btn btn-outline btn-large">Browse Menu</Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer (static) */}
//       <footer className="footer">
//         <div className="container">
//           <div className="footer-content">
//             <div className="footer-brand">
//               <div className="footer-logo">
//                 <div className="logo-icon">🚆</div>
//                 <span className="logo-text">FoodZTrain</span>
//               </div>
//               <p>Premium train food delivery service bringing restaurant-quality meals to your journey.</p>
//               <div className="social-links">
//                 <a href="#" className="social-link">f</a>
//                 <a href="#" className="social-link">t</a>
//                 <a href="#" className="social-link">i</a>
//                 <a href="#" className="social-link">in</a>
//               </div>
//             </div>

//             <div className="footer-section">
//               <h4>Quick Links</h4>
//               <ul>
//                 <li><Link to="/">Home</Link></li>
//                 <li><Link to="/products">Order Food</Link></li>
//                 <li><Link to="/vendors">Partner With Us</Link></li>
//                 <li><Link to="/about">About</Link></li>
//               </ul>
//             </div>

//             <div className="footer-section">
//               <h4>Support</h4>
//               <ul>
//                 <li><Link to="/contact">Contact Us</Link></li>
//                 <li><Link to="/help">Help Center</Link></li>
//                 <li><Link to="/faq">FAQs</Link></li>
//                 <li><Link to="/terms">Terms & Conditions</Link></li>
//               </ul>
//             </div>

//             <div className="footer-section">
//               <h4>Contact Info</h4>
//               <div className="contact-info">
//                 <p>📞 +91 98765 43210</p>
//                 <p>✉️ support@foodztrain.com</p>
//               </div>
//             </div>
//           </div>

//           <div className="footer-bottom">
//             <p>&copy; 2024 FoodZTrain. All rights reserved. Made with ❤️ for train travelers.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Home;

import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
        </div>

        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span>🍱 Fresh Food On The Go</span>
            </div>

            <h1 className="hero-title">
              Delicious Meals
              <span className="highlight"> Delivered to Your Train</span>
            </h1>

            <p className="hero-description">
              Experience premium dining while traveling. Order from top-rated restaurants at major stations and enjoy hot, fresh meals right at your seat.
            </p>

            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-large">
                <span>Order Now</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>

              <Link to="/vendors" className="btn btn-outline btn-large">
                <span>View Partners</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                </svg>
              </Link>
            </div>

            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">128</span>
                <span className="stat-label">Partner Restaurants</span>
              </div>
              <div className="stat">
                <span className="stat-number">25,480</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat">
                <span className="stat-number">42</span>
                <span className="stat-label">Major Stations</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="floating-cards">
              <div className="card card-1">
                <div className="card-image">🍕</div>
                <span>Pizza</span>
              </div>
              <div className="card card-2">
                <div className="card-image">🍔</div>
                <span>Burger</span>
              </div>
              <div className="card card-3">
                <div className="card-image">🥘</div>
                <span>Biryani</span>
              </div>
              <div className="card card-4">
                <div className="card-image">🍱</div>
                <span>Thali</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How FoodZTrain Works</h2>
            <p className="section-subtitle">Ordering food on train is now simpler than ever</p>
          </div>

          <div className="steps-grid">
            <div className="step">
              <div className="step-icon">
                <div className="icon-bg">📍</div>
                <div className="step-number">1</div>
              </div>
              <h3>Enter Your Journey</h3>
              <p>Share your train number, boarding station, and destination</p>
            </div>

            <div className="step">
              <div className="step-icon">
                <div className="icon-bg">🍽️</div>
                <div className="step-number">2</div>
              </div>
              <h3>Browse Menu</h3>
              <p>Explore restaurants at your boarding station with real-time availability</p>
            </div>

            <div className="step">
              <div className="step-icon">
                <div className="icon-bg">💳</div>
                <div className="step-number">3</div>
              </div>
              <h3>Order & Pay</h3>
              <p>Place your order securely with multiple payment options</p>
            </div>

            <div className="step">
              <div className="step-icon">
                <div className="icon-bg">🚂</div>
                <div className="step-number">4</div>
              </div>
              <h3>Enjoy Your Meal</h3>
              <p>Receive fresh, hot food delivered right to your train seat</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose FoodZTrain?</h2>
          </div>

          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">
                <div className="icon-wrapper">🔄</div>
              </div>
              <div>
                <h3>Live Train Tracking</h3>
                <p>Know exactly when your meal will be delivered onboard.</p>
              </div>
            </div>

            <div className="feature">
              <div className="feature-icon">
                <div className="icon-wrapper">⭐</div>
              </div>
              <div>
                <h3>Quality Assured</h3>
                <p>Only top-rated restaurants partner with FoodZTrain.</p>
              </div>
            </div>

            <div className="feature">
              <div className="feature-icon">
                <div className="icon-wrapper">🔒</div>
              </div>
              <div>
                <h3>Secure Payments</h3>
                <p>Multiple safe payment options with encryption.</p>
              </div>
            </div>

            <div className="feature">
              <div className="feature-icon">
                <div className="icon-wrapper">📱</div>
              </div>
              <div>
                <h3>Easy Ordering</h3>
                <p>Fast checkout and saved preferences for repeat orders.</p>
              </div>
            </div>

            <div className="feature">
              <div className="feature-icon">
                <div className="icon-wrapper">🕐</div>
              </div>
              <div>
                <h3>On-Time Delivery</h3>
                <p>We sync with station schedules to deliver on time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Stations */}
      <section className="popular-stations">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Available Stations</h2>
            <p className="section-subtitle">We deliver at major railway stations across the country</p>
          </div>

          <div className="stations-grid">
            <div className="station">
              <div className="station-icon">🏢</div>
              <h4>Kilinochchi</h4>
              <p>5+ Restaurants</p>
            </div>

            <div className="station">
              <div className="station-icon">🏢</div>
              <h4>Kodikamam</h4>
              <p>3+ Restaurants</p>
            </div>

            <div className="station">
              <div className="station-icon">🏢</div>
              <h4>Sangaththanai</h4>
              <p>1 Restaurant</p>
            </div>

            <div className="station">
              <div className="station-icon">🏢</div>
              <h4>Meesalai</h4>
              <p>3 Restaurants</p>
            </div>

            <div className="station">
              <div className="station-icon">🏢</div>
              <h4>Chavakachcheri</h4>
              <p>3 Restaurants</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Train Journey?</h2>
            <p>Join thousands of satisfied customers who enjoy delicious meals while traveling</p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-large">
                Download App
              </Link>
              <Link to="/products" className="btn btn-outline btn-large">
                Browse Menu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="logo-icon">🚆</div>
                <span className="logo-text">FoodZTrain</span>
              </div>

              <p>Premium train food delivery service bringing restaurant-quality meals to your journey.</p>

              <div className="social-links">
                <a href="#" className="social-link">f</a>
                <a href="#" className="social-link">t</a>
                <a href="#" className="social-link">i</a>
                <a href="#" className="social-link">in</a>
              </div>
            </div>

            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/products">Order Food</Link></li>
                <li><Link to="/vendors">Partner With Us</Link></li>
                <li><Link to="/about">About</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/help">Help Center</Link></li>
                <li><Link to="/faq">FAQs</Link></li>
                <li><Link to="/terms">Terms & Conditions</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Contact Info</h4>
              <div className="contact-info">
                <p>📞 +91 98765 43210</p>
                <p>✉️ support@foodztrain.com</p>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2024 FoodZTrain. All rights reserved. Made with ❤️ for train travelers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
