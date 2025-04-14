import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function CustomTopbar({ title }: { title?: string }) {
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#5FA7FF",
          paddingVertical: 10,
          paddingHorizontal: 15,
          elevation: 5,
          shadowColor: "#000",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons
            style={{ color: "#fff" }}
            size={20}
            name="arrow-back"
          />
        </TouchableOpacity>
        {title ? (
          <Text style={{ color: "#fff", fontSize: 17, fontWeight: 700 }}>
            {title}
          </Text>
        ) : null}
        <View style={{ width: 20 }}></View>
      </View>
    </>
  );
}
