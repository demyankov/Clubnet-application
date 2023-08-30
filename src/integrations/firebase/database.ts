import { OrderByDirection, WhereFilterOp } from '@firebase/firestore';
import {
  and,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  or,
  orderBy,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  setDoc,
  startAfter,
  Unsubscribe,
  updateDoc,
  where,
} from 'firebase/firestore';

import { DatabasePaths } from 'constants/databasePaths';
import { Roles } from 'constants/userRoles';
import { generateQueryFilterArray } from 'helpers';
import { db } from 'integrations/firebase/firebase';
import { ITeam, ITeamMember } from 'store/slices';

export type Filter<T> = {
  [K in keyof T]: { field: K; value: T[K] extends Array<infer P> | undefined ? P : T[K] };
}[keyof T];

type FirestoreOutput<T> = {
  data: T[];
  totalCount: number;
  querySnapshot: QuerySnapshot;
};

type QueryType = 'or' | 'and';

const defaultLimit = 10;

export const setFirestoreData = async <T extends DocumentData>(
  path: DatabasePaths,
  id: string,
  data: T,
): Promise<DocumentReference<T>> => {
  const docRef = doc(db, path, id) as DocumentReference<T>;

  await setDoc(docRef, data);

  return docRef;
};

export const deleteFirestoreData = async (
  path: DatabasePaths,
  id: string,
): Promise<void> => {
  const docRef = doc(db, path, id);

  await deleteDoc(docRef);
};

export const getFirestoreData = async <T extends { id: string }>(
  path: DatabasePaths,
  lastVisible: Nullable<QueryDocumentSnapshot> = null,
  orderByField: keyof T = 'id',
  countLimit?: number,
): Promise<FirestoreOutput<T>> => {
  const collectionRef = collection(db, path);
  const countFromServer = await getCountFromServer(collectionRef);
  const { count } = countFromServer.data();
  const q = query(
    collectionRef,
    orderBy(orderByField as string),
    startAfter(lastVisible || 0),
    limit(countLimit || defaultLimit),
  );
  const querySnapshot = await getDocs(q);
  const data: T[] = [];

  querySnapshot.forEach((doc) => {
    data.push(doc.data() as T);
  });

  return {
    data,
    totalCount: count,
    querySnapshot,
  };
};

export const getFilteredFirestoreData = async <T extends { id: string }>(
  path: DatabasePaths,
  filters: Filter<T>[],
  queryType: QueryType = 'and',
  lastVisible: Nullable<QueryDocumentSnapshot> = null,
  orderByField: keyof T = 'id',
  filterOperator: WhereFilterOp = '==',
  countLimit?: number,
): Promise<FirestoreOutput<T>> => {
  const collectionRef = collection(db, path);
  const queryFilter = generateQueryFilterArray<T>(filters, filterOperator);
  const queryConstraints = queryType === 'and' ? and(...queryFilter) : or(...queryFilter);

  let q = query(collectionRef, queryConstraints);
  const fullQuerySnapshot = await getDocs(q);
  const count = fullQuerySnapshot.size;

  q = query(
    collectionRef,
    queryConstraints,
    orderBy(orderByField as string),
    startAfter(lastVisible || 0),
    limit(countLimit || defaultLimit),
  );
  const querySnapshot = await getDocs(q);
  const data: T[] = [];

  querySnapshot.forEach((doc) => {
    data.push(doc.data() as T);
  });

  return {
    data,
    totalCount: count,
    querySnapshot,
  };
};

export const getFirestoreDataBySubstring = async <T extends { id: string }>(
  path: DatabasePaths,
  filter: Filter<T>,
): Promise<T[]> => {
  const { field, value } = filter;
  const collectionRef = collection(db, path);
  const q = query(
    collectionRef,
    where(field as string, '>=', value),
    where(field as string, '<=', `${value}\uf8ff`),
    orderBy(field as string),
  );
  const querySnapshot = await getDocs(q);
  const data: T[] = [];

  querySnapshot.forEach((doc) => {
    data.push(doc.data() as T);
  });

  return data;
};

export const getFireStoreDataByFieldName = async <T extends { id: string }>(
  path: DatabasePaths,
  identifier: T[keyof T],
  field: keyof T = 'id',
): Promise<T | undefined> => {
  const queryRef = query(collection(db, path), where(field as string, '==', identifier));

  const querySnapshot = await getDocs(queryRef);

  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];

    return { id: docSnap.id, ...docSnap.data() } as T;
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

  return docs.map((doc, index) => {
    const data = doc.data();

    return { ...data, role: refArray[index].role };
  });
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

export const getAllCollection = async <T extends DocumentData>(
  collectionPath: DatabasePaths,
  orderByField: string = 'id',
): Promise<T[]> => {
  const queryRef = query(collection(db, collectionPath), orderBy(orderByField, 'asc'));

  const querySnapshot = await getDocs(queryRef);
  const data: T[] = [];

  querySnapshot.forEach((doc) => {
    data.push(doc.data() as T);
  });

  return data;
};

export const subscribeToCollection = <T extends DocumentData>(
  collectionPath: DatabasePaths,
  filters: Filter<T>[] = [],
  dataCallback: (data: T[]) => void,
  orderByField: string = 'id',
  orderByDirection: OrderByDirection = 'asc',
): Unsubscribe => {
  const collectionRef = collection(db, collectionPath);

  let queryRef = query(collectionRef, orderBy(orderByField, orderByDirection));

  filters.forEach((filter) => {
    queryRef = query(
      collectionRef,
      where(filter.field as string, '==', filter.value),
      orderBy(filter.field as string),
    );
  });

  return onSnapshot(queryRef, (querySnapshot) => {
    const data: T[] = [];

    querySnapshot.forEach((doc) => {
      data.push(doc.data() as T);
    });

    dataCallback(data);
  });
};
