import { API_BASE_URL } from '../config';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = () => {
    return email.trim() !== "" && isValidEmail(email) && password.trim() !== "";
  };

  const handleLogin = async () => {
    setSubmitted(true);
    if (!isFormValid()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const userEmail = data.email;
        const userToken = data.token;

        if (!userEmail || !userToken) {
          throw new Error("Login response missing email or token");
        }

        await AsyncStorage.setItem('userToken', userToken);
        await AsyncStorage.setItem('userEmail', userEmail);

        const lowerEmail = email.toLowerCase();
        if (lowerEmail === "admin123@gmail.com" && password === "4321") {
          navigation.navigate("AdminScreen");
        } else {
          navigation.navigate("HomeScreen");
        }
      } else {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.shadowContainer}>
        <Image source={require("../assets/rentEaseLogo.png")} style={styles.logo} />
      </View>

      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
      />
      {submitted && email.trim() === "" && (
        <Text style={styles.errorText}>Email is required</Text>
      )}
      {submitted && email.trim() !== "" && !isValidEmail(email) && (
        <Text style={styles.errorText}>Email is invalid</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Text style={styles.togglePasswordText}>
          {showPassword ? "Hide" : "Show"} Password
        </Text>
      </TouchableOpacity>
      {submitted && password.trim() === "" && (
        <Text style={styles.errorText}>Password is required</Text>
      )}

      <TouchableOpacity
        style={[styles.button, !isFormValid() && styles.disabledButton]}
        onPress={handleLogin}
        disabled={!isFormValid()}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignupScreen")}>
        <Text style={styles.loginText}>
          Don’t have an account? <Text style={styles.loginLink}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  shadowContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
    marginBottom: 20,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#541890",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  togglePasswordText: {
    color: "#541890",
    alignSelf: "flex-end",
    marginRight: "5%",
    marginBottom: 10,
    fontWeight: "600",
  },
  button: {
    width: "90%",
    backgroundColor: "#e47e98",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  loginLink: {
    color: "#541890",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    alignSelf: "flex-start",
    marginLeft: "5%",
    marginBottom: 10,
    fontWeight: "600",
  },
});
