import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Card, Title, HelperText, Divider, DataTable } from 'react-native-paper';
import { theme } from '../theme/theme';
import { getUserById, getCheckInHistory } from '../services/api';

const UserProfileScreen = ({ route, navigation }) => {
  const [userId, setUserId] = useState(route.params?.prefilledUserId || '');
  const [userData, setUserData] = useState(null);
  const [checkinHistory, setCheckinHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-search if prefilled user ID is provided
  useEffect(() => {
    if (route.params?.prefilledUserId) {
      searchProfile();
    }
  }, []);

  const searchProfile = async () => {
    if (!userId.trim()) {
      setError('Please enter a user ID');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await getUserById(userId);
      setUserData(response.data);
      
      // Automatically load check-in history
      await loadCheckinHistory(userId);
    } catch (error) {
      setError('User not found');
      setUserData(null);
      setCheckinHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCheckinHistory = async (userIdToSearch = null) => {
    const targetUserId = userIdToSearch || userId;
    setHistoryLoading(true);
    
    try {
      const response = await getCheckInHistory(targetUserId);
      setCheckinHistory(response.data || []);
    } catch (error) {
      console.error('Failed to load check-in history:', error);
      setCheckinHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const viewQRCode = () => {
    navigation.navigate('QRCode', { 
      userId: userData.uniqueId, 
      userData 
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>View User Profile</Title>
            
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
              onPress={searchProfile}
              style={styles.button}
              loading={loading}
              disabled={loading || !userId.trim()}
              icon="magnify"
            >
              Search Profile
            </Button>

            {userData && (
              <>
                <Divider style={styles.divider} />
                
                <Card style={styles.profileCard}>
                  <Card.Content>
                    <Title style={styles.profileTitle}>User Profile</Title>
                    
                    <View style={styles.profileInfo}>
                      <View style={styles.infoRow}>
                        <Title style={styles.label}>Name:</Title>
                        <Title style={styles.value}>
                          {userData.firstName} {userData.lastName}
                        </Title>
                      </View>

                      <View style={styles.infoRow}>
                        <Title style={styles.label}>Mobile:</Title>
                        <Title style={styles.value}>{userData.mobile}</Title>
                      </View>

                      <View style={styles.infoRow}>
                        <Title style={styles.label}>Email:</Title>
                        <Title style={styles.value}>{userData.email}</Title>
                      </View>

                      <View style={styles.infoRow}>
                        <Title style={styles.label}>Unique ID:</Title>
                        <Title style={styles.value}>{userData.uniqueId}</Title>
                      </View>

                      <View style={styles.infoRow}>
                        <Title style={styles.label}>Registered:</Title>
                        <Title style={styles.value}>
                          {new Date(userData.createdAt).toLocaleDateString()}
                        </Title>
                      </View>
                    </View>

                    <View style={styles.buttonContainer}>
                      <Button
                        mode="contained"
                        onPress={viewQRCode}
                        style={styles.qrButton}
                        icon="qrcode"
                      >
                        View QR Code
                      </Button>

                      <Button
                        mode="outlined"
                        onPress={() => navigation.navigate('CheckIn', { userId: userData.uniqueId })}
                        style={styles.checkinButton}
                        icon="login"
                      >
                        Check In This User
                      </Button>

                      <Button
                        mode="text"
                        onPress={() => loadCheckinHistory()}
                        style={styles.historyButton}
                        icon="history"
                        loading={historyLoading}
                      >
                        Refresh History
                      </Button>
                    </View>
                  </Card.Content>
                </Card>

                {/* Check-in History Section */}
                <Card style={styles.historyCard}>
                  <Card.Content>
                    <Title style={styles.historyTitle}>Check-in History</Title>
                    
                    {checkinHistory.length > 0 ? (
                      <DataTable>
                        <DataTable.Header>
                          <DataTable.Title>Date & Time</DataTable.Title>
                          <DataTable.Title>Location</DataTable.Title>
                          <DataTable.Title>Notes</DataTable.Title>
                        </DataTable.Header>

                        {checkinHistory.slice(0, 10).map((checkin, index) => (
                          <DataTable.Row key={index}>
                            <DataTable.Cell>
                              {new Date(checkin.checkinTime).toLocaleString()}
                            </DataTable.Cell>
                            <DataTable.Cell>
                              {checkin.location || 'N/A'}
                            </DataTable.Cell>
                            <DataTable.Cell>
                              {checkin.notes || 'N/A'}
                            </DataTable.Cell>
                          </DataTable.Row>
                        ))}
                      </DataTable>
                    ) : (
                      <Title style={styles.noHistoryText}>
                        No check-in history found
                      </Title>
                    )}
                  </Card.Content>
                </Card>
              </>
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
  divider: {
    marginVertical: 20,
  },
  profileCard: {
    backgroundColor: theme.colors.surface,
    elevation: 2,
  },
  profileTitle: {
    fontSize: 18,
    color: theme.colors.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  profileInfo: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
    flex: 1,
  },
  value: {
    fontSize: 14,
    flex: 2,
    textAlign: 'right',
  },
  buttonContainer: {
    gap: 10,
  },
  qrButton: {
    paddingVertical: 8,
  },
  checkinButton: {
    paddingVertical: 8,
  },
  historyButton: {
    paddingVertical: 4,
  },
  historyCard: {
    backgroundColor: theme.colors.surface,
    elevation: 2,
    marginTop: 20,
  },
  historyTitle: {
    fontSize: 18,
    color: theme.colors.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  noHistoryText: {
    fontSize: 14,
    textAlign: 'center',
    color: theme.colors.onSurface,
    opacity: 0.6,
    paddingVertical: 20,
  },
});

export default UserProfileScreen;
