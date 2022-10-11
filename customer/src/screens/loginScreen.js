import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TextInput,
  ImageBackground,
  Image,
  TouchableHighlight,
  View,
  Alert,
  BackHandler,
  Pressable,
  AsyncStorage,
} from "react-native";
import { useEffect, useState } from "react";
import logo from "../../assets/logo1.png";
import axios from "axios";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("@storage_Key", jsonValue);
    } catch (e) {
      console.log(e);
    }
  };
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@storage_Key");
      return jsonValue != null ? navigation.navigate("Home") : null;
    } catch (e) {
      console.log(e);
    }
  };

  const login = async () => {
    try {
      const { data } = await axios({
        url: "https://2d0a-202-80-215-137.ap.ngrok.io/users/login",
        method: "POST",
        data: { email, password },
      });
      // console.log(data);
      await storeData({ id: data.id, access_token: data.access_token });
      navigation.navigate({
        name: "Home",
        // params: {id: data.id}
      });
    } catch (e) {
      console.log(e);
    }
  };

  const backAction = () => {
    Alert.alert("Hold on!", "Are you sure you want to exit the app?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      { text: "YES", onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };

  useEffect(() => {
    getData();
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);
  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={styles.container}
    >
      <Image source={logo} style={styles.logo} />
      <Text style={styles.desc}>Please Sign in to continue</Text>

      <TextInput
        style={[styles.input, { marginTop: 50 }]}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
      />
      <TouchableHighlight
        onPress={() => login()}
        style={styles.submit}
        underlayColor="#fff"
      >
        <Text style={styles.submitText}>Login</Text>
      </TouchableHighlight>

      <View style={styles.control}>
        <Text style={styles.desc}>Don't have an account? </Text>
        <Pressable onPress={() => navigation.navigate("register")}>
          <Text style={[styles.desc, { color: "white" }]}>Sign Up</Text>
        </Pressable>
      </View>
      <StatusBar style="auto" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    height: null,
    padding: 20,
  },
  form: {
    flex: 1,
    width: "90%",
    height: "100%",
    marginTop: 20,
  },
  input: {
    height: 45,
    margin: 12,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 30,
    width: "90%",
  },
  logo: {
    width: 130,
    height: 30,
    marginTop: 220,
  },
  desc: {
    color: "#a0acda",
    fontSize: 18,
  },
  submit: {
    borderRadius: 40,
    backgroundColor: "#a0acda",
    width: 80,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: "70%",
    marginTop: 10,
  },
  submitText: {
    color: "#fff",
  },
  control: {
    flexDirection: "row",
    marginTop: 200,
    marginLeft: 70,
  },
});
