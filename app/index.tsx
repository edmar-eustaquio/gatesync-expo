import { useAppContext } from "@/AppProvider";
import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Image, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const { setUser, pendingRoute, setPendingRoute } = useAppContext();

  useEffect(() => {
    if (!rootNavigationState?.key) return;

    if (pendingRoute) {
      router.replace(pendingRoute);
      setPendingRoute(null);
      return;
    }

    const check = async () => {
      try {
        const email = await AsyncStorage.getItem("email");
        const password = await AsyncStorage.getItem("password");

        if (!email || !password) {
          router.replace("/login");
          return;
        }

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        const userData: any = userDoc.data();

        setUser({
          id: userCredential.user.uid,
          ...userData,
        });

        router.replace(
          `/(${userData.role === "Parent" ? "parent" : "student"}tabs)/home`
        );
      } catch (e) {
        console.error("Auto login failed:", e);
        await AsyncStorage.removeItem("email");
        await AsyncStorage.removeItem("password");
        router.replace("/login");
      }
    };

    check();
  }, [rootNavigationState]);

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("@/assets/images/logo.png")}
        style={{
          width: 150,
          height: 150,
        }}
      />
    </View>
  );
}
