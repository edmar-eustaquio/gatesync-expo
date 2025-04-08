import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Modal,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
// import LinearGradient from "react-native-linear-gradient";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "@/firebase";
// import QRCode from 'react-native-qrcode-svg';
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import useFirebaseHook from "@/hooks/useFirebaseHook";

export default function signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [course, setCourse] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // Added state
  const [isModalVisible, setModalVisible] = useState(false);

  const { isLoading, dispatch } = useFirebaseHook();

  const handleSignup = async () => {
    // Validate fields
    if (
      !username ||
      !email ||
      !password ||
      !idNumber ||
      !yearLevel ||
      !course
    ) {
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

    // Validate username (must not contain numbers)
    const usernameRegex = /^[^\d]*$/; // Regex to check if username contains digits
    if (!usernameRegex.test(username)) {
      Alert.alert("Error", "Username must not contain numbers");
      return;
    }

    dispatch({
        process: async ({add})=>{
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            // Step 2: Send a verification email
            // if (user) {
            //     await sendEmailVerification(user);
            //     Alert.alert('Verification Email Sent', 'Please check your inbox to verify your email address.');
            // }
    
            // Step 3: Prepare QR code data (e.g., ID number or unique identifier)
            const qrDataString = `${username}-${idNumber}`;
            // setQrData(qrDataString);
    
            // Step 4: Save user details and QR code data to Firestore (with 'uid')
            await add('students', {
                username,
                email,
                idNumber,
                yearLevel,
                course,
                qrData: qrDataString,
                uid: user.uid, // Store the signed-in user's UID
            });
    
            // Step 5: Show success modal
            setModalVisible(true);
        },
        onError: e => {
            console.error('Error signing up:', e);
            Alert.alert('Error', 'An error occurred while signing up. Please try again.');
        }
    })
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.inner}>
          <View style={styles.bluecircle} />
          <View
            // colors={["#5cb8ff", "#6b9bfa"]}
            style={styles.bluecircle2}
          />

          <Text style={styles.heading}>Sign Up</Text>

          <Image
            source={require("@/assets/images/facescanner.png")}
            style={styles.facescanner}
          />
          <Image
            source={require("@/assets/images/arrows.png")}
            style={styles.arrows1}
          />
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={require("@/assets/images/arrow_back.png")}
              style={styles.arrow}
            />
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Username"
              value={username}
              onChangeText={setUsername}
              placeholderTextColor={"#686D76"}
            />

            <View style={styles.row}>
              <View style={styles.inputHalf}>
                <Text style={styles.label}>ID Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter ID Number"
                  value={idNumber}
                  onChangeText={setIdNumber}
                  placeholderTextColor={"#686D76"}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputHalf}>
                <Text style={styles.label}>Year Level</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Year Level"
                  value={yearLevel}
                  onChangeText={setYearLevel}
                  placeholderTextColor={"#686D76"}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Text style={styles.label}>Course</Text>
            <Picker
              style={styles.picker}
              selectedValue={course}
              onValueChange={setCourse}
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

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor={"#686D76"}
            />

            <Text style={styles.password}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.inputPassword}
                placeholder="Password"
                secureTextEntry={!passwordVisible} // Corrected
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#686D76"
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={styles.eyeIcon}
              >
                <Image
                  source={
                    passwordVisible
                      ? require("@/assets/images/visible.png") // Eye open
                      : require("@/assets/images/eye.png") // Eye closed
                  }
                  style={styles.eyeImage}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <ActivityIndicator size="small" color="#666" />
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>

          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Image
                  source={require("@/assets/images/Check.png")} // Replace with your custom image
                  style={styles.modalImage}
                />
                <Text style={styles.modalTitle}>Registration Successful!</Text>
                <Text style={styles.modalMessage}>
                  Welcome, {username}! You have successfully registered.
                </Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setModalVisible(false);
                    router.replace("/login");
                  }}
                >
                  <Text style={styles.modalButtonText}>Go to Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  heading: {
    fontSize: 38,
    fontWeight: "500",
    bottom: 610,
    color: "#fff",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 8,
  },
  arrow: {
    width: 53,
    height: 49,
    top: -735,
    right: 150,
  },
  facescanner: {
    width: 57,
    height: 61,
    top: -730,
    right: 150,
  },
  arrows1: {
    width: 22,
    height: 19,
    top: -750,
    right: 170,
  },
  bluecircle: {
    width: 550,
    height: 550,
    borderRadius: 270,
    backgroundColor: "#0E2C6E",
    left: 150,
    bottom: -800,
  },
  bluecircle2: {
    width: 490,
    height: 880,
    borderTopLeftRadius: 180,
    borderTopRightRadius: 340,
    backgroundColor: "#0E2C6E",
    left: 5,
    bottom: -255,
  },
  inputContainer: {
    width: "100%",
    height: 570,
    bottom: 730,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    color: "black",
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 15,
    backgroundColor: "#fff",
  },
  picker: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 15,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputHalf: {
    width: "48%", // 48% to leave some space between inputs
  },
  button: {
    backgroundColor: "#000",
    width: "85%",
    height: 43,
    // top: "-110%",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    top: 8,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalImage: {
    width: 50,
    height: 50,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
  modalButton: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 15,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  inputPassword: { flex: 1, padding: 15, color: "black" },
  eyeIcon: { padding: 10 },
  eyeImage: { width: 24, height: 24, tintColor: "gray" },
  password: {
    color: "black",
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 10,
  },
});
