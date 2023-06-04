import {
  collection,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  limit,
  orderBy,
  startAfter,
  QuerySnapshot,
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
  getCountFromServer,
} from 'firebase/firestore';

import { DatabasePaths } from 'constants/databasePaths';
import { db } from 'integrations/firebase/firebase';

export const setFirestoreData = <T extends DocumentData>(
  path: DatabasePaths,
  id: string,
  data: T,
): void => {
  const date = data.expectedDate ? new Date(data.expectedDate) : new Date();
  const timestamp = Timestamp.fromDate(date);

  const docRef = doc(db, path, id);

  setDoc(docRef, { ...data, timestamp });
};

export const deleteFirestoreData = async (
  path: DatabasePaths,
  id: string,
): Promise<void> => {
  const docRef = doc(db, path, id);

  await deleteDoc(docRef);
};

export const getFirestoreDataByValue = async (
  path: DatabasePaths,
  value: string,
): Promise<any> => {
  const docRef = doc(db, path, value);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
};

export const updateFirestoreData = async (
  path: DatabasePaths,
  id: string,
  propToUpdate: { [x: string]: any },
): Promise<void> => {
  const docRef = doc(db, path, id);

  await updateDoc(docRef, propToUpdate);
};

export const getTournamentsData = (
  latestDoc: Nullable<QueryDocumentSnapshot>,
): Promise<QuerySnapshot<DocumentData>> => {
  const collectionRef = collection(db, DatabasePaths.Tournaments);
  const queryRef = query(
    collectionRef,
    orderBy('timestamp', 'asc'),
    startAfter(latestDoc || 0),
    limit(10),
  );

  return getDocs(queryRef);
};

export const getFirestoreDataLength = (path: DatabasePaths): Promise<any> => {
  const collectionRef = collection(db, path);

  return getCountFromServer(collectionRef);
};
