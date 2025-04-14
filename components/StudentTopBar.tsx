import { View } from "react-native";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import TopbarItem from "./TopbarItem";
import { useState } from "react";
import SidebarItem from "./SidebarItem";
import useFirebaseHook from "@/hooks/useFirebaseHook";
import { useAppContext } from "@/AppProvider";
import { auth } from "@/firebase";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function StudentTopBar({ title }: { title: string }) {
  const [visible, setVisible] = useState(false);

  const { isLoading, dispatch } = useFirebaseHook();
  const { setUser } = useAppContext();

  const onLogout = () => {
    dispatch({
      process: async ({}) => {
        await auth.signOut();

        try {
          AsyncStorage.removeItem("email");
          AsyncStorage.removeItem("password");
        } catch (e) {}

        setUser(null);
        router.replace("/login");
      },
      onError: (error) => {},
    });
  };

  return (
    <View>
      <Topbar title={title} setSidebarVisible={setVisible}>
        <TopbarItem
          text="Profile"
          onPress={() => {
            router.navigate("/(student)/profile");
          }}
        />
        <TopbarItem text="Logout" onPress={onLogout} />
      </Topbar>

      <Sidebar visible={visible} setVisible={setVisible}>
        <SidebarItem
          setSidebarVisible={setVisible}
          text="QR Code"
          route={"/qr-code"}
        />
        <SidebarItem
          setSidebarVisible={setVisible}
          text="Activity Logs"
          route={"/logs"}
        />
        <SidebarItem
          setSidebarVisible={setVisible}
          text="Linked Parent"
          route={"/linked-parents"}
        />
        <SidebarItem
          setSidebarVisible={setVisible}
          text="Schedules"
          route={"/schedules"}
        />
        <SidebarItem
          setSidebarVisible={setVisible}
          text="Logout"
          onPress={onLogout}
        />
      </Sidebar>
    </View>
  );
}
