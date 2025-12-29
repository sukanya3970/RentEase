import { API_BASE_URL } from '../config';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const LandScreen = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchLands = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/posts/category/Lands`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setLands(data);
      } catch (error) {
        console.error('Error fetching lands:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLands();
  }, []);

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.images && item.images.length > 0 && (
        <Image
          source={{ uri: `${API_BASE_URL}/${item.images[0].replace(/\\/g, '/')}` }}
          style={styles.image}
        />
      )}
      <Text style={styles.title}>Price: ₹{item.price}</Text>
      <Text style={styles.description}>Description: {item.description}</Text>
      <Text style={styles.info}>📍{item.location}</Text>
      <Text style={styles.info}>📧 {item.email}</Text>
      <Text style={styles.info}>☎ {item.contact}</Text>

      <TouchableOpacity style={styles.callButton} onPress={() => handleCall(item.contact)}>
        <Text style={styles.callText}>Call</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Lands...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Top Navigation Bar */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Lands</Text>
      </View>

      {/* Post List */}
      {lands.length === 0 ? (
        <View style={styles.noPostsContainer}>
          <Text style={styles.noPostsText}>No land posts available.</Text>
        </View>
      ) : (
        <FlatList
          data={lands}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.container}
        />
      )}
      {/* Post List */}
      {/* <FlatList
        data={lands}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.container}
      /> */}

      {/* Bottom Navigation Bar */}
      {/* <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('HomeScreen')}>
          <Image source={require('../assets/home.jpg')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('PostScreen')}>
          <Image source={require('../assets/posticon.jpg')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('AccountScreen')}>
          <Image source={require('../assets/accounticon.jpg')} style={styles.navIcon} />
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#541890',
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  navTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 162,
  },
  container: {
    padding: 10,
    paddingBottom: 80,
    backgroundColor: '#f9f9f9',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    marginBottom: 5,
  },
  info: {
    fontSize: 14,
    marginBottom: 3,
  },
  callButton: {
    width: '30%',
    marginTop: 10,
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  callText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  navButton: {
    alignItems: 'center',
  },
  navIcon: {
    width: 55,
    height: 55,
    resizeMode: 'contain',
  },
  noPostsContainer: {
    flex: 1,
    justifyContent: 'center', // vertical center
    alignItems: 'center',     // horizontal center
  },
  noPostsText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',      // ensures multi-line text stays centered
  },

});

export default LandScreen;
