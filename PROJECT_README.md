# Smart Check-in System

A comprehensive React Native and Node.js based check-in system with QR code functionality and admin dashboard.

**🚀 Now Updated to Expo SDK 52!**

## Project Structure

```
├── App.js                    # Main React Native app with navigation
├── src/
│   ├── screens/             # All application screens
│   │   ├── HomeScreen.js       # Landing page with navigation options
│   │   ├── RegisterScreen.js   # User registration form
│   │   ├── QRCodeScreen.js     # Display user's QR code
│   │   ├── ScannerScreen.js    # QR code scanner for check-in
│   │   ├── CheckInScreen.js    # Manual check-in with location/notes
│   │   ├── UserProfileScreen.js # View user details and history
│   │   └── AdminDashboard.js   # Admin panel for managing users/check-ins
│   ├── services/
│   │   └── api.js             # API service functions
│   ├── theme/
│   │   └── theme.js           # App theme configuration
│   └── utils/
│       └── idGenerator.js     # Unique ID generation utilities
├── backend/
│   ├── server.js              # Express.js server
│   ├── database/
│   │   └── database.js        # SQLite database operations
│   └── routes/
│       ├── users.js           # User-related API endpoints
│       └── checkin.js         # Check-in related API endpoints
└── assets/                   # Images and static files
```

## Features

### Frontend Features
- **User Registration**: Register new users with validation
- **QR Code Generation**: Unique QR codes for each user
- **QR Code Scanner**: Scan QR codes for quick check-in
- **Manual Check-in**: Alternative check-in method with location/notes
- **User Profile**: View user details and check-in history
- **Admin Dashboard**: Comprehensive admin panel with statistics

### Backend Features
- **RESTful API**: Complete API for user and check-in management
- **SQLite Database**: Lightweight database with proper indexing
- **Security**: Rate limiting, CORS, and input validation
- **Statistics**: Real-time check-in statistics and analytics

## API Endpoints

### User Endpoints
- `POST /api/users/register` - Register a new user
- `GET /api/users/:id` - Get user by ID
- `GET /api/users` - Get all users

### Check-in Endpoints
- `POST /api/checkin` - Create a check-in record
- `GET /api/checkin/history/:userId` - Get user's check-in history
- `GET /api/checkin/all` - Get all check-ins
- `GET /api/checkin/today` - Get today's check-ins
- `GET /api/checkin/stats` - Get check-in statistics

### System Endpoints
- `GET /api/health` - Health check
- `GET /` - API documentation

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (for React Native development)
- Android Studio/Xcode (for mobile development)

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   npm install
   ```

2. Start the backend server:
   ```bash
   npm start
   ```
   Server will run on http://localhost:3001

### Frontend Setup
1. Navigate to project root:
   ```bash
   npm install
   ```

2. Start the Expo development server:
   ```bash
   npm start
   ```

3. Use Expo Go app on your mobile device or run on simulator

### Running Both (Development)
Use the combined script to run both frontend and backend:
```bash
npm run dev
```

## Usage Guide

### For Users
1. **Registration**: Use "Register New User" to create an account
2. **Get QR Code**: After registration, view your unique QR code
3. **Check-in**: Scan QR code or use manual check-in
4. **View Profile**: Check your details and check-in history

### For Administrators
1. **Admin Dashboard**: Access comprehensive user and check-in management
2. **View Statistics**: Monitor system usage and trends
3. **User Management**: View all registered users
4. **Check-in Monitoring**: Track all check-in activities

## Technology Stack

### Frontend
- React Native with Expo SDK 52
- React Navigation for routing
- React Native Paper for UI components
- React Native QR Code SVG for QR generation
- Expo Camera for QR scanning (updated from deprecated BarCodeScanner)
- Axios for API communication

### Backend
- Node.js with Express.js
- SQLite3 for database
- Joi for input validation
- Helmet for security
- Express Rate Limit for API protection
- CORS for cross-origin requests
- Morgan for logging

## Configuration

### API Base URL
Update the `BASE_URL` in `src/services/api.js` if running on a different host:
```javascript
const BASE_URL = 'http://your-server:3001/api';
```

### Database
The SQLite database is automatically created in `backend/database/checkin_system.db`

## Development Notes

### SDK 52 Upgrade Notes
- ✅ Updated from Expo SDK 51 to SDK 52
- ✅ Migrated from deprecated `expo-barcode-scanner` to `expo-camera` with barcode scanning
- ✅ Updated React Native to 0.76.9 and React to 18.3.1
- ✅ All dependencies updated to SDK 52 compatible versions
- ✅ Added missing `expo-status-bar` package for SDK 52 compatibility
- ✅ Camera permissions and scanning functionality verified
- ✅ All Expo doctor checks passing (15/15)

### ID Generation
- Format: `SC-YYYYMMDD-XXXX` (Smart Checkin - Date - Random)
- Example: `SC-20250717-1234`

### Security Features
- Rate limiting (100 requests per 15 minutes per IP)
- Input validation on all endpoints
- CORS protection
- SQL injection prevention

## Future Enhancements

- [ ] Push notifications for check-ins
- [ ] Role-based access control
- [ ] Export functionality for check-in data
- [ ] Integration with calendar systems
- [ ] Bulk user import
- [ ] Advanced reporting and analytics
- [ ] Mobile app deployment to stores

## Troubleshooting

### Common Issues

1. **Backend not starting**: Check if port 3001 is available
2. **Frontend not connecting**: Verify API base URL configuration
3. **QR Scanner not working**: Ensure camera permissions are granted
4. **Database errors**: Check SQLite file permissions

### Development Tips

- Use React Native Debugger for frontend debugging
- Backend logs are displayed in console
- Check network tab in Expo for API request debugging
- Database can be inspected using SQLite browser tools

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For support and questions, please create an issue in the project repository.
