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

export default function ParentTopBar({ title }: { title: string }) {
  const [visible, setVisible] = useState(false);

  const { isLoading, dispatch } = useFirebaseHook();
  const { setUser } = useAppContext();

  const onLogout = () => {
    dispatch({
      process: async ({}) => {
        await auth.signOut();
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
            console.log("sadfdasfsaf");

            router.navigate("/(parent)/profile");
          }}
        />
        <TopbarItem text="Logout" onPress={onLogout} />
      </Topbar>

      <Sidebar visible={visible} setVisible={setVisible}>
        <SidebarItem
          setSidebarVisible={setVisible}
          text="Linked Childrens"
          route={"/linked-children"}
        />
        <SidebarItem
          setSidebarVisible={setVisible}
          text="Profile"
          route={"/(parent)/profile"}
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
