import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import QRCodeScreen from './src/screens/QRCodeScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import CheckInScreen from './src/screens/CheckInScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import AdminDashboard from './src/screens/AdminDashboard';

// Import theme
import { theme } from './src/theme/theme';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.primary,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Smart Check-in System' }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ title: 'User Registration' }}
          />
          <Stack.Screen 
            name="QRCode" 
            component={QRCodeScreen} 
            options={{ title: 'Your QR Code' }}
          />
          <Stack.Screen 
            name="Scanner" 
            component={ScannerScreen} 
            options={{ title: 'Scan QR Code' }}
          />
          <Stack.Screen 
            name="CheckIn" 
            component={CheckInScreen} 
            options={{ title: 'Check In' }}
          />
          <Stack.Screen 
            name="Profile" 
            component={UserProfileScreen} 
            options={{ title: 'User Profile' }}
          />
          <Stack.Screen 
            name="Admin" 
            component={AdminDashboard} 
            options={{ title: 'Admin Dashboard' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
