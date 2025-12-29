import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const COLORS = {
  primary: '#541890',
  accent: '#e47e98',
  white: '#fff',
  darkText: '#333',
  lightGray: '#f5f5f5',
  borderGray: '#E0E0E0',
};

const categories = [
  { id: '1', title: 'Houses', image: require('../assets/houseicon.jpg') },
  { id: '2', title: 'Lands', image: require('../assets/landicon.jpg') },
  { id: '3', title: 'Shops', image: require('../assets/shopicon.jpg') },
  { id: '4', title: 'Parking', image: require('../assets/caricon.jpg') },
];

const featuredProducts = [
  { id: '1', title: 'Find your DREAM HOME', image: require('../assets/feature1.jpg') },
  { id: '2', title: 'Communicate to BUY or RENT', image: require('../assets/feature2.jpg') },
];

const sliderImages = [
  require('../assets/LogoImg.jpg'),
  require('../assets/Rent.jpg'),
  require('../assets/Shops.jpg'),
  require('../assets/Park.jpg'),
];

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % sliderImages.length;
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const filteredCategories = search.trim() === ''
    ? categories
    : categories.filter(cat =>
        cat.title.toLowerCase().includes(search.trim().toLowerCase())
      );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <Text style={styles.logo}></Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search properties here..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#999"
        />
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.mainContent}>
          {search.trim() === '' && (
            <View style={styles.section}>
              <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={15}
              >
                {sliderImages.map((img, index) => (
                  <Image
                    key={index}
                    source={img}
                    style={styles.sliderImage}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
              <View style={styles.dotsContainer}>
                {sliderImages.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      currentIndex === index && styles.activeDot,
                    ]}
                  />
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.categoryRow}>
              {filteredCategories.map((cat) => (
                <TouchableOpacity
                    key={cat.id}
                    style={styles.categoryCard}
                    onPress={() => {
                    if (cat.title === 'Houses') navigation.navigate('HouseScreen');
                    else if (cat.title === 'Lands') navigation.navigate('LandScreen');
                    else if (cat.title === 'Shops') navigation.navigate('ShopScreen');
                    else if (cat.title === 'Parking') navigation.navigate('ParkScreen');
                    }}
                >
                    <Image source={cat.image} style={styles.categoryImage} resizeMode="cover" />
                    <Text style={styles.categoryTitle}>{cat.title} </Text>
                </TouchableOpacity>
                ))}
              {filteredCategories.length === 0 && (
                <Text style={{ color: COLORS.darkText, fontSize: 16, marginTop: 10 }}>
                  No matching categories found.
                </Text>
              )}
            </View>
          </View>

          {search.trim() === '' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Featured Listings</Text>
              {featuredProducts.map((product) => (
                <View key={product.id} style={styles.productCard}>
                  <Image source={product.image} style={styles.productImage} resizeMode="cover" />
                  <View style={styles.productInfo}>
                    <Text style={styles.productTitle}>{product.title}</Text>
                    {product.price && <Text style={styles.productPrice}>{product.price}</Text>}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('HomeScreen')}
        >
          <Image source={require('../assets/home.jpg')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('PostScreen')}
        >
          <Image source={require('../assets/posticon.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('AccountScreen')}
        >
          <Image source={require('../assets/accounticon.jpg')} style={styles.navIcon} />
        </TouchableOpacity>
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    backgroundColor: COLORS.primary,
    padding: 16,
    paddingTop: 40,
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  searchBar: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 8,
    width: '90%',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  mainContent: { flex: 1 },
  section: { padding: 16 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  sliderImage: {
    width,
    height: 250,
    borderRadius: 10,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ccc', margin: 4 },
  activeDot: { backgroundColor: COLORS.primary },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },
  categoryCard: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    alignItems: 'center',
    padding: 8,
    marginBottom: 12,
    width: '45%',
  },
  categoryImage: { width: '100%', height: 100, borderRadius: 8, marginBottom: 8 },
  categoryTitle: { fontSize: 14, color: COLORS.darkText },
  productCard: {
    backgroundColor: '#541890',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  productImage: { width: '100%', height: 200 },
  productInfo: { padding: 12 },
  productTitle: { fontSize: 16, fontWeight: 'bold', color: '#ffffff' },
  productPrice: { fontSize: 14, color: COLORS.accent },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  navButton: { alignItems: 'center' },
  navIcon: { width: 55, height: 55 },
});
