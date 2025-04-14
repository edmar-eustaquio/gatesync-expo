import LoadingWrapper from "@/components/LoadingWrapper";
import { auth } from "@/firebase";
import useFirebaseHook from "@/hooks/useFirebaseHook";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "tailwind-react-native-classnames";

export default function StudentSignup() {
  const [pickerVisibility, setPickerVisibility] = useState(false);
  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [course, setCourse] = useState(""); // Store selected course
  const [isModalVisible, setModalVisible] = useState(false);
  const [qrData, setQrData] = useState(""); // For storing QR code data
  const [passwordVisible, setPasswordVisible] = useState(false); // Added state

  const { isLoading, dispatch } = useFirebaseHook();

  const handleSignup = async () => {
    // Validate fields
    if (!name || !email || !password || !idNumber || !yearLevel || !course) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Validate ID number (maximum of 12 characters)
    if (idNumber.length > 12) {
      Alert.alert("Error", "ID number cannot be more than 12 characters");
      return;
    }

    // Validate email format (must be @gmail.com)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid Gmail address");
      return;
    }

    // Validate name (must not contain numbers)
    const usernameRegex = /^[^\d]*$/; // Regex to check if name contains digits
    if (!usernameRegex.test(name)) {
      Alert.alert("Error", "Username must not contain numbers");
      return;
    }

    dispatch({
      process: async ({ set, get, where }) => {
        const snap = await get("users", where("idNumber", "==", idNumber));
        if (snap.docs.length > 0) {
          Alert.alert("Error", "Student ID already exists");
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Step 2: Send a verification email
        // if (user) {
        await sendEmailVerification(user);
        //     Alert.alert('Verification Email Sent', 'Please check your inbox to verify your email address.');
        // }

        // Step 3: Prepare QR code data (e.g., ID number or unique identifier)
        const qrDataString = `${name}-${idNumber}`;
        // setQrData(qrDataString);

        // Step 4: Save user details and QR code data to Firestore (with 'uid')
        await set("users", user.uid, {
          name,
          email,
          idNumber,
          yearLevel,
          course,
          role: "Student",
          qrData: qrDataString,
        });

        // Step 5: Show success modal
        setModalVisible(true);
      },
      onError: (e) => {
        console.error("Error signing up:", e);
        Alert.alert(
          "Error",
          "An error occurred while signing up. Please try again."
        );
      },
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <KeyboardAvoidingView
        style={tw`flex-1 p-4 justify-center`}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={tw`flex-1 justify-center items-center`}
        >
          {/* <View
          style={{
            position: "absolute",
            width: 550,
            height: 550,
            borderRadius: 275,
            backgroundColor: "#0E2C6E",
            top: 80,
            left: 40,
          }}
        /> */}
          <View style={tw`w-full flex-row justify-between`}>
            <MaterialIcons
              name="arrow-back"
              size={35}
              onPress={() => router.back()}
            />
            <Text style={tw`text-3xl font-bold`}>Student Signup</Text>
            <View style={{ width: 35 }}></View>
          </View>

          <View style={tw`w-full bg-white rounded-lg mt-4 p-5 shadow-lg`}>
            <Text style={tw`text-base`}>Name</Text>
            <TextInput
              style={tw`w-full p-3 text-base mb-2 mt-1 border border-gray-400 rounded-lg bg-white`}
              placeholder="Enter name"
              value={name}
              onChangeText={setUsername}
              placeholderTextColor={"#686D76"}
            />
            <View style={tw`flex-row`}>
              <View style={tw`flex-1 mr-2`}>
                <Text style={tw`text-base`}>ID Number</Text>
                <TextInput
                  style={tw`w-full p-3 text-base mb-2 mt-1 border border-gray-400 rounded-lg bg-white`}
                  placeholder="Enter id number"
                  value={idNumber}
                  onChangeText={setIdNumber}
                  keyboardType="numeric"
                  placeholderTextColor={"#686D76"}
                />
              </View>
              <View style={tw`flex-1 ml-2`}>
                <Text style={tw`text-base`}>Year Level</Text>
                <TextInput
                  style={tw`w-full p-3 text-base mb-2 mt-1 border border-gray-400 rounded-lg bg-white`}
                  placeholder="Enter year level"
                  value={yearLevel}
                  keyboardType="numeric"
                  onChangeText={setYearLevel}
                  placeholderTextColor={"#686D76"}
                />
              </View>
            </View>

            <Text style={tw`text-base`}>Course</Text>
            <TouchableOpacity
              style={tw`w-full p-3 text-base mb-2 mt-1 border border-gray-400 rounded-lg bg-white`}
              onPress={() => setPickerVisibility(!pickerVisibility)}
            >
              <Text style={tw`text-lg`}>
                {course == "" ? "Select Course" : course}
              </Text>
            </TouchableOpacity>
            {pickerVisibility && (
              <Picker
                style={[
                  tw`w-full bg-gray-600 rounded-lg`,
                  { borderColor: "#ddd", height: 200 },
                ]}
                selectedValue={course}
                onValueChange={(value) => {
                  setCourse(value);
                  setPickerVisibility(false);
                }}
              >
                <Picker.Item label="Select Course" value="" />
                <Picker.Item label="BSIT" value="BSIT" />
                <Picker.Item label="BSHM" value="BSHM" />
                <Picker.Item label="CRIM" value="CRIM" />
                <Picker.Item label="BSED" value="BSED" />
                <Picker.Item label="BSBA" value="BSBA" />
                <Picker.Item label="BSTM" value="BSTM" />
                <Picker.Item label="BSIS" value="BSIS" />
                <Picker.Item
                  label="Senior High School"
                  value="Senior High School"
                />
              </Picker>
            )}
            <Text style={tw`text-base`}>Email</Text>
            <TextInput
              style={tw`w-full p-3 text-base mb-2 mt-1 border border-gray-400 rounded-lg bg-white`}
              placeholder="Enter email"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor={"#686D76"}
            />
            <Text style={tw`text-base`}>Password</Text>
            <View style={tw`flex-row items-center`}>
              <TextInput
                style={tw`flex-1 p-3 text-base mb-2 mt-1 border border-gray-400 rounded-lg bg-white`}
                placeholder="Enter password"
                secureTextEntry={!passwordVisible} // Corrected
                value={password}
                onChangeText={setPassword}
                placeholderTextColor={"#686D76"}
              />

              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={tw`p-2 absolute right-2`}
              >
                <Image
                  source={
                    passwordVisible
                      ? require("@/assets/images/visible.png") // Eye open
                      : require("@/assets/images/eye.png") // Eye closed
                  }
                  style={{ width: 24, height: 24, tintColor: "gray" }}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: "#000",
                width: "100%",
                height: 43,
                marginTop: 10,
                borderRadius: 8,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={handleSignup}
            >
              <LoadingWrapper loading={isLoading}>
                <Text
                  style={{
                    fontSize: 18,
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  Sign up
                </Text>
              </LoadingWrapper>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "80%",
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Image
                source={require("@/assets/images/Check.png")} // Replace with your custom image
                style={{
                  width: 50,
                  height: 50,
                }}
              />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  marginTop: 20,
                }}
              >
                Registration Successful!
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: "center",
                  marginVertical: 10,
                }}
              >
                Welcome, {name}! You have successfully registered.
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "#000",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  marginTop: 20,
                }}
                onPress={() => {
                  setModalVisible(false);
                  router.navigate("/login");
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 16,
                  }}
                >
                  Go to Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
