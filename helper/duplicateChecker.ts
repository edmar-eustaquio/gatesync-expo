import { db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export const existsInUser = async (
  user: any | undefined | null,
  key: any,
  value: string
) => {
  if (user && user[key] == value) return false;

  const snap = await getDocs(
    query(collection(db, "users"), where(key, "==", value))
  );
  if (!user) return snap.docs.length > 0;

  for (const v of snap.docs) {
    if (v.id != user.id) return true;
  }
  return false;
};
