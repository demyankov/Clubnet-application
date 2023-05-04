import { User } from 'firebase/auth';
import { ref, set, get, update } from 'firebase/database';

import { db } from 'integrations/firebase/firebase';
import { IUser } from 'store/types';

export const setUserData = (userData: IUser): void => {
  set(ref(db, `users/${userData.id}`), userData);
};

export const getUserData = async (user: User): Promise<any> => {
  const dataRef = ref(db, 'users');
  const snapshot = await get(dataRef);

  if (snapshot.exists()) {
    const data = snapshot.val();
    const dataArray = Object.keys(data).map((key) => {
      return { id: key, ...data[key] };
    });

    return dataArray.find((dataUser: any) => dataUser.id === user.uid);
  }
};

export const updateUserData = (userData: IUser): Promise<void> => {
  const updates: any = {};

  updates[`/users/${userData.id}`] = userData;

  return update(ref(db), updates);
};
