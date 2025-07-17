import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Card, Title, Paragraph, Appbar } from 'react-native-paper';
import { theme } from '../theme/theme';

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Welcome to Smart Check-in System</Title>
            <Paragraph style={styles.description}>
              A modern check-in solution with QR code technology and unique user identification.
            </Paragraph>
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Register')}
            style={styles.button}
            icon="account-plus"
          >
            Register New User
          </Button>

          <Button
            mode="contained"
            onPress={() => navigation.navigate('Scanner')}
            style={styles.button}
            icon="qrcode-scan"
          >
            Scan QR Code
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.navigate('CheckIn')}
            style={styles.button}
            icon="login"
          >
            Manual Check-in
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Profile')}
            style={styles.button}
            icon="account"
          >
            View Profile
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Admin')}
            style={styles.button}
            icon="view-dashboard"
          >
            Admin Dashboard
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 20,
  },
  card: {
    marginBottom: 30,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.colors.primary,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    marginVertical: 5,
    paddingVertical: 8,
  },
});

export default HomeScreen;
