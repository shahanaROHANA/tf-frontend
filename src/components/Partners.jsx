import { Link } from 'react-router-dom';
import './Partners.css';

const Partners = () => {
  return (
    <div className="partners-container">
      {/* Hero Section */}
      <section className="partners-hero">
        <div className="partners-hero-bg">
          <div className="partners-hero-gradient"></div>
          <div className="partners-hero-pattern"></div>
        </div>
        
        <div className="container">
          <div className="partners-hero-content">
            <div className="partners-hero-badge">
              <span>🤝 Join Our Network</span>
            </div>
            
            <h1 className="partners-hero-title">
              Partner with
              <span className="partners-highlight"> FoodZTrain</span>
            </h1>
            
            <p className="partners-hero-description">
              Join Sri Lanka's leading train food delivery platform. Reach thousands of travelers and grow your restaurant business with our innovative technology and trusted service.
            </p>
            
            <div className="partners-hero-actions">
              <button className="btn btn-primary btn-large">
                <span>Apply Now</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <button className="btn btn-outline btn-large">
                <span>Learn More</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
            
            <div className="partners-stats">
              <div className="partners-stat">
                <div className="partners-stat-number">500+</div>
                <span className="partners-stat-label">Partner Restaurants</span>
              </div>
              <div className="partners-stat">
                <div className="partners-stat-number">50K+</div>
                <span className="partners-stat-label">Happy Customers</span>
              </div>
              <div className="partners-stat">
                <div className="partners-stat-number">25+</div>
                <span className="partners-stat-label">Major Stations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Partner Section */}
      <section className="partners-benefits">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Partner with FoodZTrain?</h2>
            <p className="section-subtitle">Unlock new opportunities and grow your restaurant business</p>
          </div>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <div className="icon-wrapper">📈</div>
              </div>
              <h3>Increase Revenue</h3>
              <p>Reach thousands of train travelers and boost your sales with our extensive customer base and convenient delivery system.</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <div className="icon-wrapper">🚀</div>
              </div>
              <h3>Easy Integration</h3>
              <p>Seamlessly integrate with our platform using our user-friendly dashboard and comprehensive management tools.</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <div className="icon-wrapper">💳</div>
              </div>
              <h3>Fast Payments</h3>
              <p>Get paid quickly with our efficient payment system and transparent commission structure with competitive rates.</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <div className="icon-wrapper">📊</div>
              </div>
              <h3>Analytics & Insights</h3>
              <p>Make data-driven decisions with comprehensive analytics and real-time reporting on your restaurant's performance.</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <div className="icon-wrapper">🛡️</div>
              </div>
              <h3>24/7 Support</h3>
              <p>Get round-the-clock assistance from our dedicated partner support team to help you succeed.</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <div className="icon-wrapper">🎯</div>
              </div>
              <h3>Targeted Marketing</h3>
              <p>Benefit from our marketing campaigns and promotional activities to increase your restaurant's visibility.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Showcase */}
      <section className="partners-showcase">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Featured Partners</h2>
            <p className="section-subtitle">Successful restaurants already partnered with us</p>
          </div>
          
          <div className="partners-grid">
            <div className="partner-card">
              <div className="partner-image">
                <div className="partner-emoji">🍕</div>
              </div>
              <h4>Pizza Palace</h4>
              <p>Kilinochchi Station</p>
              <div className="partner-rating">
                <span className="stars">⭐⭐⭐⭐⭐</span>
                <span className="rating-text">4.8 (2.3k reviews)</span>
              </div>
              <div className="partner-stats">
                <span>15k+ orders</span>
                <span>Rs. 2.5M revenue</span>
              </div>
            </div>
            
            <div className="partner-card">
              <div className="partner-image">
                <div className="partner-emoji">🥘</div>
              </div>
              <h4>Spice Garden</h4>
              <p>Chavakachcheri Station</p>
              <div className="partner-rating">
                <span className="stars">⭐⭐⭐⭐⭐</span>
                <span className="rating-text">4.9 (1.8k reviews)</span>
              </div>
              <div className="partner-stats">
                <span>12k+ orders</span>
                <span>Rs. 3.1M revenue</span>
              </div>
            </div>
            
            <div className="partner-card">
              <div className="partner-image">
                <div className="partner-emoji">🍔</div>
              </div>
              <h4>Burger Junction</h4>
              <p>Meesalai Station</p>
              <div className="partner-rating">
                <span className="stars">⭐⭐⭐⭐⭐</span>
                <span className="rating-text">4.7 (3.1k reviews)</span>
              </div>
              <div className="partner-stats">
                <span>18k+ orders</span>
                <span>Rs. 1.9M revenue</span>
              </div>
            </div>
            
            <div className="partner-card">
              <div className="partner-image">
                <div className="partner-emoji">🍱</div>
              </div>
              <h4>Ceylon Kitchen</h4>
              <p>Kodikamam Station</p>
              <div className="partner-rating">
                <span className="stars">⭐⭐⭐⭐⭐</span>
                <span className="rating-text">4.8 (2.7k reviews)</span>
              </div>
              <div className="partner-stats">
                <span>14k+ orders</span>
                <span>Rs. 2.8M revenue</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="partners-process">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How to Become a Partner</h2>
            <p className="section-subtitle">Simple steps to start your journey with us</p>
          </div>
          
          <div className="process-steps">
            <div className="process-step">
              <div className="step-icon">
                <div className="step-bg">📝</div>
                <div className="step-number">1</div>
              </div>
              <h3>Apply Online</h3>
              <p>Fill out our simple application form with your restaurant details and required documents.</p>
            </div>
            
            <div className="process-step">
              <div className="step-icon">
                <div className="step-bg">🔍</div>
                <div className="step-number">2</div>
              </div>
              <h3>Verification</h3>
              <p>Our team will review your application and verify your restaurant's credentials and quality standards.</p>
            </div>
            
            <div className="process-step">
              <div className="step-icon">
                <div className="step-bg">⚙️</div>
                <div className="step-number">3</div>
              </div>
              <h3>Setup</h3>
              <p>Complete the onboarding process and set up your menu, pricing, and operational details.</p>
            </div>
            
            <div className="process-step">
              <div className="step-icon">
                <div className="step-bg">🚀</div>
                <div className="step-number">4</div>
              </div>
              <h3>Go Live</h3>
              <p>Start receiving orders and growing your business with our platform and support team.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="partners-commission">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Transparent Commission Structure</h2>
            <p className="section-subtitle">Fair and competitive rates for all our partners</p>
          </div>
          
          <div className="commission-grid">
            <div className="commission-card">
              <h3>Standard Commission</h3>
              <div className="commission-rate">15%</div>
              <p>Per order commission for restaurants with standard menu items</p>
              <ul>
                <li>✓ Fixed commission rate</li>
                <li>✓ No hidden fees</li>
                <li>✓ Weekly payments</li>
                <li>✓ Performance bonuses</li>
              </ul>
            </div>
            
            <div className="commission-card featured">
              <div className="popular-badge">Most Popular</div>
              <h3>Premium Commission</h3>
              <div className="commission-rate">12%</div>
              <p>Reduced commission for high-volume restaurants and premium partners</p>
              <ul>
                <li>✓ Lower commission rate</li>
                <li>✓ Priority support</li>
                <li>✓ Marketing assistance</li>
                <li>✓ Advanced analytics</li>
              </ul>
            </div>
            
            <div className="commission-card">
              <h3>Exclusive Partnership</h3>
              <div className="commission-rate">10%</div>
              <p>Special rates for exclusive partnerships and large restaurant chains</p>
              <ul>
                <li>✓ Lowest commission rate</li>
                <li>✓ Dedicated account manager</li>
                <li>✓ Custom solutions</li>
                <li>✓ Co-marketing opportunities</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="partners-testimonials">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Partners Say</h2>
            <p className="section-subtitle">Real feedback from successful restaurant partners</p>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"FoodZTrain has transformed our business. We've increased our revenue by 40% since joining the platform. The customer service is excellent and the platform is very user-friendly."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👨‍🍳</div>
                <div className="author-info">
                  <h4>Rajesh Kumar</h4>
                  <p>Pizza Palace, Kilinochchi</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The best decision we made for our restaurant. The analytics help us understand customer preferences and the payment system is very reliable. Highly recommend!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👩‍🍳</div>
                <div className="author-info">
                  <h4>Priya Devi</h4>
                  <p>Spice Garden, Chavakachcheri</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Amazing platform with great support. Our burger sales have doubled and the exposure to train travelers has been incredible. The team is always helpful."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👨‍🍳</div>
                <div className="author-info">
                  <h4>Saman Silva</h4>
                  <p>Burger Junction, Meesalai</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="partners-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Partner with Us?</h2>
            <p>Join hundreds of successful restaurants already earning more with FoodZTrain</p>
            <div className="cta-actions">
              <button className="btn btn-primary btn-large">
                Apply Now - It's Free!
              </button>
              <Link to="/contact" className="btn btn-outline btn-large">
                Contact Our Team
              </Link>
            </div>
            <div className="contact-info">
              <p>📞 Call us: +94 21 123 4567</p>
              <p>📧 Email: partners@foodztrain.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners;