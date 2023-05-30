import { ref, set, get, update } from 'firebase/database';
import {
  collection,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  query,
  limit,
  orderBy,
  Timestamp,
  startAfter,
  QuerySnapshot,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';

import { DatabasePaths } from 'constants/databasePaths';
import { db, firestoreDb } from 'integrations/firebase/firebase';

export const setFirebaseData = <T>(data: T, path: DatabasePaths, id: string): void => {
  set(ref(db, `${path}/${id}`), data);
};

export const getFirebaseDataById = async (
  path: DatabasePaths,
  id: string,
): Promise<any> => {
  const dataRef = ref(db, path);
  const snapshot = await get(dataRef);

  if (snapshot.exists()) {
    const data = snapshot.val();
    const dataArray = Object.keys(data).map((key) => {
      return { id: key, ...data[key] };
    });

    return dataArray.find((dataUser: any) => dataUser.id === id);
  }
};

export const updateFirebaseData = <T>(
  path: DatabasePaths,
  data: T,
  id: string,
): Promise<void> => {
  const updates: any = {};

  updates[`/${path}/${id}`] = data;

  return update(ref(db), updates);
};

// new firestore feature
export const setFirestoreData = <T extends DocumentData>(
  path: DatabasePaths,
  data: T,
  id: string,
): void => {
  const date = new Date(data.expectedDate);
  const timestamp = Timestamp.fromDate(date);

  const docRef = doc(firestoreDb, path, id);

  setDoc(docRef, { ...data, timestamp });
};

export const getTournamentsData = (
  latestDoc: Nullable<QueryDocumentSnapshot>,
): Promise<QuerySnapshot<DocumentData>> => {
  const collectionRef = collection(firestoreDb, DatabasePaths.Tournaments);
  const queryRef = query(
    collectionRef,
    orderBy('timestamp', 'asc'),
    startAfter(latestDoc || 0),
    limit(10),
  );

  return getDocs(queryRef);
};

export const deleteFirestoreData = async (
  path: DatabasePaths,
  id: string,
): Promise<void> => {
  const docRef = doc(firestoreDb, path, id);

  await deleteDoc(docRef);
};

export const getFirestoreDataById = async (
  path: DatabasePaths,
  id: string,
): Promise<any> => {
  const docRef = doc(firestoreDb, path, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
};
