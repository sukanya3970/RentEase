import { API_BASE_URL } from '../config';
import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image 
} from "react-native";

export default function SignupScreen({ navigation }) {
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = () => {
    return (
      userName.trim() !== "" &&
      phone.trim().length === 10 &&
      email.trim() !== "" &&
      isValidEmail(email) &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      password === confirmPassword
    );
  };

const handleSignup = async () => {
  setSubmitted(true);
  if (isFormValid()) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, phone, email, password })
      });

      const data = await response.json();
      if (response.ok) {
        alert("Signup successful!");
        navigation.navigate("LoginScreen");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("An error occurred");
    }
  }
};


  return (
    <View style={styles.container}>
      <View style={styles.shadowContainer}>
        <Image source={require("../assets/rentEaseLogo.png")} style={styles.logo} />
      </View>

      <Text style={styles.title}>Sign Up</Text>

      <TextInput 
        style={styles.input} 
        placeholder="User Name" 
        keyboardType="default" 
        value={userName}
        onChangeText={setUserName} 
      />
      {submitted && userName.trim() === "" && (
        <Text style={styles.errorText}>User Name is required</Text>
      )}

      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        keyboardType="email-address" 
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
        placeholder="Phone Number" 
        keyboardType="phone-pad"
        value={phone}
        onChangeText={(text) => {
          const cleaned = text.replace(/[^0-9]/g, '').slice(0, 10);
          setPhone(cleaned);
        }} 
        maxLength={10}
      />
      {submitted && phone.trim().length < 10 && (
        <Text style={styles.errorText}>Phone number must be 10 digits</Text>
      )}

      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        secureTextEntry 
        value={password}
        onChangeText={setPassword} 
      />
      {submitted && password.trim() === "" && (
        <Text style={styles.errorText}>Password is required</Text>
      )}

      <TextInput 
        style={styles.input} 
        placeholder="Confirm Password" 
        secureTextEntry 
        value={confirmPassword}
        onChangeText={setConfirmPassword} 
      />
      {submitted && confirmPassword.trim() === "" && (
        <Text style={styles.errorText}>Confirm Password is required</Text>
      )}
      {submitted && password !== confirmPassword && confirmPassword.trim() !== "" && (
        <Text style={styles.errorText}>Passwords do not match</Text>
      )}

      <TouchableOpacity 
        style={[styles.button, submitted && !isFormValid() && styles.disabledButton]} 
        onPress={handleSignup}
        disabled={submitted && !isFormValid()}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginLink}>Login</Text>
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
