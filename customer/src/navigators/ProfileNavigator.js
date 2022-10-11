import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import ProfileScreen from '../screens/Profile';
import ProfileScreen from "../screens/ProfilePage";
import MidtransScreen from "../screens/MidtransScreen";
import TopUpScreen from "../screens/TopUp";

const Stack = createNativeStackNavigator();

export default function SubscriptionNavigator() {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Top Up"
        component={TopUpScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Midtrans"
        component={MidtransScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
