import { useAppContext } from "@/AppProvider";
import StudentTopBar from "@/components/StudentTopBar";
import { db } from "@/firebase";
import useScreenFocusHook from "@/hooks/useScreenFocusHook";
import { router } from "expo-router";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from "react-native";
import tw from "tailwind-react-native-classnames";

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState<
    { [field: string]: any }[]
  >([]);
  const [loaded, setLoaded] = useState(false);

  const { user } = useAppContext();

  useScreenFocusHook(() => {
    const unsubs = onSnapshot(
      query(
        collection(db, "notifications"),
        where("receiverId", "==", user?.id),
        orderBy("date", "desc")
      ),
      (snap) => {
        setNotifications(
          snap.docs.map((val) => ({ id: val.id, ...val.data() }))
        );

        if (!loaded) setLoaded(true);
      }
    );

    return () => {
      unsubs();
    };
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <StudentTopBar title="Notifications" />

      <View style={styles.box} />
      <Image
        source={require("@/assets/images/Updates.png")}
        style={styles.notificon}
      />
      <Text
        style={{
          position: "absolute",
          fontSize: 25,
          fontFamily: "MartianMono-Regular",
          color: "#fff",
          fontWeight: "800",
          top: 160,
          left: 40,
        }}
      >
        Notifications
      </Text>
      <Text
        style={{
          position: "absolute",
          fontSize: 25,
          fontFamily: "MartianMono-Regular",
          color: "#fff",
          fontWeight: "800",
          top: 190,
          left: 40,
        }}
      >
        List
      </Text>

      <View style={{ height: 180 }} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* <LinearGradient colors={['#6B9BFA', '#0056FF']} style={styles.notif} /> */}

        {!loaded ? (
          <ActivityIndicator
            style={{ position: "absolute", top: 70, left: 30, right: 30 }}
            size="large"
            color="#000000"
          />
        ) : notifications.length === 0 ? (
          <Text style={styles.noNotificationText}>No notifications yet.</Text>
        ) : (
          notifications.map((value: { [field: string]: any }) => (
            <TouchableOpacity
              key={value.id}
              style={tw`p-4 rounded-lg shadow-lg bg-white mb-3`}
              onPress={() => {
                if (value.route) router.navigate(value.route);
              }}
            >
              <Text style={tw`text-lg font-bold mb-1`}>{value.title}</Text>
              <Text>{value.message}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  box: {
    position: "absolute",
    top: 120,
    right: 15,
    left: 15,
    borderRadius: 18,
    height: 125,
    backgroundColor: "#0000FF",
  },
  notificon: {
    position: "absolute",
    top: 80,
    right: 25,
    width: 150,
    height: 160,
  },
  noNotificationText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#999",
    marginTop: 80,
    alignSelf: "center",
  },
  notificationText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginVertical: 5,
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
    left: "-67%",
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
    left: "-67%",
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
  welcomeText: {
    fontSize: 36,
    fontWeight: "800",
    fontFamily: "Kanit",
    color: "#5394F2",
    top: -30,
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
  notif: {
    width: "100%",
    height: 130,
    borderRadius: 21,
    alignSelf: "center",
    top: "-1%",
    shadowColor: "black", // Shadow color (iOS)
    shadowOffset: { width: 4, height: 2 }, // Shadow offset (iOS)
    shadowOpacity: 0.3, // Shadow opacity (iOS)
    shadowRadius: 4, // Shadow radius (iOS)
    elevation: 5, // Shadow for Android
  },

  linkedParentContainer: {
    padding: 25,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    top: "-30%",
    marginTop: 15,
    height: 170,
  },
  linkedParentText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  acceptButton: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    width: "40%",
    height: 45,
    backgroundColor: "#0059Ff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    left: "5%",
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: "40%",
    height: 45,
    marginTop: 10,
    left: "55%",
    top: -54,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default NotificationScreen;
