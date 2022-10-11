import { StatusBar } from "expo-status-bar";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as React from "react";
import { baseUrl } from "../constants/baseUrl";

export default function TopUp({ navigation }) {
  const [value, setValue] = useState("");
  const [token, setToken] = useState("");

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@storage_Key");
      let value = JSON.parse(jsonValue);
      setToken(value.access_token);
    } catch (e) {
      console.log(e);
    }
  };

  const onSubmit = (value) => async () => {
    try {
      if (value < 100000 || !value) {
        Alert.alert("Alert", "Minimum Top up is Rp 100.000");
      } else {
        const { data } = await axios({
          url: baseUrl + "/users/topup",
          method: "post",
          data: {
            gross: value,
          },
          headers: { access_token: token },
        });
        navigation.navigate("Midtrans", { url: data.redirect_url });
      }
    } catch (err) {
      Alert.alert("Alert", err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [])
  );

  return (
    <View style={styles.containerPhoto}>
      <View style={styles.userView}>
        <View style={{ marginStart: 0 }}>
          <Text style={styles.hallo}>Enter Top up amount</Text>
        </View>
      </View>
      <TextInput
        style={styles.input}
        onChangeText={setValue}
        placeholder="Rp 0"
        keyboardType="numeric"
      />
      <StatusBar style="auto" />
      <TouchableOpacity onPress={onSubmit(value)}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  containerPhoto: {
    flex: 1,
  },
  userView: {
    width: "100%",
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  hallo: {
    color: "#2B377F",
    fontWeight: "700",
    fontSize: 20,
    marginBottom: 2,
    marginTop: 5,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#2B377F",
    marginTop: 10,
    marginHorizontal: 30,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 15,
    textAlign: "center",
  },
});
