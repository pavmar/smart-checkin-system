import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Card, Title, HelperText, DataTable } from 'react-native-paper';
import { theme } from '../theme/theme';
import { checkInUser, getUserById } from '../services/api';

const CheckInScreen = ({ route, navigation }) => {
  const [userId, setUserId] = useState(route.params?.userId || '');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  const searchUser = async () => {
    if (!userId.trim()) {
      setError('Please enter a user ID');
      return;
    }

    setSearchLoading(true);
    setError('');
    
    try {
      const response = await getUserById(userId);
      setUserData(response.data);
    } catch (error) {
      setError('User not found');
      setUserData(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!userData) {
      setError('Please search for a user first');
      return;
    }

    setLoading(true);
    try {
      // Include location and notes in the check-in request
      await checkInUser(userId, location.trim(), notes.trim());
      
      Alert.alert(
        'Check-in Successful!',
        `${userData.firstName} ${userData.lastName} has been checked in successfully.`,
        [
          {
            text: 'Check-in Another',
            onPress: () => {
              setUserId('');
              setUserData(null);
              setLocation('');
              setNotes('');
            },
          },
          {
            text: 'Back to Home',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Check-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Manual Check-in</Title>
            
            <TextInput
              label="Enter User ID"
              value={userId}
              onChangeText={(value) => {
                setUserId(value);
                setError('');
                setUserData(null);
              }}
              style={styles.input}
              error={!!error}
              mode="outlined"
              placeholder="Enter unique user ID"
            />
            <HelperText type="error" visible={!!error}>
              {error}
            </HelperText>

            <Button
              mode="contained"
              onPress={searchUser}
              style={styles.button}
              loading={searchLoading}
              disabled={searchLoading || !userId.trim()}
              icon="magnify"
            >
              Search User
            </Button>

            {userData && (
              <Card style={styles.userCard}>
                <Card.Content>
                  <Title style={styles.userTitle}>User Found</Title>
                  
                  <DataTable>
                    <DataTable.Row>
                      <DataTable.Cell>Name:</DataTable.Cell>
                      <DataTable.Cell>{userData.firstName} {userData.lastName}</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                      <DataTable.Cell>Mobile:</DataTable.Cell>
                      <DataTable.Cell>{userData.mobile}</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                      <DataTable.Cell>Email:</DataTable.Cell>
                      <DataTable.Cell>{userData.email}</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                      <DataTable.Cell>User ID:</DataTable.Cell>
                      <DataTable.Cell>{userData.uniqueId}</DataTable.Cell>
                    </DataTable.Row>
                  </DataTable>

                  <TextInput
                    label="Location (Optional)"
                    value={location}
                    onChangeText={setLocation}
                    style={styles.input}
                    mode="outlined"
                    placeholder="Enter check-in location"
                  />

                  <TextInput
                    label="Notes (Optional)"
                    value={notes}
                    onChangeText={setNotes}
                    style={styles.input}
                    mode="outlined"
                    placeholder="Enter additional notes"
                    multiline
                    numberOfLines={3}
                  />

                  <Button
                    mode="contained"
                    onPress={handleCheckIn}
                    style={styles.checkinButton}
                    loading={loading}
                    disabled={loading}
                    icon="login"
                  >
                    Check In User
                  </Button>
                </Card.Content>
              </Card>
            )}
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
  input: {
    marginBottom: 5,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
  userCard: {
    marginTop: 20,
    backgroundColor: theme.colors.surface,
    elevation: 2,
  },
  userTitle: {
    fontSize: 18,
    color: theme.colors.primary,
    marginBottom: 15,
  },
  checkinButton: {
    marginTop: 20,
    paddingVertical: 8,
    backgroundColor: theme.colors.tertiary,
  },
});

export default CheckInScreen;
