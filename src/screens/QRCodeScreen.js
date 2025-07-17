import React from 'react';
import { View, StyleSheet, ScrollView, Share } from 'react-native';
import { Card, Title, Paragraph, Button, Divider } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { theme } from '../theme/theme';

const QRCodeScreen = ({ route, navigation }) => {
  const { userId, userData } = route.params;

  const shareQRCode = async () => {
    try {
      await Share.share({
        message: `My Smart Check-in ID: ${userId}`,
        title: 'Smart Check-in System',
      });
    } catch (error) {
      console.error('Error sharing QR code:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Your QR Code</Title>
            
            <View style={styles.qrContainer}>
              <QRCode
                value={userId}
                size={200}
                color="black"
                backgroundColor="white"
              />
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoContainer}>
              <Paragraph style={styles.label}>Unique ID:</Paragraph>
              <Paragraph style={styles.value}>{userId}</Paragraph>
              
              <Paragraph style={styles.label}>Name:</Paragraph>
              <Paragraph style={styles.value}>
                {userData?.firstName} {userData?.lastName}
              </Paragraph>
              
              <Paragraph style={styles.label}>Mobile:</Paragraph>
              <Paragraph style={styles.value}>{userData?.mobile}</Paragraph>
            </View>

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={shareQRCode}
                style={styles.button}
                icon="share"
              >
                Share QR Code
              </Button>

              <Button
                mode="outlined"
                onPress={() => navigation.navigate('Home')}
                style={styles.button}
                icon="home"
              >
                Back to Home
              </Button>
            </View>
          </Card.Content>
        </Card>
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
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.colors.primary,
    marginBottom: 20,
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  divider: {
    marginVertical: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    paddingVertical: 8,
  },
});

export default QRCodeScreen;
