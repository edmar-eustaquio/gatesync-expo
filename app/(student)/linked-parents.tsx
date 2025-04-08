import React, { useState, useEffect } from "react";
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
import useFirebaseHook from "@/hooks/useFirebaseHook";

const LinkedParent = () => {
  const [linkedParents, setLinkedParents] = useState<any>([]);

  const { user } = useAppContext();
  const { isLoading, dispatch } = useFirebaseHook();
  const { isLoading: fetchLoading, dispatch: dispatchFetch } =
    useFirebaseHook();

  const refresh = async ({ get, where }: { get: any; where: any }) => {
    const snap = await get("linkings", where("studentId", "==", user?.id));
    setLinkedParents(
      snap.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  };

  useEffect(() => {
    dispatchFetch({
      process: refresh,
      onError: (error) => {
        console.log(error);
      },
    });
  }, []);

  const unlinkParent = async (id: string) => {
    Alert.alert(
      "Confirm Unlink",
      "Are you sure you want to unlink this parent?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unlink",
          style: "destructive",
          onPress: async () => {
            dispatch({
              process: async ({ remove, get, where }) => {
                await remove("linkings", id);

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
    <View style={styles.container}>
      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Linked Parents</Text>

        {fetchLoading ? (
          <ActivityIndicator
            size="large"
            color="#5394F2"
            style={styles.loader}
          />
        ) : linkedParents.length > 0 ? (
          linkedParents.map((parent: any) => (
            <View key={parent.id} style={styles.parentCard}>
              <View style={styles.parentHeader}>
                <Image
                  source={require("@/assets/images/account_circle.png")}
                  style={styles.parentAvatar}
                />
                <Text style={styles.parentName}>{parent.name}</Text>
              </View>
              <Text style={styles.parentInfo}>📧 {parent.email}</Text>
              <Text style={styles.parentInfo}>
                📞 {parent.contactNumber || "N/A"}
              </Text>

              <TouchableOpacity
                style={styles.unlinkButton}
                onPress={() => unlinkParent(parent.id)}
              >
                <Text style={styles.unlinkText}>Unlink Parent</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noResults}>No linked parents found</Text>
        )}
      </ScrollView>
    </View>
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

export default LinkedParent;
