import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useAppContext } from "@/AppProvider";
import useFirebaseHook from "@/hooks/useFirebaseHook";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import useScreenFocusHook from "@/hooks/useScreenFocusHook";
import tw from "tailwind-react-native-classnames";
import StudentTopBar from "@/components/StudentTopBar";
import { router } from "expo-router";

const MessageScreen = () => {
  const [chatUsers, setChatUsers] = useState<{ [field: string]: any }[]>([]);

  const [loaded, setLoaded] = useState(false);
  const { user } = useAppContext();
  const { isLoading, dispatch } = useFirebaseHook();

  useScreenFocusHook(() => {
    let unsubscribe: any = null;
    dispatch({
      process: async ({ get, where }) => {
        const snap = await get(
          "linkings",
          where("studentId", "==", user?.id),
          where("status", "==", "Accepted")
        );

        let temp = [];
        for (const parentLinkedDoc of snap.docs) {
          const linkedParentData: { [field: string]: any } = {
            id: parentLinkedDoc.id,
            ...parentLinkedDoc.data(),
          };

          temp.push(linkedParentData);
        }

        setChatUsers(temp);

        unsubscribe = onSnapshot(
          query(
            collection(db, "messages"),
            where("participants", "array-contains", user?.id),
            orderBy("date", "desc")
          ),
          (querySnapshot: { [field: string]: any }) => {
            let h: { [field: string]: any } = {};
            for (const dc of querySnapshot.docs) {
              const j = dc.data();
              if (h[j.participants[0]] || h[j.participants[1]]) continue;

              for (let i = 0; i < temp.length; i++) {
                const l = temp[i];
                if (j.participants.includes(l.parentId)) {
                  h[l.parentId] = true;
                  temp[i].message = j.message;
                  // l.date = j.date;
                  break;
                }
              }
            }
            setChatUsers([...temp]);

            if (!loaded) setLoaded(true);
          }
        );
      },
      onError: (error) => {
        console.error("Error fetching users:", error);
      },
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  });

  return (
    <>
      <StudentTopBar title="Messages" />

      <ScrollView style={styles.container}>
        <Text style={styles.welcomeText}>Messages</Text>

        {/* Chat Users Display */}
        {!loaded ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <View style={styles.parentListContainer}>
            {chatUsers.length > 0 ? (
              chatUsers.map((value, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    router.push({
                      pathname: "/chats",
                      params: {
                        otherUserId: value.parentId,
                        otherUserName: value.parentName,
                        otherUserImage: value.parentImage,
                      },
                    });
                  }}
                >
                  <View
                    style={tw`flex-row rounded-lg bg-white shadow-lg mb-4 px-4 py-2 items-center`}
                  >
                    <Image
                      source={
                        value.parentImage
                          ? { uri: value.parentImage }
                          : require("@/assets/images/account_circle.png")
                      }
                      style={tw`w-14 h-14 rounded-full`}
                    />
                    <View>
                      <Text style={tw`text-lg font-bold ml-4`}>
                        {value.parentName}
                      </Text>
                      <Text style={tw`ml-4`}>
                        {value.message ?? "No messages yet."}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noParentsText}>No users found.</Text>
            )}
          </View>
        )}
      </ScrollView>
    </>
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
  navCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 35,
    height: 34,
    resizeMode: "contain",
    right: 100,
    elevation: 5,
  },
  gatesync: {
    width: 100,
    height: 34,
    resizeMode: "contain",
    right: 100,
    elevation: 5,
  },
  menuIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  latestMessage: {
    fontSize: 14,
    color: "#555", // Soft gray for readability
    fontStyle: "italic", // Make it italic to differentiate
    marginTop: 4,
    backgroundColor: "#E3F2FD", // Light blue background
    padding: 5,
    borderRadius: 5,
    overflow: "hidden",
    maxWidth: "90%", // Prevents overflow
  },

  welcomeText: {
    fontSize: 36,
    fontWeight: "800",
    color: "#5394F2",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
  },
  overlay: {
    flex: 1,
    width: "100%",
  },
  slideMenu: {
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
  },
  menu: {
    flex: 1,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  menuOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  menuOptionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  parentItem: {
    backgroundColor: "#CFE5FF",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 2,
  },
  parentName: {
    fontSize: 18,
    fontWeight: "600",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  parentListContainer: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  noParentsText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
});

export default MessageScreen;
