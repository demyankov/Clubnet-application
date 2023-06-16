import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  setDoc,
  startAfter,
  Timestamp,
  updateDoc,
  where,
  WhereFilterOp,
} from 'firebase/firestore';

import { DatabasePaths } from 'constants/databasePaths';
import { Roles } from 'constants/userRoles';
import { db } from 'integrations/firebase/firebase';
import { ITeam, ITeamMember } from 'store/slices';

export interface Filter<V> {
  field: string;
  operator: WhereFilterOp;
  value: V;
}

type FirestoreOutput<T> = {
  data: T[];
  totalCount: number;
  querySnapshot: QuerySnapshot;
};

const defaultLimit = 10;

export const setFirestoreData = async <T extends DocumentData>(
  path: DatabasePaths,
  id: string,
  data: T,
): Promise<void> => {
  const date = data.expectedDate ? new Date(data.expectedDate) : new Date();
  const timestamp = Timestamp.fromDate(date);

  const docRef = doc(db, path, id);

  await setDoc(docRef, { ...data, timestamp });
};

export const deleteFirestoreData = async (
  path: DatabasePaths,
  id: string,
): Promise<void> => {
  const docRef = doc(db, path, id);

  await deleteDoc(docRef);
};

export const getFirestoreData = async <T, V>(
  collectionPath: DatabasePaths,
  filters: Filter<V>[] = [],
  lastVisible: Nullable<QueryDocumentSnapshot> = null,
): Promise<FirestoreOutput<T>> => {
  const collectionRef = collection(db, collectionPath);

  let queryRef = query(
    collectionRef,
    orderBy('id', 'asc'),
    startAfter(lastVisible || 0),
    limit(defaultLimit),
  );

  const countFromServer = await getCountFromServer(collectionRef);
  const totalCount = countFromServer.data().count;

  filters.forEach((filter) => {
    queryRef = query(
      collectionRef,
      where(filter.field, filter.operator, filter.value),
      orderBy(filter.field, 'asc'),
    );
  });

  const querySnapshot = await getDocs(queryRef);
  const data: T[] = [];

  querySnapshot.forEach((doc) => {
    data.push(doc.data() as T);
  });

  return {
    totalCount,
    data,
    querySnapshot,
  };
};

export const getFireStoreDataByFieldName = async (
  path: DatabasePaths,
  identifier: string,
  field: string = 'id',
): Promise<any> => {
  const queryRef = query(collection(db, path), where(field, '==', identifier));

  const querySnapshot = await getDocs(queryRef);

  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];

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

export const checkFieldValueExists = async (
  collectionPath: DatabasePaths,
  fieldName: string,
  value: string,
): Promise<boolean> => {
  const collectionRef = collection(db, collectionPath);
  const docsQuery = query(collectionRef, where(fieldName, '==', value));
  const querySnapshot = await getDocs(docsQuery);

  return !querySnapshot.empty;
};

// TODO: refactor, need use setFirestoreData
export const addFirestoreTeam = async <T extends DocumentData>(
  referencePath: DatabasePaths,
  referenceId: string,
  docPath: DatabasePaths,
  data: T,
): Promise<void> => {
  const userRef = doc(db, referencePath, referenceId);
  const collectionRef = doc(db, docPath, data.id);

  await setDoc(collectionRef, {
    ...data,
    members: [{ userLink: userRef, role: Roles.CAPTAIN }],
  });
};

// TODO: reuse getFirestoreData
export const getFirestoreTeams = async (
  referencePath: DatabasePaths,
  referenceId: string,
): Promise<ITeam[]> => {
  const userRef = doc(db, referencePath, referenceId);
  const collectionRef = collection(db, DatabasePaths.Teams);
  const data: any[] = [];

  const docsQuery = query(
    collectionRef,
    where('members', 'array-contains', { userLink: userRef, role: Roles.CAPTAIN }),
  );
  const querySnapshot = await getDocs(docsQuery);

  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });

  return data.reverse();
};

// TODO: refactor
export const getFirestoreArrayLengthByField = async (
  referencePath: DatabasePaths,
  referenceId: string,
  databaseArray: string,
  objectField: string,
  role: Roles,
  collectionPath: DatabasePaths,
): Promise<number> => {
  const userRef = doc(db, referencePath, referenceId);
  const collectionRef = collection(db, collectionPath);

  const docsQuery = query(
    collectionRef,
    where(databaseArray, 'array-contains', { [objectField]: userRef, role }),
  );

  const lengthSnapshot = await getCountFromServer(docsQuery);

  return lengthSnapshot.data().count;
};

// TODO: refactor
export const getFirestoreTeamMembers = async (
  refArray: ITeamMember[],
): Promise<any[]> => {
  const promises = refArray.map((item) => getDoc(item.userLink!));
  const docs = await Promise.all(promises);

  const result = docs.map((doc, index) => {
    const data = doc.data();

    return { ...data, role: refArray[index].role };
  });

  return result;
};
