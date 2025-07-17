<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Smart Check-in System - Development Guidelines

This is a React Native mobile application with Express.js backend for a smart check-in system.

## Project Structure
- `/src/screens/` - React Native screens
- `/src/services/` - API service functions
- `/src/theme/` - Material UI theme configuration
- `/src/utils/` - Utility functions
- `/backend/` - Express.js API server
- `/backend/database/` - SQLite database setup and queries
- `/backend/routes/` - API route handlers

## Technology Stack
- **Frontend**: React Native with Expo
- **UI Library**: React Native Paper (Material UI)
- **Navigation**: React Navigation
- **QR Code**: expo-barcode-scanner, react-native-qrcode-svg
- **Backend**: Express.js with SQLite
- **Database**: SQLite3 with manual queries

## Development Guidelines
1. Use Material UI design principles throughout the app
2. Follow camelCase for JavaScript variables and snake_case for database columns
3. Implement proper error handling in all API calls
4. Use consistent validation schemas with Joi
5. Include proper TypeScript-like JSDoc comments for functions
6. Ensure mobile-first responsive design
7. Implement proper loading states and user feedback
8. Use proper HTTP status codes in API responses

## Key Features
- User registration with mobile number validation
- Unique ID generation for each user
- QR code generation and scanning
- Manual check-in option
- User profile management
- Check-in history tracking

## API Endpoints
- `POST /api/users/register` - Register new user
- `GET /api/users/:uniqueId` - Get user by ID
- `POST /api/checkin` - Check in user
- `GET /api/checkin/history/:userId` - Get check-in history

When working on this project, prioritize user experience, data validation, and proper error handling.
