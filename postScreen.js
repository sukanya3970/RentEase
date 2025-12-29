import { API_BASE_URL } from '../config';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const categories = ['Houses', 'Lands', 'Shops', 'Parking'];

export default function CreatePost() {
  const router = useRouter();

  const [images, setImages] = useState([]);
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    (async () => {
      const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      if (mediaStatus.status !== 'granted' || cameraStatus.status !== 'granted') {
        alert('Camera and media permissions are required to post images.');
      }

      const storedEmail = await AsyncStorage.getItem('userEmail');
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        console.warn('No email found in storage');
      }
    })();
  }, []);

  const pickImagesFromAlbum = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: false,
      });

      if (!result.canceled) {
        const selectedUri = result.assets[0].uri;
        setImages((prev) => [...prev, selectedUri]);
      }
    } catch (error) {
      console.error('Image picking error:', error);
    }
  };


  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: false,
      });

      if (!result.canceled) {
        setImages((prev) => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Camera error:', error);
    }
  };


  const handlePost = async () => {
    if (
      !price ||
      !category ||
      !description ||
      !location ||
      !contact ||
      !email ||
      images.length === 0
    ) {
      alert('Please fill in all fields and select at least one image.');
      return;
    }

    const formData = new FormData();
    formData.append('price', price);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('email', email);
    formData.append('contact', contact);

    images.forEach((uri, index) => {
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename ?? '');
      const type = match ? `image/${match[1]}` : 'image';

      formData.append('images', {
        uri,
        name: filename,
        type,
      });
    });

    try {
      const token = await AsyncStorage.getItem('userToken'); 

      if (!token) {
        alert('You are not logged in. Please log in to create a post.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert('Post created successfully!');
        handleCancel();
      } else {
        console.error(data);
        alert(`Failed to create post: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting post. Please try again.');
    }
  };

  const handleCancel = () => {
    setImages([]);
    setPrice('');
    setCategory('');
    setDescription('');
    setLocation('');
    setContact('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      
      <Text style={styles.heading}>Create New Post</Text>


      <Text style={styles.label}>Images</Text>
      <View style={styles.imagesContainer}>
        {images.map((uri, idx) => (
          <Image key={idx} source={{ uri }} style={styles.imagePreview} />
        ))}
      </View>

      <View style={styles.imageButtonsRow}>
        <View style={styles.imageButtonWrapper}>
          <Button title="Pick Image" onPress={pickImagesFromAlbum} color="#541890" />
        </View>
        <View style={styles.imageButtonWrapper}>
          <Button title="Take Photo" onPress={takePhoto} color="#541890" />
        </View>
      </View>

      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
        placeholderTextColor="#666"
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select a category" value="" />
          {categories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter description"
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
        placeholderTextColor="#666"
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter location"
        value={location}
        onChangeText={setLocation}
        placeholderTextColor="#666"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, { backgroundColor: '#eee' }]}
        placeholder="Email"
        value={email}
        editable={false}
        selectTextOnFocus={false}
        placeholderTextColor="#666"
      />

      <Text style={styles.label}>Contact Info</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter 10-digit phone number"
        value={contact}
        onChangeText={(text) => {
          const cleaned = text.replace(/[^0-9]/g, '');
          setContact(cleaned);
        }}
        keyboardType="numeric"
        maxLength={10}
        placeholderTextColor="#666"
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#F3E8FF',
  },
  heading: {
    fontSize: 34,
    marginTop: 22,
    fontWeight: 'bold',
    color: '#541890',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 20,
    color: '#4B387A',
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: '#B39DDB',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    backgroundColor: '#fff',
    color: '#000',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagesContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  imageButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  imageButtonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#B39DDB',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    color: '#4B387A',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'space-between',
    gap: 10,
  },
  postButton: {
    backgroundColor: '#541890',
    paddingVertical: 14,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#541890',
    paddingVertical: 14,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 22,
  },
  navTitle: {
    color: 'black',
    marginTop: 12,
    padding: 10,
    fontSize: 18,
  },
  navButton: {
    alignItems: 'flex-start',
  },
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
});
