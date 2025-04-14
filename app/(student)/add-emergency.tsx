import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { router } from "expo-router";
import useFirebaseHook from "@/hooks/useFirebaseHook";
import { useAppContext } from "@/AppProvider";
import LoadingWrapper from "@/components/LoadingWrapper";
import CustomTopbar from "@/components/CustomTopbar";

export default function addEmergency() {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const reasons = [
    "Medical Emergency",
    "Family Emergency",
    "No Class",
    "Other",
  ];

  const { isLoading, dispatch } = useFirebaseHook();
  const { user } = useAppContext();

  const handleSubmit = async () => {
    if (!selectedReason) {
      Alert.alert("Error", "Please select a reason.");
      return;
    }

    const reason = selectedReason === "Other" ? customReason : selectedReason;

    if (selectedReason === "Other" && !customReason.trim()) {
      Alert.alert("Error", "Please specify your custom reason.");
      return;
    }

    dispatch({
      process: async ({ get, where, add, serverTimestamp }) => {
        const emergencyData = {
          name: user?.name, // Save the username
          reason: reason,
          timestamp: serverTimestamp(),
          status: "Pending", // Set status to 'Pending'
          studentId: user?.id,
        };

        await add("emergencies", emergencyData);

        get(
          "linkings",
          where("studentId", "==", user?.id),
          where("status", "==", "Accepted")
        ).then(({ docs }) => {
          for (const dc of docs) {
            add("notifications", {
              receiverId: dc.data().parentId,
              title: "Emergency Status",
              message: `${user?.name} added emergency due to ${reason}.`,
              date: serverTimestamp(),
              prompt: false,
            });
          }
        });

        Alert.alert("Success", `Submitted Reason: ${reason}`);
      },
      onError: (error) => {
        console.error("Error saving emergency:", error);
        Alert.alert("Error", "Failed to submit the emergency reason.");
      },
    });
  };

  return (
    <>
      <CustomTopbar title="Add Emergency" />

      <View style={styles.container}>
        {/* Navigation Bar */}
        {/* <View style={styles.navbar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={require("@/assets/images/back.png")}
              style={styles.back}
            />
          </TouchableOpacity>
          <View style={styles.navCenter}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logo}
            />
            <Image
              source={require("@/assets/images/GateSync.png")}
              style={styles.gatesync}
            />
          </View>
        </View> */}

        {/* Text Container */}
        <View style={styles.textcontainer}>
          <Text style={styles.text}>This page allows users to submit</Text>
          <Text style={styles.text}>and manage leave requests. Please</Text>
          <Text style={styles.text}>specify the reason for your leave,</Text>
          <Text style={styles.text}>track the status of your requests,</Text>
          <Text style={styles.text}>and receive updates directly</Text>
          <Text style={styles.text}>within the system.</Text>
        </View>

        {/* Emergency Reason Selection */}
        <View style={styles.reasonSelectionContainer}>
          <Text style={styles.selectionTitle}>Select an Emergency Reason:</Text>
          {reasons.map((reason, index) => (
            <TouchableOpacity
              key={index}
              style={styles.reasonContainer}
              onPress={() => setSelectedReason(reason)}
            >
              <View style={styles.radioCircle}>
                {selectedReason === reason && (
                  <View style={styles.selectedCircle} />
                )}
              </View>
              <Text style={styles.reasonText}>{reason}</Text>
            </TouchableOpacity>
          ))}
          {selectedReason === "Other" && (
            <TextInput
              style={styles.input}
              placeholder="Please specify your reason"
              value={customReason}
              onChangeText={setCustomReason}
            />
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <LoadingWrapper loading={isLoading}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </LoadingWrapper>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
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
  textcontainer: {
    width: "100%",
    height: 170,
    backgroundColor: "#f6f6ff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    fontSize: 15,
    fontStyle: "italic",
    color: "#0e2c6e",
    left: "10%",
    top: "10%",
  },
  reasonSelectionContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: "#f6f6ff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  selectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#0e2c6e",
  },
  reasonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#0e2c6e",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  selectedCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#0e2c6e",
  },
  reasonText: {
    fontSize: 16,
    color: "#0e2c6e",
  },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 16,
    color: "#333",
  },
  submitButton: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: "#2488E5",
    borderRadius: 21,
    paddingVertical: 10,
    width: 96,
    height: 45,
    left: "5%",
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 15,
    color: "#FFF",
  },
});
