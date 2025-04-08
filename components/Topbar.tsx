import { useAppContext } from "@/AppProvider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ReactNode } from "react";
import {
  Modal,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Topbar({
  children,
  title,
  setSidebarVisible,
}: {
  children: ReactNode;
  title?: string;
  setSidebarVisible: (vis: boolean) => void;
}) {
  const {visible, setVisible} = useAppContext();

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#BCE5FF",
          paddingVertical: 10,
          paddingHorizontal: 15,
          elevation: 5,
          shadowColor: "#000",
          // zIndex: 1000,

          //   position: "absolute",
          //   top: 50,
          //   left: 0,
          //   right: 0,
          //   flexDirection: "row",
          //   alignItems: "center",
          //   justifyContent: "flex-end",
          //   backgroundColor: "#BCE5FF",
          //   paddingVertical: 10,
          //   paddingHorizontal: 15,
          //   elevation: 5,
          //   shadowColor: "#000",
          //   shadowOffset: { width: 0, height: 2 },
          //   shadowOpacity: 0.2,
          //   shadowRadius: 4,
          //   zIndex: 1000,
        }}
      >
        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <MaterialIcons size={20} name="menu" />
        </TouchableOpacity>
        {title ? <Text>{title}</Text> : null}
        <TouchableOpacity onPress={() => setVisible(true)}>
          <MaterialIcons size={20} name="more-vert" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={visible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setVisible(false)}
      >
        <View
          style={{
            position: "absolute",
            top:
              Platform.OS === "android"
                ? (StatusBar.currentHeight ?? 0) + 25
                : 90,
            right: 25,
            width: 150,
            backgroundColor: "#fff",
            borderRadius: 10,
            borderTopRightRadius: 0,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          {children}
        </View>
      </Modal>
    </>
  );
}
