import { StyleSheet, Text, View, Image } from "react-native";
import { socketInstance } from "../socket/socket";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import MapViewDirections from "react-native-maps-directions";
import * as React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import location from "../../assets/icon/location1.png";
import arrive from "../../assets/icon/arrive.png";
import prof from "../../assets/icon/profIcon1.png";

const mapRef = React.createRef();
export default function TripScreen() {
  const [driverCoordinate, setDriverCoordinate] = useState({});
  const [myLocation, setMyLocation] = useState({});

  socketInstance.on("recieve:interval", (data) => {
    setDriverCoordinate(data);
  });

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        enableHighAccuracy: true,
        timeInterval: 5,
      });
      await mapRef.current.animateCamera({
        center: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      });

      setMyLocation({
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);
  console.log(myLocation);
  return (
    <View style={styles.container}>
      <MapView style={styles.map} />
      {/* <Text>{JSON.stringify(driverCoordinate)}</Text> */}
      <View style={[styles.card, styles.shadowProp]}>
        <View style={styles.address}>
          <Image source={location} style={styles.icon} />
          <Text>Home Address</Text>
        </View>
        <View style={styles.underline}></View>
        <View style={styles.address}>
          <Image source={arrive} style={styles.icon1} />
          <Text>School Address</Text>
        </View>
      </View>
      <View style={[styles.card1, styles.shadowProp]}>
        <View style={styles.address1}>
          <Image source={{uri: 'https://t4.ftcdn.net/jpg/03/02/94/53/360_F_302945354_dqIiUiITKpard7fBVKDLtffIqnkDbyo4.jpg'}} style={styles.icon2} />
          <View>
            <Text style={{fontWeight: 'bold'}}>John Deep</Text>
            <Text style={{color: 'gray'}}>B3131BMW</Text>
            <Text style={{color: '#0d155a'}}>SCHOX DRIVER</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DEE9FF",
  },
  map: {
    height: 800,
    width: "100%",
  },
  card: {
    position: "absolute",
    top: 60,
    left: 20,
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
  },
  card1: {
    position: "absolute",
    top: 690,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  underline: {
    width: "90%",
    borderBottomWidth: 0.5,
    borderBottomColor: "#d6d6d6 ",
    marginLeft: 15,
  },
  icon: {
    width: 17,
    height: 17,
    margin: 10,
  },
  icon1: {
    width: 15,
    height: 15,
    margin: 10,
  },
  icon2: {
    width: 90,
    height: 90,
    margin: 10,
    borderRadius: 50
  },
  address: {
    flexDirection: "row",
    alignItems: "center",
  },
  address1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
