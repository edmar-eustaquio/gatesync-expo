import { Href, router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

export default function SidebarItem({
  text,
  route,
  onPress,
  setSidebarVisible,
}: {
  text: string;
  route?: Href;
  onPress?: () => void;
  setSidebarVisible: (vis: boolean) => void;
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        if (route) router.navigate(route);
        else if (onPress) onPress();
        setSidebarVisible(false);
      }}
      style={{
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "500",
          color: "#333",
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}
