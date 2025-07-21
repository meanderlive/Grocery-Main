# 🛒 Grocery MERN App

A full-stack grocery e-commerce application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring user authentication, product management, shopping cart functionality, and order processing.

## ✨ Features

### 🛍️ User Features
- **User Authentication**: Secure login/register with JWT tokens
- **Product Browsing**: Browse products by categories with search functionality
- **Shopping Cart**: Add/remove items with quantity management
- **Order Management**: Place orders and track order history
- **Address Management**: Save and manage delivery addresses
- **Responsive Design**: Mobile-friendly interface

### 🏪 Seller Features
- **Seller Dashboard**: Manage products and view orders
- **Product Management**: Add, edit, and delete products
- **Order Tracking**: View and manage incoming orders
- **Image Upload**: Cloudinary integration for product images

### 🔧 Technical Features
- **Real-time Updates**: Live cart and order updates
- **Payment Integration**: Stripe payment processing
- **Image Storage**: Cloudinary cloud storage
- **Security**: JWT authentication with bcrypt password hashing
- **File Upload**: Multer middleware for image handling

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Tailwind CSS** - Styling framework

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Image storage
- **Stripe** - Payment processing
- **CORS** - Cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd grocery-mern-app-main
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**

   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

5. **Start the Development Servers**

   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend (Terminal 2):**
   ```bash
   cd client
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
grocery-mern-app-main/
├── backend/
│   ├── config/          # Database and cloudinary config
│   ├── controller/      # Route controllers
│   ├── middlewares/     # Authentication middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── uploads/         # Temporary file storage
│   └── index.js         # Server entry point
├── client/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   ├── modals/      # Modal components
│   │   └── assets/      # Static assets
│   └── package.json
```

## 🔌 API Endpoints

### User Routes
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Product Routes
- `GET /api/product` - Get all products
- `GET /api/product/:id` - Get single product
- `POST /api/product` - Add new product (seller only)
- `PUT /api/product/:id` - Update product (seller only)
- `DELETE /api/product/:id` - Delete product (seller only)

### Cart Routes
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/:id` - Remove item from cart

### Order Routes
- `POST /api/order/create` - Create new order
- `GET /api/order/user` - Get user orders
- `GET /api/order/seller` - Get seller orders

## 🎯 Usage

### For Users
1. Register/Login to your account
2. Browse products by category
3. Add items to your cart
4. Manage your delivery addresses
5. Place orders and track them

### For Sellers
1. Register as a seller
2. Add products with images and descriptions
3. Manage inventory
4. View and process incoming orders

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes with middleware
- CORS configuration
- Input validation and sanitization

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Created with ❤️ using the MERN stack.

---

**Happy Shopping! 🛒**
