# FixMyBike - Bike Service Management System

A comprehensive bike service management platform built for Tamil Nadu, India. This application connects customers with bike service providers, offering a seamless booking and management experience.

## 🌟 Features

### For Customers
- **User Registration & Authentication**: Secure signup/login with role-based access
- **Service Booking**: Book various bike services (Wash & Polish, General Service, Engine Service, etc.)
- **Real-time Tracking**: Track service status with live updates
- **Profile Management**: Update personal information and preferences
- **Service History**: View past bookings and service records
- **Location-based Services**: Choose between shop and home service options

### For Shop Owners
- **Dashboard Analytics**: Comprehensive business insights and revenue tracking
- **Booking Management**: Accept, reject, and manage customer bookings
- **Service Status Updates**: Update service progress in real-time
- **Customer Management**: View customer details and service history
- **Revenue Reports**: Detailed financial analytics and reporting

### General Features
- **Responsive Design**: Mobile-first approach with excellent mobile experience
- **Real-time Chatbot**: AI-powered customer support with Tamil language support
- **Notification System**: Email and SMS notifications for booking updates
- **Payment Integration**: Multiple payment options including UPI, cards, and cash
- **Location Services**: Find nearby service centers with map integration

## 🛠️ Technology Stack

### Frontend
- **React.js**: Modern UI framework
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **React Icons**: Icon library
- **React Hot Toast**: Notification system
- **Axios**: HTTP client for API calls

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: Authentication and authorization
- **bcryptjs**: Password hashing
- **Nodemailer**: Email service

### Development Tools
- **Vite**: Build tool and development server
- **ESLint**: Code linting
- **Nodemon**: Development server with auto-restart

## 📱 Mobile Responsiveness

The application is fully optimized for mobile devices with:
- Responsive navigation that adapts to screen size
- Touch-friendly interface elements
- Optimized chat interface for mobile
- Mobile-first design approach
- Proper icon positioning and spacing

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ranjiths-17904/FixMyBikeOrg.git
   cd FixMyBikesDemo/BikeServiceApl/Server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the Server directory:
   ```env
   PORT=5000
   MONGO_URL=mongodb://127.0.0.1:27017/bikeServiceApp
   JWT_SECRET=fixmybike-super-secret-jwt-key-2024-production-ready
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd ../Client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
FixMyBikesDemo/
├── BikeServiceApl/
│   ├── Client/                 # Frontend React application
│   │   ├── src/
│   │   │   ├── components/     # Reusable UI components
│   │   │   ├── context/        # React context providers
│   │   │   ├── pages/          # Page components
│   │   │   │   ├── customer/   # Customer-specific pages
│   │   │   │   └── owner/      # Owner-specific pages
│   │   │   ├── services/       # API service functions
│   │   │   └── assets/         # Static assets
│   │   └── public/             # Public assets
│   └── Server/                 # Backend Node.js application
│       ├── controllers/        # Request handlers
│       ├── models/             # Database models
│       ├── routes/             # API routes
│       ├── middleware/         # Custom middleware
│       └── services/           # Business logic services
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/check-availability` - Check username/email availability

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get specific booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings/analytics` - Get booking analytics (owner only)
- `GET /api/bookings/revenue` - Get revenue analytics (owner only)

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `PATCH /api/notifications/read-all` - Mark all notifications as read
- `GET /api/notifications/unread-count` - Get unread count

## 🎨 UI/UX Features

### Design System
- **Color Scheme**: Green gradient theme representing growth and nature
- **Typography**: Modern, readable fonts with proper hierarchy
- **Icons**: Consistent iconography using React Icons
- **Animations**: Smooth transitions and hover effects
- **Shadows**: Subtle depth with layered shadows

### Mobile Optimization
- **Responsive Navigation**: Collapsible menu for mobile devices
- **Touch Targets**: Properly sized buttons and interactive elements
- **Gesture Support**: Swipe and tap gestures for mobile interaction
- **Viewport Optimization**: Proper meta tags and viewport settings

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Cross-origin resource sharing protection
- **Rate Limiting**: API rate limiting to prevent abuse
- **Data Sanitization**: Protection against XSS and injection attacks

## 🌍 Localization

The application supports Tamil Nadu specific features:
- **Tamil Language Support**: Chatbot responses in Tamil
- **Local Contact Information**: Chennai-based phone numbers and addresses
- **Regional Pricing**: INR currency and local pricing

## 🚨 Error Handling

- **Client-side Validation**: Real-time form validation
- **Server-side Validation**: Comprehensive API validation
- **Error Boundaries**: React error boundaries for graceful error handling
- **User-friendly Messages**: Clear error messages for better UX
- **Logging**: Comprehensive error logging for debugging

## 📱 Mobile Features

### Responsive Design
- **Mobile-first Approach**: Designed primarily for mobile devices
- **Adaptive Layout**: Layouts that adapt to different screen sizes
- **Touch Optimization**: Optimized for touch interactions
- **Performance**: Fast loading times on mobile networks

### Mobile-specific Features
- **Progressive Web App**: PWA capabilities for mobile installation
- **Offline Support**: Basic offline functionality
- **Push Notifications**: Real-time notifications for mobile users

## 🔧 Development Guidelines

### Code Standards
- **ESLint Configuration**: Consistent code formatting
- **Component Structure**: Reusable component architecture
- **State Management**: Context API for global state
- **Error Handling**: Comprehensive error handling patterns

### Performance Optimization
- **Code Splitting**: Lazy loading for better performance
- **Image Optimization**: Compressed images and lazy loading
- **Bundle Optimization**: Minimized bundle sizes
- **Caching**: Strategic caching for better user experience

## 🚀 Deployment

### Production Build
```bash
# Frontend
cd Client
npm run build

# Backend
cd Server
npm start
```

### Environment Variables
```env
NODE_ENV=production
PORT=5000 || 5001
MONGO_URL=mongodb:/...
JWT_SECRET=your-production-jwt-secret
```

Owner is fixed :-
username : OwneroffixMyBike
password : FixMyBike01

Demo username : ranjiths
     password : 1234567


## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📈 Future Enhancements

- **AI-powered Service Recommendations**
- **Advanced Analytics Dashboard**
- **Multi-language Support**
- **Advanced Payment Gateway Integration**
- **Service Provider Marketplace**
- **Mobile App Development**

📽 DEMO VIDEO :- 

https://drive.google.com/file/d/1fesI_FB3U52PlugnLW7hVR50k0aScTRs/view?usp=drivesdk
