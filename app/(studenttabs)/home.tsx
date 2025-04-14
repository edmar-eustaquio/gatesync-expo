import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";

import { router } from "expo-router";
import StudentTopBar from "@/components/StudentTopBar";

export default function HomeScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <StudentTopBar title="Home" />

      <ScrollView style={styles.container}>
        <Text style={styles.welcomeText}>Dashboard</Text>
        <TouchableOpacity onPress={() => router.navigate("/qr-code")}>
          <View style={styles.qrbutton}>
            <Image
              source={require("@/assets/images/QR.png")}
              style={styles.QRcode}
            />
            <Text style={styles.scanqr}> View</Text>
            <Text style={styles.scanqr}> Your QR </Text>
            <Text style={styles.scanqr}> Code. </Text>
          </View>
        </TouchableOpacity>

        {/* Other Widgets and Buttons */}
        <View style={styles.widget}>
          <TouchableOpacity
            style={styles.widgetbutton}
            onPress={() => router.navigate("/linked-parents")}
          >
            <Image
              source={require("@/assets/images/parent_.png")}
              style={styles.parent}
            />
            <Image
              source={require("@/assets/images/relationship.png")}
              style={styles.relationship}
            />
          </TouchableOpacity>
          <Image
            source={require("@/assets/images/arrowright.png")}
            style={styles.arrowright}
          />
          <Text style={styles.linkparent}> Link with</Text>
          <Text style={styles.linkparent}> Parents</Text>

          <View style={styles.line} />

          <TouchableOpacity
            style={styles.widgetbutton2}
            onPress={() => router.navigate("/logs")}
          >
            <Image
              source={require("@/assets/images/logs.png")}
              style={styles.logicon}
            />
          </TouchableOpacity>
          <Image
            source={require("@/assets/images/arrowleft.png")}
            style={styles.arrowleft}
          />
          <Text style={styles.logs}>Activity</Text>
          <Text style={styles.logs}>Logs</Text>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            flexDirection: "row",
            marginTop: 20,
            marginBottom: 30,
          }}
        >
          {/* Emergency Leave Button */}
          <TouchableOpacity
            style={styles.leave}
            onPress={() => router.navigate("/add-emergency")}
          >
            <Image
              source={require("@/assets/images/exit.png")}
              style={styles.exiticon}
            />
            <Text style={styles.emergency}>Emergency</Text>
            <Text style={styles.emergency}>Leave?</Text>
          </TouchableOpacity>

          {/* Emergency Leave Button */}
          <TouchableOpacity
            style={styles.class}
            onPress={() => router.navigate("/add-schedule")}
          >
            <Image
              source={require("@/assets/images/add-schedule.png")}
              style={styles.schedicon}
            />
            <Text style={styles.schedule}>Add</Text>
            <Text style={styles.schedule}>Schedule</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#BCE5FF", // Background color for the navigation bar
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  navCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewqr: {
    width: "90%",
    height: 61,
    borderRadius: 21,
    backgroundColor: "#6b9bfa",
    justifyContent: "center",
    top: "-50%",
    alignSelf: "center",
    // Shadow for iOS
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Offset for shadow
    shadowOpacity: 0.3, // Opacity of the shadow
    shadowRadius: 4, // Blur radius of the shadow
    // Shadow for Android
    elevation: 6, // Elevation level for Android
  },
  leave: {
    width: "42%",
    height: 80,
    backgroundColor: "#0E46A3",
    borderRadius: 21,
    shadowColor: "black", // Shadow color (iOS)
    shadowOffset: { width: 4, height: 2 }, // Shadow offset (iOS)
    shadowOpacity: 0.3, // Shadow opacity (iOS)
    shadowRadius: 4, // Shadow radius (iOS)
    elevation: 5, // Shadow for Android
  },
  exiticon: {
    width: 45,
    height: 43,
    right: "-70%",
    top: "25%",
  },
  emergency: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 2,
    fontFamily: "Kanit-SemiBold",
    fontWeight: "900",
    right: "-7%",
    top: "-25%",
  },
  class: {
    width: "42%",
    height: 80,
    backgroundColor: "#08C2FF",
    borderRadius: 21,
    shadowColor: "black", // Shadow color (iOS)
    shadowOffset: { width: 4, height: 2 }, // Shadow offset (iOS)
    shadowOpacity: 0.3, // Shadow opacity (iOS)
    shadowRadius: 4, // Shadow radius (iOS)
    elevation: 5, // Shadow for Android
  },
  schedicon: {
    width: 45,
    height: 43,
    right: "-70%",
    top: "25%",
  },
  schedule: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 3,
    fontFamily: "Kanit-SemiBold",
    fontWeight: "900",
    right: "-7%",
    top: "-25%",
  },
  line: {
    width: "90%",
    height: 3,
    alignSelf: "center",
    backgroundColor: "#6B9BFA",
    top: "-35%",
  },
  viewqrcode: {
    fontFamily: "Kanit-SemiBold",
    fontSize: 20,
    color: "#fff",
    fontWeight: "900",
    alignSelf: "center",
  },
  widget: {
    width: "100%",
    height: 250,
    backgroundColor: "#CFE5FF",
    marginTop: 40,
    alignSelf: "center",
    borderRadius: 21,
    shadowColor: "black", // Shadow color (iOS)
    shadowOffset: { width: 4, height: 2 }, // Shadow offset (iOS)
    shadowOpacity: 0.3, // Shadow opacity (iOS)
    shadowRadius: 4, // Shadow radius (iOS)
    elevation: 5, // Shadow for Android
  },
  widgetbutton: {
    width: 90,
    height: 80,
    backgroundColor: "#FFF",
    top: "10%",
    left: "7%",
    borderRadius: 21,
    shadowColor: "black", // Shadow color (iOS)
    shadowOffset: { width: 4, height: 2 }, // Shadow offset (iOS)
    shadowOpacity: 0.3, // Shadow opacity (iOS)
    shadowRadius: 4, // Shadow radius (iOS)
    elevation: 5, // Shadow for Android
  },
  widgetbutton2: {
    width: 90,
    height: 80,
    backgroundColor: "#FFF",
    top: "-30%",
    right: "-63%",
    borderRadius: 21,
    shadowColor: "black", // Shadow color (iOS)
    shadowOffset: { width: 4, height: 2 }, // Shadow offset (iOS)
    shadowOpacity: 0.3, // Shadow opacity (iOS)
    shadowRadius: 4, // Shadow radius (iOS)
    elevation: 5, // Shadow for Android
  },
  parent: {
    width: 60,
    height: 40,
    right: "-15%",
    top: "30%",
  },
  logicon: {
    width: 65,
    height: 63,
    right: "-13%",
    top: "10%",
  },
  relationship: {
    width: 31,
    height: 25.59,
    right: "-55%",
    top: "-40%",
  },
  arrowright: {
    width: 87.5,
    height: 82.49,
    right: "-35%",
    top: "-23%",
  },
  arrowleft: {
    width: 87.5,
    height: 82.49,
    right: "-35%",
    top: "-63%",
  },
  linkparent: {
    color: "#2488E5",
    fontSize: 24,
    lineHeight: 29,
    letterSpacing: 3,
    fontFamily: "Kanit-SemiBold",
    fontWeight: "900",
    right: "-55%",
    top: "-51%",
  },
  logs: {
    color: "#2488E5",
    fontSize: 24,
    lineHeight: 29,
    letterSpacing: 3,
    fontFamily: "Kanit-SemiBold",
    fontWeight: "900",
    right: "-7%",
    top: "-92%",
  },
  qrbutton: {
    marginTop: 10,
    width: "100%",
    height: 170,
    borderRadius: 21,
    alignSelf: "center",
    backgroundColor: "#6B9BFA",
    // top: '49%',
    shadowColor: "black", // Shadow color (iOS)
    shadowOffset: { width: 4, height: 2 }, // Shadow offset (iOS)
    shadowOpacity: 0.3, // Shadow opacity (iOS)
    shadowRadius: 4, // Shadow radius (iOS)
    elevation: 5, // Shadow for Android
  },
  QRcode: {
    width: 216.68,
    height: 197.77,
    left: "40%",
    // top: '-30%',
  },
  scanqr: {
    fontSize: 25,
    fontFamily: "MartianMono-Regular",
    color: "#fff",
    fontWeight: "800",
    top: "-100%",
    left: "8%",
  },
  logo: {
    width: 35, // Adjust logo size
    height: 34, // Adjust logo size
    resizeMode: "contain", // Keep the aspect ratio of the logo
    marginRight: 10, // Space between logo and text
    shadowColor: "#000", // Shadow color (iOS)
    shadowOffset: { width: 0, height: 2 }, // Shadow offset (iOS)
    shadowOpacity: 0.3, // Shadow opacity (iOS)
    shadowRadius: 4, // Shadow radius (iOS)
    elevation: 5, // Shadow for Android
  },
  gatesync: {
    width: 100, // Adjust logo size
    height: 34, // Adjust logo size
    top: 5,
    resizeMode: "contain", // Keep the aspect ratio of the logo
    marginRight: 10, // Space between logo and text
    shadowColor: "#000", // Shadow color (iOS)
    shadowOffset: { width: 0, height: 2 }, // Shadow offset (iOS)
    shadowOpacity: 0.3, // Shadow opacity (iOS)
    shadowRadius: 4, // Shadow radius (iOS)
    elevation: 5, // Shadow for Android
  },
  menuIcon: {
    width: 30, // Adjust menu icon size
    height: 30, // Adjust menu icon size
    resizeMode: "contain",
  },
  navbarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff", // Text color
  },
  profileIcon: {
    width: 30, // Adjust profile icon size
    height: 30, // Adjust profile icon size
    resizeMode: "contain",
  },
  content: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: "800",
    color: "#5394F2",
    fontFamily: "Kanit-SemiBold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
    justifyContent: "flex-start",
  },
  overlay: {
    flex: 1,
    width: "100%",
  },
  slideMenu: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "80%", // Adjust the width as needed
    backgroundColor: "#fff",
    height: "100%",
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
  },
  menu: {
    flex: 1,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  menuOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  menuOptionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  profileDropdown: {
    position: "absolute",
    top: 70,
    right: 10,
    width: 150,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 999, // Ensure it appears above other elements
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
});
