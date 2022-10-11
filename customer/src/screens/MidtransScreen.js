import { StyleSheet, Text, View, Button } from "react-native";
import { WebView } from "react-native-webview";

export default function Home({ navigation, route }) {
  const { url } = route.params;

  return (
    <WebView
      style={styles.container}
      source={{ uri: url }}
      onNavigationStateChange={(navState) => {
        if (navState.url.includes("status_code=200")) {
          navigation.navigate("ProfileScreen");
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
