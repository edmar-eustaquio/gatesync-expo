import { ReactNode, useEffect, useRef } from "react";
import { Animated, Modal, Text, TouchableOpacity, View } from "react-native";
import tw from "tailwind-react-native-classnames";

export default function Sidebar({
  visible,
  setVisible,
  children,
}: {
  visible: boolean;
  setVisible: (newValue: boolean) => void;
  children: ReactNode;
}) {
  const slideAnim = useRef(new Animated.Value(-400)).current;

  useEffect(() => {
    if (!visible) return;
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const onClose = () => {
    Animated.timing(slideAnim, {
      toValue: -400,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };
  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[tw`flex-1`, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]}>
        <TouchableOpacity style={tw`flex-1 w-full`} onPress={onClose} />
        <Animated.View
          style={{
            transform: [{ translateX: slideAnim }],
            position: "absolute",
            top: 0,
            left: 0,
            width: "80%",
            backgroundColor: "#fff",
            height: "100%",
            borderTopRightRadius: 20,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={onClose}
              style={{
                alignSelf: "flex-end",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                {" "}
                X{" "}
              </Text>
            </TouchableOpacity>

            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
