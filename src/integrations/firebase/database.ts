import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  Query,
  WhereFilterOp,
  QueryDocumentSnapshot,
  QuerySnapshot,
  setDoc,
  startAfter,
  Timestamp,
  updateDoc,
  where,
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
): Promise<T[]> => {
  let queryRef: Query<DocumentData> = collection(
    db,
    collectionPath,
  ) as CollectionReference<DocumentData>;

  filters.forEach((filter) => {
    queryRef = query(queryRef, where(filter.field, filter.operator, filter.value));
  });

  const querySnapshot = await getDocs(queryRef);
  const data: T[] = [];

  querySnapshot.forEach((doc) => {
    data.push(doc.data() as T);
  });

  return data;
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
