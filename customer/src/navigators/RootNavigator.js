import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/loginScreen";
import LocationScreen from "../screens/LocationScreen";
import HomeTab from "./Home";

const Stack = createNativeStackNavigator();
export default function RootNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="home" component={HomeTab} options={{headerShown: false}}/>
                <Stack.Screen name="login" component={LoginScreen} options={{headerShown: false}}/>
                <Stack.Screen name="register" component={RegisterScreen} options={{headerShown: false}}/>
                <Stack.Screen name="location" component={LocationScreen} options={{headerShown: true}}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}