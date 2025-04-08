import { collection, onSnapshot, query, where } from "firebase/firestore";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Platform, SafeAreaView, StatusBar } from "react-native";
import { db } from "./firebase";
import * as Notifications from "expo-notifications";
import { router, useRootNavigationState } from "expo-router";
import { update } from "./hooks/useFirebaseHook";

type UserProps = {
  id: string;
  name?: string;
  email?: string;
  role?: "Admin" | "Student" | "Parent";
  contactNumber?: string;
  idNumber?: string;
  yearLevel?: string;
  course?: string;
  qrData?: string;
  image?: string;
};

const AppContext = createContext<{
  user: UserProps | null;
  setUser: React.Dispatch<React.SetStateAction<UserProps | null>>;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  user: null,
  setUser: () => {},
  visible: false,
  setVisible: () => {},
});

export const useAppContext = () => {
  return useContext(AppContext);
};

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProps | null>(null);
  const [visible, setVisible] = useState(false);
  const notifRef = useRef<any>(null);
  const notifClickListenerRef = useRef<any>(null);
  const navigationState = useRootNavigationState();

  useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("permision not granted");
        return;
      }

      console.log("Permission granted for notifications");
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true, // Show notification alert
          shouldPlaySound: true, // Play sound
          shouldSetBadge: true, // Optionally set the badge on the app icon
        }),
      });
    }

    requestPermissions();

    return () => {
      if (notifRef.current) notifRef.current();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      if (notifRef.current) notifRef.current();
      return;
    }

    notifClickListenerRef.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        if (!user) return;

        const path = response?.notification?.request?.content?.data?.route;

        setTimeout(() => {
          router.push(path);
        }, 50);
      });

    notifRef.current = onSnapshot(
      query(
        collection(db, "notifications"),
        where("receiverId", "==", user.id),
        where("prompt", "==", false)
      ),
      (snap: any) => {
        for (const dc of snap.docs) {
          const notif = dc.data();

          update("notifications", dc.id, { prompt: true });

          Notifications.scheduleNotificationAsync({
            content: {
              title: notif.title,
              body: notif.message,
              data: {
                route: notif.route,
              },
            },
            trigger: null,
          });
        }
      }
    );
  }, [user]);

  return (
    <AppContext.Provider value={{ user, setUser, visible, setVisible }}>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        {children}
      </SafeAreaView>
    </AppContext.Provider>
  );
};
