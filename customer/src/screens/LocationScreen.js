import {
  Button,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import * as React from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

export default function LocationScreen({ navigation }) {
  const [origin, setOrigin] = useState({
    longitude: 0,
    latitude: 0,
  });
  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        enableHighAccuracy: true,
        timeInterval: 5,
      });
      setOrigin({
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

  return (
    <View style={styles.section1}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        zoomControlEnabled={true}
      >
        <Marker
          coordinate={{
            latitude: origin.latitude,
            longitude: origin.longitude,
          }}
          draggable
          onDragEnd={(e) => {
            setOrigin(e.nativeEvent.coordinate);
          }}
          pinColor={"darkgreen"}
          title={"Origin"}
        />
      </MapView>
      <TouchableHighlight
        disabled={!(origin.latitude && origin.longitude)}
        style={[styles.card, styles.shadow]}
        onPress={() =>
          navigation.navigate({
            name: "register",
            params: { coords: origin },
            merge: true,
          })
        }
      >
        <Text style={styles.save}>Save</Text>
      </TouchableHighlight>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  section1: {
    // borderWidth: 1,
    // borderColor: 'black',
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    // height: Dimensions.get('window').height,
    // width: '90%',
    height: 730,
    marginBottom: 20,
  },
  card: {
    position: "absolute",
    backgroundColor: "#0d155a",
    top: 600,
    padding: 25,
    borderRadius: 20,
    paddingHorizontal: 40,
  },
  save: {
    color: "white",
    fontWeight: "bold",
    fontSize: 26
  },
  shadow: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 2,
  },
});
