import * as React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProfileScreen from '../screens/Profile';
import MidtransScreen from '../screens/MidtransScreen';

const Stack = createNativeStackNavigator();

export default function SubscriptionNavigator() {
  return (
    <Stack.Navigator initialRouteName="Profile">
        <Stack.Screen 
          name="ProfileScreen" 
          component={ProfileScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen 
          name="Midtrans" 
          component={MidtransScreen}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
  )
}