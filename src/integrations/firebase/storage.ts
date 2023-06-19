import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { t } from 'i18next';

import { Images } from 'constants/storageFolders';

export const uploadImageAndGetURL = async (
  image: File,
  folder: Images,
  id: string,
): Promise<string> => {
  const maxSize = 3.5 * 1024 * 1024; // 3,5mb

  if (image.size > maxSize) {
    throw Error(t('notifications.errorImageMaxSize').toString());
  }

  const storage = getStorage();
  const ext = image.name.split('.').pop();
  const imageRef = ref(storage, `${folder}/${id}.${ext}`);

  await uploadBytes(imageRef, image);

  return getDownloadURL(imageRef);
};

export const deleteImageFromStorage = async (imageUrl: string): Promise<void> => {
  const storage = getStorage();
  const imageRef = ref(storage, imageUrl);

  await deleteObject(imageRef);
};
