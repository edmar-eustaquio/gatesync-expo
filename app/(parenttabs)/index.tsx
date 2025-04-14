import { useAppContext } from "@/AppProvider";
import ParentTopBar from "@/components/ParentTopBar";
import { db } from "@/firebase";
import useFirebaseHook from "@/hooks/useFirebaseHook";
import useScreenFocusHook from "@/hooks/useScreenFocusHook";
import { router } from "expo-router";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
  StatusBar,
  ScrollView,
  BackHandler,
  Alert,
} from "react-native";
import tw from "tailwind-react-native-classnames";

const ParentHomeScreen = () => {
  const [schedule, setSchedule] = useState<{}[]>([]);
  const { user } = useAppContext();
  const { isLoading, dispatch } = useFirebaseHook();

  useScreenFocusHook(() => {
    let unsubs: any = null;
    dispatch({
      process: async ({ get, where }) => {
        const snap = await get(
          "linkings",
          where("status", "==", "Accepted"),
          where("parentId", "==", user?.id)
        );
        const ids = snap.docs.map((dc) => dc.data().studentId);
        if (ids.length == 0) {
          setSchedule([]);
          return;
        }

        unsubs = onSnapshot(
          query(
            collection(db, "schedules"),
            where("studentId", "in", ids),
            orderBy("date", "desc")
          ),
          (scheduleSnapshot) => {
            setSchedule(scheduleSnapshot.docs.map((doc) => doc.data()));
          }
        );
      },
      onError: (err) => {
        console.log(err);
      },
    });

    return () => {
      unsubs && unsubs();
    };
  });

  return (
    <>
      <ParentTopBar title="Home" />

      <View style={styles.container}>
        {/* Link Children Section */}
        <View style={styles.linkcontainer}>
          <TouchableOpacity onPress={() => router.navigate("/linked-children")}>
            <View style={styles.button}>
              <Image
                source={require("@/assets/images/parent_.png")}
                style={styles.parenticon}
              />
              <Image
                source={require("@/assets/images/relationship.png")}
                style={styles.relationicon}
              />
            </View>
          </TouchableOpacity>
          <Image
            source={require("@/assets/images/arrowright.png")}
            style={styles.arrowicon}
          />
          <Text style={styles.Text}> Link with Son / </Text>
          <Text style={styles.Text1}> Daughter</Text>
        </View>

        {/* Class Schedule Section */}
        <View style={styles.schedcontainer}>
          <View style={styles.titlecontainer}>
            <Text style={styles.titleschedule}> Class Hours</Text>
          </View>

          {/* Displaying schedule in table format */}
          {/* Outer ScrollView for vertical scrolling */}
          <ScrollView style={{ flex: 1 }}>
            {/* Inner ScrollView for horizontal scrolling */}
            <ScrollView
              horizontal={true}
              contentContainerStyle={styles.scheduleTable}
            >
              <View>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderText}>Name</Text>
                  <Text style={styles.tableHeaderText}>Date</Text>
                  <Text style={styles.tableHeaderText1}>Class Start</Text>
                  <Text style={styles.tableHeaderText2}>Class End</Text>
                </View>

                {/* Table Rows */}
                {schedule.length > 0 ? (
                  schedule.map((sched: any, index) => (
                    <View key={index} style={styles.tableRow}>
                      <Text style={styles.tableCell1}>{sched.studentName}</Text>
                      <Text style={styles.tableCell2}>{sched.date}</Text>
                      <Text style={styles.tableCell3}>{sched.timeIn}</Text>
                      <Text style={styles.tableCell4}>{sched.timeOut}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={tw``}>No class schedule found</Text>
                )}
              </View>
            </ScrollView>
          </ScrollView>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  navbar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
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
    zIndex: 1000,
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
  },
  gatesync: {
    width: 100,
    height: 34,
    resizeMode: "contain",
  },
  menuIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  profileIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlay: {
    flex: 1,
  },
  slideMenu: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "80%",
    backgroundColor: "#fff",
    height: "100%",
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
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
  linkcontainer: {
    width: "90%",
    height: 124,
    alignSelf: "center",
    backgroundColor: "#cfe5ff",
    borderRadius: 21,
    shadowColor: "black",
    shadowOffset: { width: 4, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    top: 20,
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 21,
    height: 80,
    width: 100,
    top: 25,
    left: 20,
    shadowColor: "black",
    shadowOffset: { width: 4, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  parenticon: {
    width: 60,
    height: 42,
    top: 25,
    alignSelf: "center",
  },
  relationicon: {
    width: 30,
    height: 25,
    left: 55,
    top: -35,
  },
  arrowicon: {
    top: -60,
    left: 115,
  },
  Text: {
    fontWeight: "800",
    fontSize: 20,
    color: "#2488e5",
    top: -125,
    left: 185,
  },
  Text1: {
    fontWeight: "800",
    fontSize: 20,
    color: "#2488e5",
    top: -125,
    left: 185,
  },
  schedcontainer: {
    width: "90%",
    height: 456,
    backgroundColor: "#BCE5FF",
    shadowColor: "black",
    shadowOffset: { width: 4, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    top: 35,
    alignSelf: "center",
    borderRadius: 21,
  },
  titlecontainer: {
    width: "95%",
    height: 60,
    backgroundColor: "#6B9BFA",
    alignSelf: "center",
    borderRadius: 21,
    top: 10,
  },
  titleschedule: {
    alignSelf: "center",
    fontWeight: "800",
    fontSize: 20,
    color: "#E9F3FF",
    top: 15,
  },
  scheduleTable: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E9F3FF",
    paddingVertical: 10,
  },
  tableHeaderText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    width: "30%",
  },
  tableHeaderText1: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    width: "30%",
    right: 7,
  },
  tableHeaderText2: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    width: "30%",
    right: 7,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E9F3FF",
  },
  tableCell1: {
    fontSize: 16,
    color: "#111",
    fontWeight: "500",
    width: "30%",
  },
  tableCell2: {
    fontSize: 16,
    color: "#666",
    width: "30%",
    right: 14,
  },
  tableCell3: {
    fontSize: 16,
    color: "#666",
    width: "30%",
    left: 5,
  },
  tableCell4: {
    fontSize: 16,
    color: "#666",
    width: "30%",
    left: 4,
  },
  schedule: {
    fontSize: 15,
    alignSelf: "center",
    color: "#9AA6B2",
    top: 120,
  },
});

export default ParentHomeScreen;
