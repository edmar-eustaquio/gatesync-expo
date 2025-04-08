import { db } from "@/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getDocs,
  query,
  QueryNonFilterConstraint,
  QuerySnapshot,
  updateDoc,
} from "firebase/firestore";
import { useCallback, useState } from "react";

export const useFirebaseFindHook = ({
  path,
  uid,
  formatData,
}: {
  path: string;
  uid: string;
  formatData?: (
    document: DocumentSnapshot<DocumentData, DocumentData>
  ) => object;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<object | null>(null);

  const refetch = useCallback(() => {
    setError(null);
    setIsError(false);
    setLoading(true);
    getDoc(doc(db, path, uid))
      .then((res) => {
        if (formatData) setData(formatData(res));
        else setData({ id: res.id, ...res.data() });
      })
      .catch((e) => {
        setIsError(true);
        setError(e);
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { loading, data, error, isError, refetch };
};

export const useFirebaseGetHook = ({
  path,
  queryConstraints,
  formatData,
}: {
  path: string;
  queryConstraints: QueryNonFilterConstraint[];
  formatData?: (
    document: QuerySnapshot<DocumentData, DocumentData>
  ) => object[];
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<object[]>([]);

  const refetch = useCallback(() => {
    setError(null);
    setIsError(false);
    setLoading(true);
    getDocs(query(collection(db, path), ...queryConstraints))
      .then((res) => {
        if (formatData) setData(formatData(res));
        else setData(res.docs.map((prev) => ({ id: prev.id, ...prev.data() })));
      })
      .catch((e) => {
        setIsError(true);
        setError(e);
        setData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { loading, data, error, isError, refetch };
};

export const useFirebaseAddHook = ({ path }: { path: string }) => {
  const [loading, setLoading] = useState(false);

  const dispatch = ({
    data,
    onDispatched,
    onError,
    finished,
  }: {
    data: object;
    onDispatched?: () => void;
    onError?: (error: string) => void;
    finished?: () => void;
  }) => {
    setLoading(true);
    addDoc(collection(db, path), data)
      .then(() => {
        if (onDispatched) onDispatched();
      })
      .catch((e) => {
        if (onError) onError(e);
      })
      .finally(() => {
        if (finished) finished()
        setLoading(false);
      });
  };

  return { loading, dispatch };
};

export const useFirebaseUpdateHook = ({
  path,
  uid,
  data,
  onDispatched,
}: {
  path: string;
  uid: string;
  data: object;
  onDispatched?: (success: boolean) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isError, setIsError] = useState(false);

  const dispatch = useCallback(() => {
    setError(null);
    setIsError(false);
    setLoading(true);
    updateDoc(doc(db, path, uid), data)
      .then(() => {
        if (onDispatched) onDispatched(true);
      })
      .catch((e) => {
        setIsError(true);
        setError(e);
        if (onDispatched) onDispatched(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { loading, error, isError, dispatch };
};

export const useFirebaseDeleteHook = ({
  path,
  uid,
  onDispatched,
}: {
  path: string;
  uid: string;
  onDispatched?: (success: boolean) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isError, setIsError] = useState(false);

  const dispatch = useCallback(() => {
    setError(null);
    setIsError(false);
    setLoading(true);
    deleteDoc(doc(db, path, uid))
      .then(() => {
        if (onDispatched) onDispatched(true);
      })
      .catch((e) => {
        setIsError(true);
        setError(e);
        if (onDispatched) onDispatched(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { loading, error, isError, dispatch };
};
