import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { AppProvider, useAppContext } from "@/AppProvider";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function Nav() {
  const { user } = useAppContext();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
      <Stack.Screen
        name="(auth)/register-options"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(auth)/student-signup"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(auth)/parent-signup"
        options={{ headerShown: false }}
      />
      {/* {user?.role == "Student" && ( */}
      <Stack.Screen name="(studenttabs)" options={{ headerShown: false }} />
      {/* )}
      {user?.role == "Parent" && ( */}
      <Stack.Screen name="(parenttabs)" options={{ headerShown: false }} />
      {/* )} */}
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AppProvider>
      <Nav />
      <StatusBar style="auto" />
    </AppProvider>
  );
}
