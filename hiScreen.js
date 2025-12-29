import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useRoute } from "@react-navigation/native";

export default function HiScreen() {
  const route = useRoute();
  const { category } = route.params || {};

  return (
    <View style={styles.container}>
      {/* Circular Logo */}
      <View style={styles.shadowContainer}>
        <Image source={require("../assets/rentEaseLogo.png")} style={styles.logo} />
      </View>
      <Text style={styles.text}>Hi..Hello..</Text>
      <Text style={styles.text}>You selected: {category}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
  },
  shadowContainer: {
  width: 250,
  height: 250,
  borderRadius: 125, // half of width/height
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
  width: 240,
  height: 240,
  borderRadius: 120, // half of width/height
},
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e47e98",
  },
});
