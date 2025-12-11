# TrainFood Frontend

A modern React-based frontend for the TrainFood application - a food delivery service for train passengers in India.

## 🚂 Features

- **User Authentication**: Login and registration with role-based access
- **Product Browse**: Browse food items by station with search and filtering
- **Shopping Cart**: Add items to cart, update quantities, and manage orders
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful gradient-based design with smooth animations

## 🛠️ Tech Stack

- **React 19**: Modern React with hooks
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Vite**: Fast development server and build tool
- **CSS3**: Modern CSS with gradients, animations, and flexbox/grid

## 📁 Project Structure

```
src/
├── components/
│   ├── Home.jsx              # Landing page with hero section
│   ├── Login.jsx             # User login form
│   ├── Register.jsx          # User registration form
│   ├── ProductList.jsx       # Product browsing with filters
│   ├── Cart.jsx             # Shopping cart management
│   └── Navigation.jsx       # Main navigation bar
├── App.jsx                 # Main app component with routing
├── App.css                 # Global styles and utilities
└── main.jsx                # App entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed
- Backend server running on `http://localhost:5000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## 📱 Available Pages

- **/**: Home page with introduction and features
- **/login**: User login
- **/register**: User registration
- **/products**: Browse food items by station
- **/cart**: Shopping cart management

## 🔐 Authentication

The app supports multiple user roles:
- **Customer**: Can browse products and place orders
- **Seller**: Can manage products (backend only)
- **Delivery**: Can manage deliveries (backend only)
- **Admin**: Full system access (backend only)

## 🛒 Cart Features

- Add items to cart with quantity selection
- Update item quantities in cart
- Remove items from cart
- Clear entire cart
- View subtotal with delivery fees
- Checkout integration (ready for payment gateway)

## 🎨 Design Features

- **Gradient Theme**: Purple to blue gradient throughout
- **Responsive Grid**: Product grid adapts to screen size
- **Hover Effects**: Smooth transitions and micro-interactions
- **Loading States**: User-friendly loading indicators
- **Error Handling**: Clear error messages and validation
- **Mobile First**: Optimized for mobile devices

## 🔗 API Integration

The frontend connects to the backend APIs:

- **Authentication**: `/api/auth/login`, `/api/auth/register`
- **Products**: `/api/products`
- **Cart**: `/api/cart/*`

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🚀 Future Enhancements

- Payment gateway integration
- Order tracking
- Real-time notifications
- Admin dashboard
- Seller portal
- Delivery tracking
- Rating system
- Wishlist functionality
- Multi-language support

---

Built with ❤️ for train passengers across India
