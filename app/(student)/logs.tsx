import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import {
  onSnapshot,
  query,
  collection,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase"; // Import your Firebase config
import { useAppContext } from "@/AppProvider";
import { DateTimeConverter } from "@/helper/DateTimeConverter";
import CustomTopbar from "@/components/CustomTopbar";

const MessageScreen = () => {
  const [activities, setActivities] = useState<any>([]);

  const { user } = useAppContext();

  useEffect(() => {
    const q = query(
      collection(db, "scanned_ids"),
      where("idNumber", "==", user?.idNumber),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.empty) {
        setActivities([]);
        return;
      }

      setActivities(
        querySnapshot.docs.map((doc: any) => {
          const data = doc.data();
          console.log("Fetched activity doc data:", data); // Log the document data

          return {
            description: data.description,
            timestamp: DateTimeConverter(data.date), // Safely format the timestamp
            status: data.status,
          };
        })
      );
    });
    // Clean up the listener when the component is unmounted
    return () => {
      unsubscribe();
    };
  }, []); // Empty dependency array means this runs only once when the component mounts

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <CustomTopbar title="Activity Logs" />

      {/* Main ScrollView */}
      <ScrollView style={styles.container}>
        <Text style={styles.welcomeText}>Activity Logs</Text>

        {/* Conditionally render the "No activities" container */}
        {activities.length == 0 ? (
          <View style={styles.noActivitiesContainer}>
            <Text style={styles.noActivitiesText}>No activities</Text>
          </View>
        ) : (
          // Render activities here if hasActivities is true
          activities.map((activity: any, index: number) => (
            <View key={index} style={styles.activityContainer}>
              <Text style={styles.timestampText}>
                Scan Time: {activity.timestamp}
              </Text>
              <Text style={styles.statusText}>Status: {activity.status}</Text>
            </View>
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
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#BCE5FF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  navCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 35,
    height: 34,
    resizeMode: "contain",
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    left: "-60%",
  },
  gatesync: {
    width: 100,
    height: 34,
    top: 5,
    resizeMode: "contain",
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    left: "-60%",
  },
  back: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: "800",
    fontFamily: "Kanit",
    color: "#5394F2",
    top: "10%",
  },
  noActivitiesContainer: {
    backgroundColor: "#FFCCCB",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  noActivitiesText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FF4C4C",
  },
  timestampText: {
    fontSize: 16,
    color: "#888",
    marginTop: 5,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  activityContainer: {
    marginTop: 30,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#BCE5FF",
    marginBottom: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    width: "90%",
    alignSelf: "center",
  },
});

export default MessageScreen;
