import { useAppContext } from "@/AppProvider";
import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect } from "react";

export default function index() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  const { setUser } = useAppContext();

  useEffect(() => {
    if (rootNavigationState?.key) {
      // Only navigate when the root layout is mounted

      // setUser({
      //   id: "WeAY6WsXAFZ0lXH6AvljhYjyUyF2",
      //   name: "Parent",
      //   email: "p@gmail.com",
      //   contactNumber: "09454845588",
      //   image:
      //     "https://res.cloudinary.com/diwwrxy8b/image/upload/v1744080315/nd48xwzob3v594v2wnha.jpg",
      // });
      // router.replace("/(parenttabs)");

      setUser({
        id: "P9DJlaa7fJanvWTUJfnGphIsXbd2",
        name: "Student",
        email: "s@gmail.com",
        idNumber: "5155",
        course: "BSIT",
        role: "Student",
        yearLevel: "8484",
        qrData: "Student-5155",
        image:
          "https://res.cloudinary.com/diwwrxy8b/image/upload/v1744038332/bwzd5vt0wpb8b8vyjcd1.jpg",
      });

      router.replace("/(studenttabs)");

      // router.replace("/login");
    }
  }, [rootNavigationState]);
  return null;
}
