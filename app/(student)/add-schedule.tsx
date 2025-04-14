import { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { Calendar } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAppContext } from "@/AppProvider";
import useFirebaseHook from "@/hooks/useFirebaseHook";
import { router } from "expo-router";
import LoadingWrapper from "@/components/LoadingWrapper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const ScheduleScreen = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [timeIn, setTimeIn] = useState(new Date());
  const [timeOut, setTimeOut] = useState(new Date());
  const [showTimeInPicker, setShowTimeInPicker] = useState(false);
  const [showTimeOutPicker, setShowTimeOutPicker] = useState(false);
  // const [userSchedules, setUserSchedules] = useState<
  //   { [field: string]: any }[]
  // >([]);

  const { user } = useAppContext();
  const { isLoading, dispatch } = useFirebaseHook();

  // useEffect(() => {
  //   dispatch({
  //     process: async ({ get, where }) => {
  //       const snap = await get("schedules", where("studentId", "==", user?.id));
  //       setUserSchedules(snap.docs.map((doc) => ({ ...doc.data() })));
  //     },
  //     onError: (error) => {
  //       console.error("Error fetching schedule:", error);
  //     },
  //   });
  // }, []);

  const onChangeTimeIn = (event: any, selectedTime: any) => {
    const currentTime = selectedTime || timeIn;
    setShowTimeInPicker(false);
    setTimeIn(currentTime);
  };

  const onChangeTimeOut = (event: any, selectedTime: any) => {
    const currentTime = selectedTime || timeOut;
    setShowTimeOutPicker(false);
    setTimeOut(currentTime);
  };

  const handleSave = () =>
    dispatch({
      process: async ({ get, where, add, serverTimestamp }) => {
        const scheduleData = {
          date: selectedDate,
          timeIn: timeIn.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          timeOut: timeOut.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          timestamp: serverTimestamp(),
          studentId: user?.id, // Updated field name
          studentName: user?.name, // Updated field name
        };

        await add("schedules", scheduleData);

        get(
          "linkings",
          where("studentId", "==", user?.id),
          where("status", "==", "Accepted")
        ).then(({ docs }) => {
          for (const dc of docs) {
            add("notifications", {
              receiverId: dc.data().parentId,
              title: "Schedule Status",
              message: `Added new schedule.`,
              date: serverTimestamp(),
              prompt: false,
            });
          }
        });

        Alert.alert("Success", "Schedule saved successfully.");
      },
      onError: (error) => {
        console.error("Error saving schedule:", error);
        Alert.alert("Error", "Failed to save schedule.");
      },
    });

  return (
    <View style={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.navbar}>
          <TouchableOpacity onPress={() => router.back()}>
            {/* <Image
              source={require("@/assets/images/back.png")}
              style={styles.back}
            /> */}
            <MaterialIcons
              style={{ color: "#fff" }}
              size={20}
              name="arrow-back"
            />
          </TouchableOpacity>
          <View style={styles.navCenter}>
            <Text style={{ color: "#fff", fontSize: 17, fontWeight: 700 }}>
              Add Schedule
            </Text>
            {/* <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logo}
            />
            <Image
              source={require("@/assets/images/GateSync.png")}
              style={styles.gatesync}
            /> */}
          </View>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <LoadingWrapper loading={isLoading}>
              <Text style={styles.saveButtonText}>Save</Text>
            </LoadingWrapper>
          </TouchableOpacity>
        </View>

        {/* Calendar Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Select Date:</Text>
          <Calendar
            onDayPress={(day: any) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: "#007bff" },
            }}
            theme={{
              selectedDayBackgroundColor: "#007bff",
              todayTextColor: "#007bff",
              arrowColor: "#007bff",
            }}
          />
          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>Selected Date:</Text>
            <Text style={styles.dateText}>{selectedDate}</Text>
          </View>
        </View>

        {/* Time In Picker */}
        <View style={styles.section}>
          <Text style={styles.label}>Time In:</Text>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowTimeInPicker(true)}
          >
            <Text style={styles.timeText}>
              {timeIn.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
          {showTimeInPicker && (
            <DateTimePicker
              value={timeIn}
              mode="time"
              display="spinner"
              onChange={onChangeTimeIn}
            />
          )}
        </View>

        {/* Time Out Picker */}
        <View style={styles.section}>
          <Text style={styles.label}>Time Out:</Text>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowTimeOutPicker(true)}
          >
            <Text style={styles.timeText}>
              {timeOut.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
          {showTimeOutPicker && (
            <DateTimePicker
              value={timeOut}
              mode="time"
              display="spinner"
              onChange={onChangeTimeOut}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 10,
  },
  dateContainer: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#e9ecef",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  dateLabel: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
  },
  timeButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#e9ecef",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  timeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
  },
  navbar: {
    width: "115%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#5FA7FF",
    // backgroundColor: "#BCE5FF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: "absolute",
    top: 0,
    zIndex: 10,
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
  back: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  saveButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#007bff",
    borderRadius: 5,
    marginRight: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ScheduleScreen;
