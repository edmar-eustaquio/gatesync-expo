import { useAppContext } from "@/AppProvider";
import CustomTopbar from "@/components/CustomTopbar";
import useFirebaseHook from "@/hooks/useFirebaseHook";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "tailwind-react-native-classnames";

export default function ParentsList() {
  const [search, setSearch] = useState("");
  const [parents, setParents] = useState<{ [field: string]: any }[]>([]);
  const [filtered, setFiltered] = useState<{ [field: string]: any }[]>([]);

  const { user } = useAppContext();
  const { isLoading, dispatch } = useFirebaseHook();

  useEffect(() => {
    dispatch({
      process: async ({ get, where }) => {
        let linked: { [key: string]: boolean } = {};
        const lsnap = await get("linkings", where("studentId", "==", user?.id));
        for (const s of lsnap.docs) {
          linked[s.data().parentId] = true;
        }
        const snap = await get("users", where("role", "==", "Parent"));
        let data = [];
        for (const doc of snap.docs) {
          if (!linked[doc.id]) data.push({ id: doc.id, ...doc.data() });
        }
        setParents(data);
        setFiltered(data);
      },
      onError: (error) => {
        console.log(error);
      },
    });
  }, []);

  useEffect(() => {
    const s = search.trim().toLowerCase();
    if (s == "") {
      setFiltered(parents);
      return;
    }
    setFiltered(
      parents.filter(
        (parent) =>
          parent.name.toLowerCase().includes(s) || parent.email.includes(s)
      )
    );
  }, [search]);

  const onLink = (parent: any) => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to link in this parent?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            dispatch({
              process: async ({ add, serverTimestamp }) => {
                let data: { [key: string]: any } = {
                  status: "Pending",
                  parentId: parent.id,
                  parentName: parent.name,
                  parentEmail: parent.email,
                  parentContactNumber: parent.contactNumber,
                  studentId: user?.id,
                  studentName: user?.name,
                  studentEmail: user?.email,
                  studentIdNumber: user?.idNumber,
                  requestByStudent: true,
                };
                if (user?.image) data.studentImage = user.image;
                if (parent.image) data.parentImage = parent.image;
                await add("linkings", data);

                add("notifications", {
                  receiverId: parent.id,
                  title: "Linking Status",
                  message: `${user?.name} wants to link with you.`,
                  route: "/linked-children",
                  date: serverTimestamp(),
                  prompt: false,
                });

                setParents(parents.filter((p) => p.id !== parent.id));
                setFiltered(filtered.filter((p) => p.id !== parent.id));

                Alert.alert("Success", "Successfully linked.");
              },
              onError: (err) => {
                Alert.alert("Error linking to this parent!!!");
              },
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <CustomTopbar title="Parent Lists" />

      <View style={tw`p-3`}>
        <Text style={tw`w-full text-lg font-bold text-center mb-3`}>
          Select Parents to Link
        </Text>

        <TextInput
          style={tw`w-full py-2 px-4 mb-2 border rounded-md bg-white border-gray-300`}
          placeholder="Search here"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#686D76"
        />

        {filtered.length > 0 ? (
          <ScrollView>
            {filtered.map((parent) => (
              <TouchableOpacity
                style={tw`py-2 px-4 mt-2 bg-gray-500 shadow-lg rounded-lg w-full`}
                key={parent.id}
                onPress={() => onLink(parent)}
              >
                <Text style={tw`text-base text-white font-semibold`}>
                  {parent.name}
                </Text>
                <Text style={tw`text-base text-white font-semibold mt-1`}>
                  {parent.email}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={tw`h-10 w-full text-center text-lg font-semibold`}>
            No parents found.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}
