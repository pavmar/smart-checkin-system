import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Title, Button, DataTable, Searchbar, Chip, Divider } from 'react-native-paper';
import { theme } from '../theme/theme';
import { getAllUsers, getAllCheckIns, getCheckInStats } from '../services/api';

const AdminDashboard = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [allCheckins, setAllCheckins] = useState([]);
  const [stats, setStats] = useState({});
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredCheckins, setFilteredCheckins] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'checkins'

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchQuery, users, allCheckins]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersResponse, checkinsResponse, statsResponse] = await Promise.all([
        getAllUsers(),
        getAllCheckIns(),
        getCheckInStats(),
      ]);
      
      setUsers(usersResponse.data || []);
      setAllCheckins(checkinsResponse.data || []);
      setStats(statsResponse.data || {});
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllCheckins = async () => {
    try {
      const response = await getAllCheckIns();
      setAllCheckins(response.data || []);
    } catch (error) {
      console.error('Failed to load check-ins:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filterData = () => {
    if (!searchQuery) {
      setFilteredUsers(users);
      setFilteredCheckins(allCheckins);
      return;
    }

    const query = searchQuery.toLowerCase();
    
    const filteredUsersList = users.filter(user => 
      user.firstName?.toLowerCase().includes(query) ||
      user.lastName?.toLowerCase().includes(query) ||
      user.mobile?.includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.uniqueId?.toLowerCase().includes(query)
    );
    
    setFilteredUsers(filteredUsersList);
    setFilteredCheckins(allCheckins); // Filter checkins based on query if needed
  };

  const viewUserProfile = (userId) => {
    navigation.navigate('Profile', { prefilledUserId: userId });
  };

  const checkInUser = (userId) => {
    navigation.navigate('CheckIn', { userId });
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.content}>
        {/* Header Stats */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Title style={styles.statsTitle}>System Overview</Title>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Title style={styles.statNumber}>{stats.totalUsers || users.length}</Title>
                <Title style={styles.statLabel}>Total Users</Title>
              </View>
              <View style={styles.statItem}>
                <Title style={styles.statNumber}>{stats.totalCheckins || allCheckins.length}</Title>
                <Title style={styles.statLabel}>Total Check-ins</Title>
              </View>
              <View style={styles.statItem}>
                <Title style={styles.statNumber}>{stats.todayCheckins || 0}</Title>
                <Title style={styles.statLabel}>Today's Check-ins</Title>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Search Bar */}
        <Searchbar
          placeholder="Search users by name, mobile, email, or ID..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <Chip
            selected={activeTab === 'users'}
            onPress={() => setActiveTab('users')}
            style={styles.tabChip}
          >
            Users ({filteredUsers.length})
          </Chip>
          <Chip
            selected={activeTab === 'checkins'}
            onPress={() => setActiveTab('checkins')}
            style={styles.tabChip}
          >
            Recent Check-ins
          </Chip>
        </View>

        {/* Users Table */}
        {activeTab === 'users' && (
          <Card style={styles.tableCard}>
            <Card.Content>
              <Title style={styles.tableTitle}>Registered Users</Title>
              
              {filteredUsers.length > 0 ? (
                <ScrollView horizontal>
                  <DataTable>
                    <DataTable.Header>
                      <DataTable.Title style={styles.tableHeaderCell}>Name</DataTable.Title>
                      <DataTable.Title style={styles.tableHeaderCell}>Mobile</DataTable.Title>
                      <DataTable.Title style={styles.tableHeaderCell}>Email</DataTable.Title>
                      <DataTable.Title style={styles.tableHeaderCell}>User ID</DataTable.Title>
                      <DataTable.Title style={styles.tableHeaderCell}>Registered</DataTable.Title>
                      <DataTable.Title style={styles.tableHeaderCell}>Actions</DataTable.Title>
                    </DataTable.Header>

                    {filteredUsers.map((user, index) => (
                      <DataTable.Row key={index}>
                        <DataTable.Cell style={styles.tableCell}>
                          {user.firstName} {user.lastName}
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.tableCell}>
                          {user.mobile}
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.tableCell}>
                          {user.email}
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.tableCell}>
                          {user.uniqueId}
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.tableCell}>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.tableCell}>
                          <View style={styles.actionButtons}>
                            <Button
                              mode="text"
                              onPress={() => viewUserProfile(user.uniqueId)}
                              compact
                            >
                              View
                            </Button>
                            <Button
                              mode="text"
                              onPress={() => checkInUser(user.uniqueId)}
                              compact
                            >
                              Check-in
                            </Button>
                          </View>
                        </DataTable.Cell>
                      </DataTable.Row>
                    ))}
                  </DataTable>
                </ScrollView>
              ) : (
                <Title style={styles.noDataText}>
                  {searchQuery ? 'No users found matching your search' : 'No users registered yet'}
                </Title>
              )}
            </Card.Content>
          </Card>
        )}

        {/* Check-ins Table */}
        {activeTab === 'checkins' && (
          <Card style={styles.tableCard}>
            <Card.Content>
              <Title style={styles.tableTitle}>Recent Check-ins</Title>
              
              {allCheckins.length > 0 ? (
                <ScrollView horizontal>
                  <DataTable>
                    <DataTable.Header>
                      <DataTable.Title style={styles.tableHeaderCell}>Date & Time</DataTable.Title>
                      <DataTable.Title style={styles.tableHeaderCell}>User Name</DataTable.Title>
                      <DataTable.Title style={styles.tableHeaderCell}>Mobile</DataTable.Title>
                      <DataTable.Title style={styles.tableHeaderCell}>Location</DataTable.Title>
                      <DataTable.Title style={styles.tableHeaderCell}>Notes</DataTable.Title>
                    </DataTable.Header>

                    {allCheckins.slice(0, 50).map((checkin, index) => (
                      <DataTable.Row key={index}>
                        <DataTable.Cell style={styles.tableCell}>
                          {new Date(checkin.checkinTime).toLocaleString()}
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.tableCell}>
                          {checkin.userName}
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.tableCell}>
                          {checkin.userMobile}
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.tableCell}>
                          {checkin.location || 'N/A'}
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.tableCell}>
                          {checkin.notes || 'N/A'}
                        </DataTable.Cell>
                      </DataTable.Row>
                    ))}
                  </DataTable>
                </ScrollView>
              ) : (
                <Title style={styles.noDataText}>
                  No check-ins recorded yet
                </Title>
              )}
            </Card.Content>
          </Card>
        )}
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
    padding: 16,
  },
  statsCard: {
    elevation: 4,
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.colors.primary,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    minWidth: 80,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.onSurface,
  },
  searchBar: {
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  tabChip: {
    flex: 1,
  },
  tableCard: {
    elevation: 4,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  tableHeaderCell: {
    minWidth: 120,
  },
  tableCell: {
    minWidth: 120,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  noDataText: {
    fontSize: 14,
    textAlign: 'center',
    color: theme.colors.onSurface,
    opacity: 0.6,
    paddingVertical: 32,
  },
});

export default AdminDashboard;
