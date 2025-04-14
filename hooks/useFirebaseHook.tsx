import { db } from "@/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  FieldPath,
  FieldValue,
  getDoc,
  getDocs,
  query,
  QueryFieldFilterConstraint,
  QuerySnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  orderBy,
  WhereFilterOp,
  OrderByDirection,
  QueryOrderByConstraint,
  QueryConstraint,
} from "firebase/firestore";
import { useState } from "react";

export default function useFirebaseHook() {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const dispatch = ({
    process,
    onError,
    finished,
  }: {
    process: ({
      get,
      all,
      find,
      add,
      set,
      update,
      remove,
      serverTimestamp,
      where,
      orderBy,
    }: {
      get: (
        collectionName: string,
        ...queryConstraints: QueryConstraint[]
      ) => Promise<QuerySnapshot<DocumentData, DocumentData>>;
      all: (
        collectionName: string
      ) => Promise<QuerySnapshot<DocumentData, DocumentData>>;
      find: (
        collectionName: string,
        uid: string
      ) => Promise<DocumentSnapshot<DocumentData, DocumentData>>;
      add: (
        collectionName: string,
        data: object
      ) => Promise<DocumentReference<object, DocumentData>>;
      set: (collectionName: string, uid: string, data: object) => Promise<void>;
      update: (
        collectionName: string,
        uid: string,
        data: object
      ) => Promise<void>;
      remove: (collectionName: string, uid: string) => Promise<void>;
      serverTimestamp: () => FieldValue;
      where: (
        fieldPath: string | FieldPath,
        opStr: WhereFilterOp,
        value: unknown
      ) => QueryFieldFilterConstraint;
      orderBy: (
        fieldPath: string | FieldPath,
        directionStr?: OrderByDirection
      ) => QueryOrderByConstraint;
    }) => Promise<any>;
    onSuccess?: () => void;
    onError?: (error: string) => void;
    finished?: () => void;
  }) => {
    if (isLoading) return;

    setIsError(false);
    setError(null);
    setLoading(true);
    process({
      get,
      all,
      find,
      add,
      set,
      update,
      remove,
      serverTimestamp,
      where,
      orderBy,
    })
      .catch((e) => {
        console.log("has error", e.message);

        setError(e.message);
        setIsError(true);
        if (onError) onError(e.message);
      })
      .finally(() => {
        if (finished) finished();
        setLoading(false);
      });
  };

  return { isLoading, isError, error, dispatch };
}

const find = async (collectionName: string, uid: string) => {
  return await getDoc(doc(db, collectionName, uid));
};

const all = async (collectionName: string) => {
  return await getDocs(collection(db, collectionName));
};

const get = async (
  collectionName: string,
  ...queryConstraints: QueryConstraint[]
) => {
  return await getDocs(
    query(collection(db, collectionName), ...queryConstraints)
  );
};

const set = async (collectionName: string, uid: string, data: object) => {
  return await setDoc(doc(db, collectionName, uid), data, { merge: true });
};

const add = async (collectionName: string, data: object) => {
  return await addDoc(collection(db, collectionName), data);
};

const update = async (collectionName: string, uid: string, data: object) => {
  await updateDoc(doc(db, collectionName, uid), data);
};

const remove = async (collectionName: string, uid: string) => {
  await deleteDoc(doc(db, collectionName, uid));
};

const removeSeenNotifs = (id: string, title: string) => {
  getDocs(
    query(
      collection(db, "notifications"),
      where("receiverId", "==", id),
      where("title", "==", title)
    )
  ).then(({ docs }) => {
    for (const dc of docs) deleteDoc(doc(db, "notifications", dc.id));
  });
};

export { update, removeSeenNotifs };
