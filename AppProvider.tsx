import { collection, onSnapshot, query, where } from "firebase/firestore";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { db } from "./firebase";
import * as Notifications from "expo-notifications";
import { Href, router } from "expo-router";
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
  // pendingRoute: Href | null;
  // setPendingRoute: React.Dispatch<React.SetStateAction<Href | null>>;
}>({
  user: null,
  setUser: () => {},
  visible: false,
  setVisible: () => {},
  // pendingRoute: null,
  // setPendingRoute: () => {},
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
  // const [pendingRoute, setPendingRoute] = useState<Href | null>(null);

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
      if (notifClickListenerRef.current) notifClickListenerRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      if (notifRef.current) notifRef.current(); // unsubscribe Firestore
      if (notifClickListenerRef.current) notifClickListenerRef.current.remove();
      return;
    }

    if (notifRef.current) notifRef.current(); // unsubscribe Firestore
    if (notifClickListenerRef.current) notifClickListenerRef.current.remove(); // remove previous notification listener

    // ✅ One-time listener for notification click
    notifClickListenerRef.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const path = response?.notification?.request?.content?.data?.route;

        if (!path) return;

        router.push(path);
        // setPendingRoute(path);
      });

    notifRef.current = onSnapshot(
      query(
        collection(db, "notifications"),
        where("receiverId", "==", user.id),
        where("prompt", "==", false)
      ),
      (snap) => {
        for (const dc of snap.docs) {
          const notif = dc.data();

          // Prevent duplicate prompt
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

    return () => {
      // ✅ Clean up listeners on unmount or user change
      if (notifClickListenerRef.current) notifClickListenerRef.current.remove();
      if (notifRef.current) notifRef.current();
    };
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        visible,
        setVisible,
        // pendingRoute,
        // setPendingRoute,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
