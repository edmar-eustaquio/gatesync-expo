import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAppContext } from "@/AppProvider";
import useFirebaseHook, { removeSeenNotifs } from "@/hooks/useFirebaseHook";
import tw from "tailwind-react-native-classnames";
import { router } from "expo-router";
import useScreenFocusHook from "@/hooks/useScreenFocusHook";
import CustomTopbar from "@/components/CustomTopbar";

const Linked = () => {
  const [linkedChilds, setLinkedChilds] = useState<any>([]);

  const { user } = useAppContext();
  const { isLoading, dispatch } = useFirebaseHook();
  const { isLoading: fetchLoading, dispatch: dispatchFetch } =
    useFirebaseHook();

  const refresh = async ({ get, where }: { get: any; where: any }) => {
    const snap = await get("linkings", where("parentId", "==", user?.id));
    setLinkedChilds(
      snap.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  };

  useScreenFocusHook(() => {
    dispatchFetch({
      process: async ({ get, where }: { get: any; where: any }) => {
        if (user?.id) removeSeenNotifs(user?.id, "Linking Status");

        const snap = await get("linkings", where("parentId", "==", user?.id));
        setLinkedChilds(
          snap.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      },
      onError: (error) => {
        console.log(error);
      },
    });
  });

  const unlink = async (id: string, receiverId: string) => {
    Alert.alert(
      "Confirm Unlink",
      "Are you sure you want to unlink this student?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unlink",
          style: "destructive",
          onPress: async () => {
            dispatch({
              process: async ({ add, remove, get, where, serverTimestamp }) => {
                await remove("linkings", id);

                add("notifications", {
                  receiverId: receiverId,
                  title: "Linking Status",
                  message: `${user?.name} unlinked with you.`,
                  date: serverTimestamp(),
                  route: "/linked-parents",
                  prompt: false,
                });
                refresh({ get, where });
              },
              onError: (error) => {
                console.log(error);
              },
            });
          },
        },
      ]
    );
  };

  const onAccept = async (id: string, receiverId: string) => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to accept this student?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            dispatch({
              process: async ({ add, serverTimestamp, update, get, where }) => {
                await update("linkings", id, { status: "Accepted" });

                add("notifications", {
                  receiverId: receiverId,
                  title: "Linking Status",
                  message: `${user?.name} accepted your link request.`,
                  date: serverTimestamp(),
                  route: "/linked-parents",
                  prompt: false,
                });

                refresh({ get, where });
              },
              onError: (error) => {
                console.log(error);
              },
            });
          },
        },
      ]
    );
  };

  const onDecline = async (id: string, receiverId: string) => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to decline this child?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            dispatch({
              process: async ({ add, serverTimestamp, update, get, where }) => {
                await update("linkings", id, { status: "Declined" });

                add("notifications", {
                  receiverId: receiverId,
                  title: "Linking Status",
                  message: `${user?.name} declined your linking request.`,
                  route: "/linked-parents",
                  date: serverTimestamp(),
                  prompt: false,
                });
                refresh({ get, where });
              },
              onError: (error) => {
                console.log(error);
              },
            });
          },
        },
      ]
    );
  };

  return (
    <>
      <CustomTopbar title="Linked Students" />

      <View style={styles.container}>
        {/* Content */}
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Linked Students</Text>

          <TouchableOpacity
            style={tw`py-1 px-3 rounded-md bg-blue-600 mb-3`}
            onPress={() => router.navigate("/students-list")}
          >
            <Text style={tw`text-white text-base font-semibold`}>
              Add Student
            </Text>
          </TouchableOpacity>

          {fetchLoading ? (
            <ActivityIndicator
              size="large"
              color="#5394F2"
              style={styles.loader}
            />
          ) : linkedChilds.length > 0 ? (
            linkedChilds.map((linking: any) => (
              <View key={linking.id} style={styles.parentCard}>
                <View style={styles.parentHeader}>
                  <Image
                    source={
                      linking.studentImage
                        ? { uri: linking.studentImage }
                        : require("@/assets/images/account_circle.png")
                    }
                    style={styles.parentAvatar}
                  />
                  <Text style={styles.parentName}>{linking.studentName}</Text>
                </View>
                <Text style={styles.parentInfo}>📧 {linking.studentEmail}</Text>
                <Text style={styles.parentInfo}>{linking.parentIdNumber}</Text>

                {linking.status == "Declined" ? (
                  <Text
                    style={tw`text-base border-2 px-4 rounded-md font-semibold mt-4 py-1 border-red-600 text-red-600`}
                  >
                    Declined
                  </Text>
                ) : !linking.requestByStudent && linking.status == "Pending" ? (
                  <Text
                    style={tw`text-base border-2 px-4 rounded-md font-semibold mt-4 py-1 border-yellow-400 text-yellow-400`}
                  >
                    Pending
                  </Text>
                ) : linking.status == "Pending" ? (
                  <View style={tw`w-full mt-4 flex-row justify-center`}>
                    <TouchableOpacity
                      style={tw`bg-blue-700 rounded-md px-4 py-1 mr-2`}
                      onPress={() => onAccept(linking.id, linking.studentId)}
                    >
                      <Text style={tw`text-white text-base font-semibold`}>
                        Accept
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={tw`bg-red-700 rounded-md px-4 py-1`}
                      onPress={() => onDecline(linking.id, linking.studentId)}
                    >
                      <Text style={tw`text-white text-base font-semibold`}>
                        Decline
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.unlinkButton}
                    onPress={() => unlink(linking.id, linking.studentId)}
                  >
                    <Text style={styles.unlinkText}>Unlink Student</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noResults}>No linked students found</Text>
          )}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },

  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#BCE5FF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 5,
  },

  navCenter: { flexDirection: "row", alignItems: "center" },
  logo: { width: 35, height: 35, resizeMode: "contain", marginRight: 10 },
  gatesync: { width: 100, height: 35, resizeMode: "contain" },
  backIcon: { width: 30, height: 30, resizeMode: "contain" },
  profileIcon: { width: 30, height: 30, resizeMode: "contain" },

  content: { padding: 20, alignItems: "center" },

  title: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 20 },
  loader: { marginTop: 50 },

  parentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 15,
  },

  parentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  parentAvatar: { width: 70, height: 70, borderRadius: 50, marginRight: 15 },
  parentName: { fontSize: 20, fontWeight: "600", color: "#333" },
  parentInfo: { fontSize: 16, color: "#666", marginVertical: 3 },

  unlinkButton: {
    backgroundColor: "#E74C3C",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 15,
  },

  unlinkText: { fontSize: 16, fontWeight: "600", color: "#FFF" },

  noResults: { fontSize: 16, color: "#999", marginTop: 20 },
});

export default Linked;
