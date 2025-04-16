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

export default function StudentsList() {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<{ [field: string]: any }[]>([]);
  const [filtered, setFiltered] = useState<{ [field: string]: any }[]>([]);

  const { user } = useAppContext();
  const { isLoading, dispatch } = useFirebaseHook();

  useEffect(() => {
    dispatch({
      process: async ({ get, where }) => {
        let linked: { [key: string]: boolean } = {};
        const lsnap = await get("linkings", where("parentId", "==", user?.id));
        for (const s of lsnap.docs) {
          linked[s.data().studentId] = true;
        }
        const snap = await get("users", where("role", "==", "Student"));
        let data = [];
        for (const doc of snap.docs) {
          if (!linked[doc.id]) data.push({ id: doc.id, ...doc.data() });
        }
        setStudents(data);
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
      setFiltered(students);
      return;
    }
    setFiltered(
      students.filter(
        (student) =>
          student.name.toLowerCase().includes(s) ||
          student.email.includes(s) ||
          student.idNumber.includes(s)
      )
    );
  }, [search]);

  const onLink = (student: any) => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to link in this student?",
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
                  studentId: student.id,
                  studentName: student.name,
                  studentEmail: student.email,
                  studentIdNumber: student.idNumber,
                  parentContactNumber: user?.contactNumber,
                  parentId: user?.id,
                  parentName: user?.name,
                  parentEmail: user?.email,
                  requestByStudent: false,
                };
                if (user?.image) data.parentImage = user.image;
                if (student.image) data.studentImage = student.image;
                await add("linkings", data);

                add("notifications", {
                  receiverId: student.id,
                  title: "Linking Status",
                  message: `${user?.name} wants to link with you.`,
                  route: "/linked-parents",
                  date: serverTimestamp(),
                  prompt: false,
                });

                setStudents(students.filter((p) => p.id !== student.id));
                setFiltered(filtered.filter((p) => p.id !== student.id));

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
      <CustomTopbar title="Student Lists" />

      <View style={tw`p-3`}>
        <Text style={tw`w-full text-lg font-bold text-center mb-3`}>
          Select Student to Link
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
            {filtered.map((student) => (
              <TouchableOpacity
                style={tw`py-2 px-4 mt-2 bg-gray-500 shadow-lg rounded-lg w-full`}
                key={student.id}
                onPress={() => onLink(student)}
              >
                <Text style={tw`text-base text-white font-semibold`}>
                  {student.name}
                </Text>
                <Text style={tw`text-base text-white font-semibold mt-1`}>
                  {student.email}
                </Text>
                <Text style={tw`text-base text-white font-semibold mt-1`}>
                  {student.idNumber}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={tw`h-10 w-full text-center text-lg font-semibold`}>
            No students found.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}
