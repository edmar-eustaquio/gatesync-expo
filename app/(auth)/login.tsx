import { router } from "expo-router";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import useFirebaseHook from "@/hooks/useFirebaseHook";
import { useAppContext } from "@/AppProvider";
import LoadingWrapper from "@/components/LoadingWrapper";
// import LinearGradient from 'react-native-linear-gradient';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // Added state

  const { isLoading, dispatch } = useFirebaseHook();
  const { setUser } = useAppContext();

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    dispatch({
      process: async ({ find }) => {
        // Ensure Firebase Auth is correctly referenced
        const cred = await signInWithEmailAndPassword(auth, email, password);

        const userDoc = await find("users", cred.user.uid);

        const userData = userDoc.data();
        setUser({
          id: cred.user.uid,
          ...userData,
        });
        router.replace("/(studenttabs)");
      },
      onError: (error) => {
        console.error("Error logging in:", error);
        Alert.alert("Error", `${error}`);
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.bluecircle} />
      {/* <LinearGradient
        colors={['#5cb8ff', '#6b9bfa']}
        style={styles.bluecircle2}
      /> */}
      {/* <Text style={styles.heading}>Student</Text> */}
      <Text style={styles.heading}>Login</Text>
      {/* <TouchableOpacity onPress={() => navigation.navigate('LoginOption')}> */}
      {/* <Image
        source={require("@/assets/images/arrow_back.png")}
        style={styles.arrow}
      /> */}
      {/* </TouchableOpacity> */}
      <Image
        source={require("@/assets/images/facescanner.png")}
        style={styles.facescanner}
      />
      <Image
        source={require("@/assets/images/arrows.png")}
        style={styles.arrows1}
      />

      {/* Input Container */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
        // keyboardVerticalOffset={100}
      >
        <Text style={styles.email}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#686D76"
          keyboardType="email-address"
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
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <LoadingWrapper loading={isLoading}>
            <Text style={styles.buttonText}>Login</Text>
          </LoadingWrapper>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={ ()=> navigation.navigate('ForgotPassword')}> */}
        <Text style={styles.forgotpassword}>Forgot Password</Text>
        {/* </TouchableOpacity> */}
      </KeyboardAvoidingView>

      <Text style={styles.haveacc}>Don't have an account?</Text>
      <TouchableOpacity
        style={styles.registerLink}
        onPress={() => router.navigate("/signup")}
      >
        <Text
          style={styles.registerText}
          onPress={() => router.navigate("/register-options")}
        >
          Register here
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  heading: {
    fontSize: 48,
    fontWeight: "800",
    color: "#fff",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 8,
    top: "7%",
  },
  arrow: {
    width: 53,
    height: 49,
    position: "absolute",
    top: -95,
    left: "-45%",
  },
  facescanner: {
    width: 57,
    height: 61,
    position: "absolute",
    top: 50,
    left: 25,
  },
  arrows1: {
    width: 22,
    height: 19,
    position: "absolute",
    top: 95,
    left: 65,
  },
  bluecircle: {
    position: "absolute",
    width: 550,
    height: 550,
    borderRadius: 275,
    backgroundColor: "#0E2C6E",
    top: 80,
    left: 40,
  },
  bluecircle2: {
    position: "absolute",
    width: 490,
    height: 880,
    borderTopLeftRadius: 180,
    borderTopRightRadius: 340,
    top: 100,
    left: -45,
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
  inputContainer: {
    width: "90%",
    padding: 20,
    height: 330,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 100,
    bottom: "-10%",
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 15,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  email: {
    color: "black",
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 10,
  },
  password: {
    color: "black",
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 10,
  },
  forgotpassword: {
    color: "black",
    fontSize: 14,
    textDecorationLine: "underline",
    textAlign: "right",
    alignSelf: "center",
    top: 10,
  },
  button: {
    backgroundColor: "#000",
    width: "95%",
    height: 43,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    bottom: 10,
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  haveacc: {
    color: "black",
    fontSize: 16,
    fontWeight: "400",
    top: "1%",
  },
  registerLink: {
    top: "1%",
  },
  registerText: {
    color: "#0000FF",
    fontSize: 16,
  },
});
