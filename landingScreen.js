import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function LandingScreen({ navigation }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace("LoginScreen"); // Navigate to LoginScreen after 3 seconds
    }, 3000);

    return () => clearTimeout(timeout); // Cleanup to prevent memory leaks
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.shadowContainer}>
        <Image source={require("../assets/rentEaseLogo.png")} style={styles.logo} />
      </View>
      <Text style={styles.appName}>RentEase</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
shadowContainer: {
  width: 160,           
  height: 160,          
  borderRadius: 80,     
  backgroundColor: "#ffffff",
  justifyContent: "center",
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.3,
  shadowRadius: 10,
  elevation: 10,
},
logo: {
  width: 150,           
  height: 150,          
  borderRadius: 75,     
},
 appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#541890",
    marginTop: 20,
  },
});
