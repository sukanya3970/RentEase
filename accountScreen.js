import { API_BASE_URL } from '../config';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function AccountScreen() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserProfileAndPosts();
  }, []);

  const fetchUserProfileAndPosts = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const email = await AsyncStorage.getItem('userEmail');
      if (!token || !email) throw new Error('User not authenticated');

      const profileRes = await fetch(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profileData = await profileRes.json();
      if (!profileRes.ok) throw new Error(profileData.message);
      setUser(profileData);

      const postsRes = await fetch(`${API_BASE_URL}/api/posts/user/${email}`);
      const postsData = await postsRes.json();
      if (!postsRes.ok) throw new Error(postsData.message);
      setPosts(postsData);
    } catch (err) {
      console.error('Error fetching account data:', err);
      Alert.alert('Error', err.message || 'Failed to load account data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('Authentication token missing');

      const res = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete post');

      setPosts(posts.filter((post) => post._id !== postId));
      Alert.alert('Success', 'Post deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      Alert.alert('Error', err.message || 'Failed to delete post');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userEmail');

    // Reset navigation to LoginScreen
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#541890" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Top Nav Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}> ← </Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Profile</Text>
        <View style={{ width: 30 }} /> 
      </View>

      <View style={styles.profileSection}>
        <Image
          source={require('../assets/profileicon.png')}
          style={styles.profileIcon}
        />
        <Text style={styles.name}>{user?.name || 'Name not found'}</Text>
        <Text style={styles.info}>📧 {user?.email || 'No email found'} </Text>
        <Text style={styles.info}>📞 {user?.phone || 'No phone number'} </Text>
      </View>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.postSection}>
        <Text style={styles.sectionTitle}>Your Posts</Text>
        {posts.length === 0 ? (
          <Text style={styles.noPosts}>No posts found.</Text>
        ) : (
          posts.map((post) => (
            <View key={post._id} style={styles.postCard}>
              {post.images?.[0] && (
                <Image
                  source={{ uri: `${API_BASE_URL}/${post.images[0]}` }}
                  style={styles.postImage}
                />
              )}
              <View style={styles.postInfo}>
                <Text style={styles.postText}>💰 {post.price}</Text>
                <Text style={styles.postText}>📍 {post.location}</Text>
                <Text style={styles.postText}>📦 {post.category}</Text>
                <Text style={styles.postText}>📞 {post.contact}</Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    'Confirm Delete',
                    'Are you sure you want to delete this post?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Delete', style: 'destructive', onPress: () => handleDeletePost(post._id) },
                    ]
                  )
                }
                style={styles.deleteButton}
              >
                <Text style={styles.deleteText}> Delete </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // NavBar styles
  navBar: {
    height: 100,
    backgroundColor: '#541890',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    marginTop: 20,
    fontSize: 24,
    color: '#ffffff',
  },
  navTitle: {
    fontSize: 30,
    marginTop: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  profileSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  profileIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#541890',
  },
  info: {
    fontSize: 16,
    color: 'black',
    marginVertical: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#541890',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  postSection: {
    paddingHorizontal: 10,
  },
  noPosts: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginVertical: 20,
  },
  postCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginVertical: 8,
    padding: 10,
    elevation: 3,
  },
  postImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
  },
  postInfo: {
    marginTop: 10,
  },
  postText: {
    fontSize: 15,
    color: '#333',
    marginVertical: 2,
  },
  deleteButton: {
    marginTop: 10,
    width: '30%',
    alignItems: 'center',
    backgroundColor: '#ff4d4d',
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  logoutButton: {
    margin: 20,
    paddingVertical: 12,
    backgroundColor: '#541890',
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
