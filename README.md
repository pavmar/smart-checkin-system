# Smart Check-in System

A modern mobile application for user check-in management with QR code technology.

## Features

- 📱 **React Native Mobile App** with Material UI design
- 🆔 **User Registration** with mobile number validation
- 🔢 **Unique ID Generation** for each user
- 📊 **QR Code Generation** for easy check-ins
- 📷 **QR Code Scanning** functionality
- ⌨️ **Manual Check-in** option
- 👤 **User Profile Management**
- 📈 **Check-in History Tracking**
- 🗄️ **SQLite Database** for data storage
- 🔒 **Secure API** with validation and rate limiting

## Technology Stack

### Frontend (Mobile App)
- **React Native** with Expo
- **React Native Paper** (Material UI)
- **React Navigation** for screen navigation
- **Expo Barcode Scanner** for QR code scanning
- **React Native QRCode SVG** for QR code generation

### Backend (API Server)
- **Express.js** web framework
- **SQLite3** database
- **Joi** for data validation
- **Helmet** for security
- **CORS** for cross-origin requests
- **Rate limiting** for API protection

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)

### Installation

1. **Install dependencies for mobile app:**
   ```bash
   npm install
   ```

2. **Install dependencies for backend:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

3. **Start the backend server:**
   ```bash
   npm run backend
   ```

4. **Start the mobile app:**
   ```bash
   npm start
   ```

5. **Run on device/emulator:**
   - Press `a` for Android
   - Press `i` for iOS
   - Scan QR code with Expo Go app on your phone

## Project Structure

```
smart-checkin-system/
├── src/
│   ├── screens/          # React Native screens
│   ├── services/         # API service functions
│   ├── theme/           # Material UI theme
│   └── utils/           # Utility functions
├── backend/
│   ├── database/        # Database setup and queries
│   ├── routes/          # API route handlers
│   └── server.js        # Express server setup
├── assets/              # App icons and images
├── App.js              # Main app component
└── package.json        # Dependencies and scripts
```

## API Endpoints

### Users
- `POST /api/users/register` - Register a new user
- `GET /api/users/:uniqueId` - Get user by unique ID
- `GET /api/users` - Get all users
- `GET /api/users/search/mobile/:mobile` - Search user by mobile

### Check-ins
- `POST /api/checkin` - Check in a user
- `GET /api/checkin/history/:userId` - Get user's check-in history
- `GET /api/checkin/all` - Get all check-ins (admin)
- `GET /api/checkin/today` - Get today's check-ins
- `GET /api/checkin/stats` - Get check-in statistics

### System
- `GET /api/health` - Health check endpoint
- `GET /` - API documentation

## Usage

### User Registration
1. Open the app and tap "Register New User"
2. Fill in the required information:
   - First Name
   - Last Name
   - Mobile Number (10 digits)
   - Email Address
3. Tap "Register User"
4. View the generated QR code and unique ID

### Check-in Options

#### QR Code Scanning
1. Tap "Scan QR Code" from the home screen
2. Allow camera permissions
3. Point the camera at a QR code
4. User will be automatically checked in

#### Manual Check-in
1. Tap "Manual Check-in" from the home screen
2. Enter the user's unique ID
3. Tap "Search User" to verify
4. Tap "Check In User" to complete

### View User Profile
1. Tap "View Profile" from the home screen
2. Enter the user's unique ID
3. View user details and access QR code

## Database Schema

### Users Table
- `id` - Primary key
- `unique_id` - Unique identifier for each user
- `first_name` - User's first name
- `last_name` - User's last name
- `mobile` - 10-digit mobile number
- `email` - Email address
- `created_at` - Registration timestamp
- `updated_at` - Last update timestamp

### Check-ins Table
- `id` - Primary key
- `user_id` - Foreign key to users table
- `checkin_time` - Check-in timestamp
- `location` - Optional location information
- `notes` - Optional notes

## Security Features

- Input validation using Joi schemas
- Rate limiting to prevent abuse
- Helmet.js for security headers
- CORS configuration for API access
- SQL injection prevention with parameterized queries

## Development

### Running in Development Mode
```bash
# Start both backend and frontend
npm run dev

# Or start separately
npm run backend  # Start backend server
npm start       # Start Expo development server
```

### Testing the API
Use tools like Postman or curl to test the API endpoints:

```bash
# Register a user
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"uniqueId":"SC-20240117-1234","firstName":"John","lastName":"Doe","mobile":"1234567890","email":"john@example.com"}'

# Check in a user
curl -X POST http://localhost:3001/api/checkin \
  -H "Content-Type: application/json" \
  -d '{"userId":"SC-20240117-1234"}'
```

## Troubleshooting

### Common Issues

1. **Camera permissions not working:**
   - Ensure you've granted camera permissions in device settings
   - Restart the Expo app

2. **Backend connection issues:**
   - Check that the backend server is running on port 3001
   - Update the API base URL in `src/services/api.js` if needed

3. **QR code scanning not working:**
   - Ensure good lighting conditions
   - Clean the camera lens
   - Try generating a new QR code

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please create an issue in the repository or contact the development team.
