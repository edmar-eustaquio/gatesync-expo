import { ReactNode } from "react";
import {
  ActivityIndicator,
  ColorValue,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";

export default function LoadingWrapper({
  loading,
  wrapperStyle,
  size,
  color,
  children,
}: {
  loading: boolean;
  wrapperStyle?: StyleProp<ViewStyle>;
  size?: number | "small" | "large" | undefined;
  color?: ColorValue | undefined;
  children: ReactNode;
}) {
  return loading ? (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 40,
      }}
    >
      <ActivityIndicator size={size ?? "small"} color={color ?? "#fff"} />
    </View>
  ) : (
    children
  );
}
