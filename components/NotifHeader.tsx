import { View, Text, Image } from "react-native";

export default function NotifHeader() {
  return (
    <View>
      <View
        style={{
          position: "relative",
          marginTop: 50,
          marginHorizontal: 15,
          borderRadius: 18,
          height: 125,
          backgroundColor: "#0000FF",
        }}
      >
        <Image
          source={require("@/assets/images/Updates.png")}
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            width: 150,
            height: 160,
          }}
        />
        <Text
          style={{
            position: "absolute",
            fontSize: 25,
            fontFamily: "MartianMono-Regular",
            color: "#fff",
            fontWeight: "800",
            bottom: 50,
            left: 30,
          }}
        >
          Notifications
        </Text>
        <Text
          style={{
            position: "absolute",
            fontSize: 25,
            fontFamily: "MartianMono-Regular",
            color: "#fff",
            fontWeight: "800",
            bottom: 20,
            left: 30,
          }}
        >
          List
        </Text>
      </View>
    </View>
  );
}
