import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import LandingScreen from "./screens/landingScreen";
import SignupScreen from "./screens/signupScreen";
import LoginScreen from "./screens/loginScreen";
import HiScreen from "./screens/hiScreen";
import AdminScreen from "./screens/adminScreen";
import HomeScreen from "./screens/homeScreen";
import PostScreen from "./screens/postScreen";
import HouseScreen from "./screens/houseScreen";
import ShopScreen from "./screens/shopScreen";
import LandScreen from "./screens/landScreen";
import ParkScreen from "./screens/parkScreen";
import AccountScreen from "./screens/accountScreen";


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LandingScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LandingScreen" component={LandingScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="HiScreen" component={HiScreen} />
        <Stack.Screen name="AdminScreen" component={AdminScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="PostScreen" component={PostScreen} />
        <Stack.Screen name="HouseScreen" component={HouseScreen} />
        <Stack.Screen name="LandScreen" component={LandScreen} />
        <Stack.Screen name="ShopScreen" component={ShopScreen} />
        <Stack.Screen name="ParkScreen" component={ParkScreen} />
        <Stack.Screen name="AccountScreen" component={AccountScreen} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}
