import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform,
} from "react-native";

export default function registerOptions() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <View style={styles.container}>
        <StatusBar backgroundColor="#F7F7F7" barStyle="light-content" />

        {/* Add blue circle */}
        <View style={styles.bluecircle} />
        <View
          // colors={['#5cb8ff', '#6b9bfa']} // Gradient colors (same as splash screen)
          style={styles.bluecircle2}
        />
        <Image
          source={require("@/assets/images/facescanner.png")}
          style={styles.facescanner}
        />
        <Image
          source={require("@/assets/images/arrows.png")}
          style={styles.arrows}
        />
        <Text style={styles.login}> Login </Text>
        <Text style={styles.as}> as </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.navigate("/student-signup")} // Navigate to the Login screen
        >
          <Text style={styles.buttonStudent}>Student</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonparent}
          onPress={() => router.navigate("/parent-signup")} // Navigate to the Login screen
        >
          <Text style={styles.buttonParent}>Parent</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  login: {
    fontSize: 48,
    fontWeight: "500",
    top: -610,
    color: "#fff",
    fontFamily: "Kanit-SemiBold",
    textShadowColor: "#000", // Shadow color (black in this case)
    textShadowOffset: { width: 2, height: 2 }, // Offset of the shadow (you can adjust these values)
    textShadowRadius: 8, // Blur radius (higher values make the shadow more diffuse)
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 15, // Vertical padding for button
    paddingHorizontal: 40, // Horizontal padding for button
    borderRadius: 50, // Rounded corners
    elevation: 3, // Shadow effect (on Android)
    shadowColor: "#000", // Shadow color (iOS)
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.2, // Shadow opacity (iOS)
    shadowRadius: 5, // Shadow blur radius (iOS)
    width: 152,
    height: 68,
    top: -600,
    left: 5,
    alignContent: "center",
  },
  buttonparent: {
    backgroundColor: "#fff",
    paddingVertical: 15, // Vertical padding for button
    paddingHorizontal: 40, // Horizontal padding for button
    borderRadius: 50, // Rounded corners
    elevation: 3, // Shadow effect (on Android)
    shadowColor: "#000", // Shadow color (iOS)
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.2, // Shadow opacity (iOS)
    shadowRadius: 5, // Shadow blur radius (iOS)
    width: 152,
    height: 68,
    top: -550,
    left: 5,
    alignContent: "center",
  },
  buttonStudent: {
    fontWeight: "500",
    fontSize: 20,
    color: "#12314D",
    alignSelf: "center",
    fontFamily: "Kanit-SemiBold",
    top: 5,
  },
  buttonParent: {
    fontWeight: "500",
    fontSize: 20,
    color: "#12314D",
    alignSelf: "center",
    top: 5,
    fontFamily: "Kanit-SemiBold",
  },
  as: {
    fontSize: 32,
    fontWeight: "500",
    top: -610,
    color: "#fff",
    fontFamily: "Kanit-SemiBold",
    textShadowColor: "#000", // Shadow color (black in this case)
    textShadowOffset: { width: 2, height: 2 }, // Offset of the shadow (you can adjust these values)
    textShadowRadius: 8, // Blur radius (higher values make the shadow more diffuse)
  },
  facescanner: {
    width: 57,
    height: 61,
    top: -780,
    right: 150,
  },
  arrows: {
    width: 22,
    height: 19,
    top: -800,
    right: 170,
  },
  bluecircle: {
    width: 550,
    height: 550,
    borderRadius: 270, // This makes it a circle
    backgroundColor: "#0E2C6E", // Blue color for the circle
    left: 75,
    top: 530,
  },
  bluecircle2: {
    width: 640,
    height: 590,
    borderRadius: 295, // This makes it a circle
    backgroundColor: "#0E2C6E", // Blue color for the circle
    left: 10,
    bottom: -50,
  },
});
