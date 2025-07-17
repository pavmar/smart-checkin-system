import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { Button, Text, Card } from 'react-native-paper';
import { theme } from '../theme/theme';
import { checkInUser } from '../services/api';

const ScannerScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    
    try {
      const response = await checkInUser(data, '', ''); // No location/notes from scanner
      
      Alert.alert(
        'Check-in Successful!',
        `User ${data} has been checked in successfully.`,
        [
          {
            text: 'Scan Another',
            onPress: () => setScanned(false),
          },
          {
            text: 'Back to Home',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Check-in Failed',
        'User not found or check-in failed. Please try again.',
        [
          {
            text: 'Scan Again',
            onPress: () => setScanned(false),
          },
          {
            text: 'Manual Check-in',
            onPress: () => navigation.navigate('CheckIn', { userId: data }),
          },
        ]
      );
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.text}>Requesting camera permission...</Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.text}>
              Camera permission is required to scan QR codes.
            </Text>
            <Button
              mode="contained"
              onPress={() => {
                const getCameraPermissions = async () => {
                  const { status } = await Camera.requestCameraPermissionsAsync();
                  setHasPermission(status === 'granted');
                };
                getCameraPermissions();
              }}
              style={styles.button}
            >
              Grant Permission
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
      />
      
      <View style={styles.overlay}>
        <View style={styles.scanArea} />
        <Text style={styles.instructionText}>
          Point your camera at a QR code to scan
        </Text>
        
        {scanned && (
          <Button
            mode="contained"
            onPress={() => setScanned(false)}
            style={styles.scanButton}
          >
            Tap to Scan Again
          </Button>
        )}
        
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          Back
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  card: {
    margin: 20,
    elevation: 4,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 8,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
  },
  scanButton: {
    marginTop: 20,
    paddingVertical: 8,
  },
  backButton: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});

export default ScannerScreen;
