import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ChatScreen from "../screens/ChatScreen";
import {useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import PickupScreen from '../screens/PickupScreen'

const Tab = createBottomTabNavigator();
export default function Home({navigation, route}) {
    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('@storage_Key')
            if(value === null) {
                navigation.navigate("login")
            }
        } catch(e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getData()
    }, [])
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === "Home") {
                        iconName = focused ? "home" : "home";
                    } else if (route.name === "Profile") {
                        iconName = focused ? "user" : "user";
                    } else if (route.name === "Chat") {
                        iconName = focused ? "message-circle" : "message-circle";
                    }
                    return (
                        <Feather
                            name={iconName}
                            size={28}
                            color={color}
                        />
                    );
                },
                tabBarActiveTintColor: "#f3a70a",
                tabBarInactiveTintColor: "#2C367D",
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                initialParams={{data: route.params?.data}}
                options={{headerShown: false}}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{headerShown: false}}
            />
            <Tab.Screen
                name="Chat"
                component={ChatScreen}
                options={{headerShown: false}}
            />
            {/*<Tab.Screen*/}
            {/*    name="Pickup"*/}
            {/*    component={PickupScreen}*/}
            {/*    options={{headerShown: false}}*/}
            {/*/>*/}
        </Tab.Navigator>
    )
}