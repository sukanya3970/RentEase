import { API_BASE_URL } from '../config';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users`);
      const data = await res.json();
      const filteredUsers = data.filter(user => user.email !== 'admin123@gmail.com'); // filter out admin
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Fetch users error:', error);
    }
  };

  const deleteUser = async (userId) => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user and all their posts?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(`${API_BASE_URL}/api/admin/user/${userId}`, {
                method: 'DELETE'
              });
              const data = await res.json();
              Alert.alert('Deleted', data.message);
              fetchUsers();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete user');
            }
          }
        }
      ]
    );
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userEmail');
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.userCard}>
      <Text style={styles.name}>{item.userName}</Text>
      <Text style={styles.infoText}>📧 {item.email}</Text>
      <Text style={styles.infoText}>📱 {item.phone}</Text>
      <Text style={styles.infoText}>📝 Posts: {item.postCount}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteUser(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete User</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navbar */}
      <View style={styles.navbarTop}>
        <Text style={styles.navbarTitle}>Admin Dashboard</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>⎋</Text>
        </TouchableOpacity>
      </View>

      {/* User List */}
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No users found.</Text>}
      />

      {/* Bottom Navbar */}
      <View style={styles.navbarBottom}>
        <Text style={styles.navbarText}>© RentEase Admin Panel</Text>
      </View>
    </SafeAreaView>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  navbarTop: {
    height: 110,
    backgroundColor: '#541890',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40
  },
  navbarTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold'
  },
  logoutButton: {
    padding: 8,
    borderRadius: 6
  },
  logoutText: {
    color: '#fff',
    fontSize: 22
  },
  userCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4
  },
  infoText: {
    fontSize: 15,
    color: '#374151',
    marginVertical: 2
  },
  deleteButton: {
    marginTop: 12,
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#6b7280',
    fontSize: 16
  },
  navbarBottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 50,
    backgroundColor: '#541890',
    justifyContent: 'center',
    alignItems: 'center'
  },
  navbarText: {
    color: '#fff',
    fontSize: 14
  }
});
