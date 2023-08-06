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
  updateDoc,
  where,
  DocumentReference,
  startAt,
  endAt,
} from 'firebase/firestore';

import { DatabasePaths } from 'constants/databasePaths';
import { Roles } from 'constants/userRoles';
import { db } from 'integrations/firebase/firebase';
import { ITeam, ITeamMember } from 'store/slices';

export type Filter<T> = {
  [K in keyof T]: {
    field: K;
    value: T[K];
  };
}[keyof T];

type FirestoreOutput<T> = {
  data: T[];
  totalCount: number;
  querySnapshot: QuerySnapshot;
};

const defaultLimit = 10;

export const setFirestoreData = async <T extends DocumentData>(
  path: DatabasePaths | string,
  id: string,
  data: T,
): Promise<DocumentReference<T>> => {
  const docRef = doc(db, path, id) as DocumentReference<T>;

  await setDoc(docRef, data);

  return docRef;
};

export const deleteFirestoreData = async (
  path: DatabasePaths | string,
  id: string,
): Promise<void> => {
  const docRef = doc(db, path, id);

  await deleteDoc(docRef);
};

export const getFirestoreData = async <T>(
  collectionPath: DatabasePaths | string,
  filters: Filter<T>[] = [],
  lastVisible: Nullable<QueryDocumentSnapshot> = null,
  totalCounter?: number,
  orderByField: string = 'id',
): Promise<FirestoreOutput<T>> => {
  const collectionRef = collection(db, collectionPath);

  let queryRef = query(
    collectionRef,
    orderBy(orderByField, 'asc'),
    startAfter(lastVisible || 0),
    limit(defaultLimit),
  );

  const countFromServer = await getCountFromServer(collectionRef);

  filters.forEach((filter) => {
    queryRef = query(
      collectionRef,
      orderBy(filter.field as string),
      startAt(filter.value),
      endAt(`${filter?.value}\uf8ff`),
    );
  });

  const fullQuerySnapshot = await getDocs(queryRef);
  const filteredTotalCounter = fullQuerySnapshot.size;

  const totalCount = filters.length ? filteredTotalCounter : countFromServer.data().count;

  filters.forEach((filter) => {
    queryRef = query(
      collectionRef,
      orderBy(filter.field as string),
      startAt(filter.value),
      endAt(`${filter?.value}\uf8ff`),
      limit(totalCounter || defaultLimit),
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

export const getFireStoreDataByFieldName = async <T>(
  path: DatabasePaths,
  identifier: string,
  field: string = 'id',
): Promise<T | undefined> => {
  const queryRef = query(collection(db, path), where(field, '==', identifier));

  const querySnapshot = await getDocs(queryRef);

  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];

    return { id: docSnap.id, ...docSnap.data() } as T;
  }
};

export const updateFirestoreData = async (
  path: DatabasePaths | string,
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
    where('members', 'array-contains', {
      userLink: userRef,
      role: Roles.CAPTAIN,
    }),
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

export const getDataArrayWithRefArray = async <T extends DocumentData>(
  refArray: DocumentReference<T>[],
): Promise<T[]> => {
  const resultPromises = refArray.map((ref) => getDoc(ref));
  const snapshots = await Promise.all(resultPromises);

  return snapshots.map((docSnap) => docSnap.data()!);
};

export const getDocumentReference = async <T extends DocumentData>(
  path: DatabasePaths,
  id: string,
): Promise<DocumentReference<T>> => {
  return doc(db, path, id) as DocumentReference<T>;
};
