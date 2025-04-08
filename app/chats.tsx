import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { router, useLocalSearchParams } from "expo-router";
import { useAppContext } from "@/AppProvider";
import useFirebaseHook from "@/hooks/useFirebaseHook";
import { db } from "@/firebase";
import LoadingWrapper from "@/components/LoadingWrapper";

const ChatPage = () => {
  const { otherUserId, otherUserName, otherUserImage }: any =
    useLocalSearchParams();
  const { user } = useAppContext();
  const { isLoading, dispatch } = useFirebaseHook();

  const [messages, setMessages] = useState<{ [key: string]: any }>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollViewRef = useRef<any>(null);

  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("date", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMessages(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsubscribe(); // Unsubscribe when component unmounts
  }, []);

  // Function to send a new message
  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    dispatch({
      process: async ({ add, serverTimestamp }) => {
        setNewMessage("");

        await add("messages", {
          message: newMessage,
          senderId: user?.id,
          participants: [user?.id, otherUserId],
          date: serverTimestamp(),
        });

        add("notifications", {
          receiverId: otherUserId,
          title: "Message",
          message: `${user?.name} sent you a message.`,
          route: `/(${
            user?.role == "Student" ? "parent" : "student"
          }tabs)/message`,
          date: serverTimestamp(),
          prompt: false,
        });
      },
      onError: (err) => {
        Alert.alert("Error sending a message!!!");
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Dismiss keyboard when tapping outside */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          {/* Navigation Bar */}
          <View style={styles.navbar}>
            <TouchableOpacity onPress={() => router.back()}>
              <Image
                source={require("@/assets/images/back.png")}
                style={styles.back}
              />
            </TouchableOpacity>
            <Text style={styles.name}>{otherUserName || "Unknown User"}</Text>
            <Image
              source={
                otherUserImage
                  ? { uri: otherUserImage }
                  : require("@/assets/images/accountcircle.png")
              }
              style={styles.account}
            />
          </View>

          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
          >
            {messages.map((item: any) => (
              <View
                key={item.id}
                style={[
                  styles.messageContainer,
                  item.senderId === user?.id
                    ? styles.sentMessage
                    : styles.receivedMessage,
                ]}
              >
                <Text style={styles.messageText}>{item.message}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Chat messages list */}
        </View>
      </TouchableWithoutFeedback>

      {/* Message Input Section */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor={"#686D76"}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <LoadingWrapper loading={isLoading}>
            <Image source={require("@/assets/images/send.png")} />
          </LoadingWrapper>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#BCE5FF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  name: {
    color: "#404B7C",
    fontSize: 11,
    fontWeight: "900",
    fontFamily: "Kanit",
    alignSelf: "center",
    top: 15,
  },
  account: {
    left: -165,
    top: -5,
  },
  back: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  chatList: {
    flexGrow: 1,
    justifyContent: "flex-end", // Keeps chat list at the bottom by default
  },
  messageContainer: {
    backgroundColor: "#5394F2",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    alignSelf: "flex-end",
    maxWidth: "80%",
  },
  messageText: {
    color: "black",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: "#ddd",
    borderWidth: 2,
    backgroundColor: "#F6F6F6",
    borderRadius: 30,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
    borderRadius: 50,
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#5394F2",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E1E1E1",
  },
});

export default ChatPage;
