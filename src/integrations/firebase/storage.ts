import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadImageAndGetURL = async (
  image: File,
  userId: string,
): Promise<string> => {
  const storage = getStorage();
  const ext = image.name.split('.').pop();
  const imageRef = ref(storage, `images/${userId}.${ext}`);

  await uploadBytes(imageRef, image);

  return getDownloadURL(imageRef);
};
