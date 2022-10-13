import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import * as React from "react";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { baseUrl } from "../constants/baseUrl";
import { useDispatch, useSelector } from "react-redux";
import {
  getDataDriver,
  patchStatusDriver,
} from "../store/actions/driverAction";
import axios from "axios";
import car from "../../assets/car.png";
import {socketInstance} from "../socket/socket";
import * as Location from "expo-location";

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { driver } = useSelector((state) => {
    return state.driverReducer;
  });

  const [status, setStatus] = useState("Available");
  const [isBooked, setIsBooked] = useState(null);
  const [subsDetail, setSubsDetail] = useState({});
  const [userDetail, setUserDetail] = useState({});
  const [school, setSchoolDetail] = useState({});
  const [isPickup, setIsPickup] = useState(true);
  const [isDeliver, setIsDeliver] = useState(false);
  const [isArrive, setIsArrive] = useState(false);
  const [isReady, setReady] = useState(false);
  const [secondPickup, setSecondPickup] = useState(false);
  const [finish, setFinish] = useState(false);
  const [emit, setEmit] = useState("");
  const [statusTrip, setStatusTrip] = useState("depart");

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
      const coordinate = {
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
      };
      socketInstance.emit("send:interval", coordinate);
    } catch (e) {
      console.log(e);
    }
  };
  const start = () => {
    console.log("start");
    const intervalId = setInterval(() => {
      getLocation();
    }, 2000);

    setEmit(intervalId);
  };
  const stop = () => {
    clearInterval(emit);
    setEmit("");
    setStatusTrip("arrive");
    console.log("stop");
  };
  const logout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.navigate("login");
    } catch (e) {
      console.log(e);
    }
  };
  const getData = async () => {
    try {
      dispatch(getDataDriver());
      const jsonValue = await AsyncStorage.getItem("@storage_Key");
      let value = JSON.parse(jsonValue);
      await checkStatus(value?.id);
    } catch (e) {
      console.log(e);
    }
  };

  const checkStatus = async (id) => {
    try {
      const { data } = await axios({
        url: baseUrl + "/drivers/subscriptions/" + id,
        method: "GET",
      });
      if (data.message === "BOOKED") {
        setIsBooked("BOOKED");
        setSubsDetail(data.subsDetail);
        setUserDetail(data.user);
        setSchoolDetail(data.school);
      } else {
        setIsBooked(null);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const updateStatus = async (value) => {
    try {
      dispatch(patchStatusDriver(value));
    } catch (e) {
      console.log(e);
    }
  };
  
  // RENDER SCHEDULE
  const renderPickup = () => { // Antar
    return (
        <TouchableHighlight
            onPress={() => {
              socketInstance.emit("send:coordinate-customer", {
                longitude: +userDetail?.longitude,
                latitude: +userDetail?.latitude,
              });
              socketInstance.emit('send:status-driver', ('Driver Go to Your Home'))
              start()
              navigation.navigate({
                name: "Home",
                params: {
                  lat: userDetail?.latitude,
                  lon: userDetail?.longitude,
                },
                merge: true,
              });
              setIsPickup(false);
              setIsDeliver(true);
            }}
            style={styles.schedule}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.pickup}>PICKUP</Text>
            <Image source={car} style={styles.car} />
          </View>
        </TouchableHighlight>
    );
  };
  const renderDeliver = () => {
    return (
        <TouchableHighlight
            onPress={() => {
              socketInstance.emit("send:coordinate-customer", {
                longitude: +school?.longitude,
                latitude: +school?.latitude,
              });
              socketInstance.emit('send:status-driver', ('Driver Go to School'))
              navigation.navigate({
                name: "Home",
                params: {
                  lat: school?.latitude,
                  lon: school?.longitude,
                },
                merge: true,
              });
              setIsDeliver(false);
              setIsArrive(true);
            }}
            style={styles.schedule}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.pickup}>DELIVER</Text>
            <Image source={car} style={styles.car} />
          </View>
        </TouchableHighlight>
    );
  };
  const renderArrive = () => {
    return (
        <TouchableHighlight
            onPress={() => {
              socketInstance.emit("send:coordinate-customer", '');
              socketInstance.emit('send:status-driver', ('Driver has arrive on the School'))
              stop()
              navigation.navigate({
                name: "Home",
                params: { lat: null, lon: null },
                merge: true,
              });
              setIsArrive(false);
              setReady(true);
            }}
            style={styles.schedule}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.pickup}>ARRIVED</Text>
            <Image source={car} style={styles.car} />
          </View>
        </TouchableHighlight>
    );
  };
  const renderReady = () => { // Jemput
    return (
        <TouchableHighlight
            onPress={() => {
              socketInstance.emit("send:coordinate-customer", {
                longitude: +school?.longitude,
                latitude: +school?.latitude,
              });
              socketInstance.emit('send:status-driver', ('Driver Picking up your child at the School'))
              start()
              navigation.navigate({
                name: "Home",
                params: {
                  lat: school?.latitude,
                  lon: school?.longitude,
                },
                merge: true,
              });
              setReady(false);
              setSecondPickup(true);
            }}
            style={styles.schedule}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.pickup}>PICKUP (SCHOOL)</Text>
            <Image source={car} style={styles.car} />
          </View>
        </TouchableHighlight>
    );
  };
  const secondPickupRender = () => {
    return (
        <TouchableHighlight
            onPress={() => {
              socketInstance.emit("send:coordinate-customer", {
                longitude: +userDetail?.longitude,
                latitude: +userDetail?.latitude,
              });
              socketInstance.emit('send:status-driver', ('Driver on Trip to Your Home'))
              navigation.navigate({
                name: "Home",
                params: {
                  lat: userDetail?.latitude,
                  lon: userDetail?.longitude,
                },
                merge: true,
              });
              setSecondPickup(false);
              setFinish(true);
            }}
            style={styles.schedule}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.pickup}>GO HOME</Text>
            <Image source={car} style={styles.car} />
          </View>
        </TouchableHighlight>
    );
  };
  const finishRender = () => {
    return (
        <TouchableHighlight
            onPress={() => {
              socketInstance.emit("send:coordinate-customer", '');
              socketInstance.emit('send:status-driver', ('Order Finished'))
              stop()
              navigation.navigate({
                name: "Home",
                params: { lat: null, lon: null },
                merge: true,
              });
              setFinish(false);
            }}
            style={styles.schedule}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.pickup}>FINISH</Text>
            <Image source={car} style={styles.car} />
          </View>
        </TouchableHighlight>
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [])
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topCard}>
        <Text
          style={{
            fontWeight: "bold",
            color: "#2283d0",
            fontSize: 30,
          }}
        >
          Profile
        </Text>
      </View>
      <View style={styles.card}>
        {/* profile */}
        <View style={styles.cardProfile}>
          <Image
            source={{ uri: `${driver?.imgUrl}` }}
            style={{ height: 80, width: 80, borderRadius: 50 }}
          />
          <Text style={styles.driverText}>Mr. {driver?.fullName}</Text>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "center",
            }}
          >

          </View>
        </View>
        {/*  balance  */}
        <View style={styles.cardBalance}>
          <Text style={styles.modalText}>
            Balance: Rp.{" "}
            {driver.balance?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
          </Text>
        </View>
        <View style={{flexDirection: "row"}}>
          {!isBooked && (
              <View
                  style={{
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#bdc3c7",
                    overflow: "hidden",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 160,
                    marginRight: 10,
                    height: 40
                  }}
              >
                <Picker
                    style={[styles.button, { width: "100%" }]}
                    selectedValue={status}
                    onValueChange={(itemValue, itemIndex) => {
                      setStatus(itemValue);
                      updateStatus(itemValue);
                    }}
                >
                  <Picker.Item label="Available" value="Available" />
                  <Picker.Item label="Non Available" value="NonAvailable" />
                </Picker>
              </View>
          )}
          <TouchableHighlight
            onPress={() => logout()}
            style={[styles.button, styles.buttonLogout]}
          >
            <Text style={{ color: "white" }}>Logout</Text>
          </TouchableHighlight>
        </View>
        {/*  schedule  */}
        <View style={styles.cardSchedule}>
          <ScrollView style={{ width: "100%", height: "100%" }}>
            {!isBooked ? (
              <View style={styles.noschedule}>
                <Text style={{ fontWeight: "bold", color: "grey" }}>
                  Currently, you have no customer
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.custInfo}>
                  <Text style={styles.title}>CUSTOMER INFORMATION</Text>
                  <Text style={styles.userName}>{userDetail?.fullName}</Text>
                  <View style={styles.control}>
                    <View style={{ marginRight: 80 }}>
                      <Text style={styles.subTitle}>Children Name</Text>
                      <Text style={styles.childrenName}>
                        {userDetail?.childrenName}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.subTitle}>Phone Number</Text>
                      <Text style={styles.childrenName}>
                        {userDetail?.phoneNumber}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.control, { marginTop: 20 }]}>
                    <View style={{ marginRight: 110 }}>
                      <Text style={styles.subTitle}>To School</Text>
                      <Text style={styles.childrenName}>
                        {subsDetail?.toShoolTime}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.subTitle}>Back To Home</Text>
                      <Text style={styles.childrenName}>
                        {subsDetail?.goHomeTime}
                      </Text>
                    </View>
                  </View>
                </View>
                {isPickup && renderPickup()}
                {isDeliver && renderDeliver()}
                {isArrive && renderArrive()}
                {isReady && renderReady()}
                {secondPickup && secondPickupRender()}
                {finish && finishRender()}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DEE9FF",
  },
  topCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    flex: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
  },
  driverText: {
    marginVertical: 20,
    fontSize: 22,
    fontWeight: "bold",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    height: 40
  },
  buttonOpen: {
    backgroundColor: "green",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  buttonLogout: {
    backgroundColor: "#c70000",
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    marginBottom: 14,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    textAlign: "center",
    fontWeight: "normal",
    color: "#4c4b49",
  },
  cardProfile: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 70,
    width: "100%",
    height: "100%",
  },
  cardBalance: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 20,
  },
  cardSchedule: {
    flex: 4,
    width: "100%",
    height: "100%",
  },
  custInfo: {
    height: 230,
    backgroundColor: "#DEE9FF",
    borderRadius: 20,
    alignItems: "center",
    marginVertical: 5,
    marginHorizontal: "5%",
  },
  alignStart: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  alignEnd: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  schedule: {
    height: 100,
    backgroundColor: "lightgreen",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
    marginHorizontal: "5%",
  },
  noschedule: {
    height: 200,
    // backgroundColor: "#DEE9FF",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
    marginHorizontal: "5%",
  },
  pickup: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  car: {
    width: 70,
    height: 30,
    marginTop: 6,
    marginLeft: 10,
  },
  userName: {
    color: "grey",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 30,
  },
  title: {
    color: "#4c93db",
    fontWeight: "bold",
    marginTop: 10,
    marginVertical: 3,
    fontSize: 18,
  },
  childrenName: {
    color: "grey",
    marginBottom: 10,
  },
  subTitle: {
    color: "#4c93db",
    fontWeight: "bold",
  },
  control: {
    width: 270,
    flexDirection: "row",
  },

});
