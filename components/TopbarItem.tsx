import { useAppContext } from "@/AppProvider";
import { Text, TouchableOpacity } from "react-native";

export default function TopbarItem({
  text,
  onPress,
}: {
  text: string;
  onPress: () => void;
}) {
  const { setVisible } = useAppContext();

  return (
    <TouchableOpacity
      style={{
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
      }}
      onPress={() => {
        onPress();
        setVisible(false);
      }}
    >
      <Text
        style={{
          fontSize: 16,
          color: "#333",
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}
