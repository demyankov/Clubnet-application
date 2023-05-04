import { FC } from 'react';

import {
  Image,
  Container,
  LoadingOverlay,
  FileButton,
  Overlay,
  Button,
} from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { BiUpload } from 'react-icons/bi';
import { RiDeleteBin6Line } from 'react-icons/ri';

import { ALLOWED_IMAGE_FORMATS } from 'constants/allowedImageFormats';
import { useAuth } from 'store/store';
import { IUser } from 'store/types';

export const ProfileImageUploader: FC = () => {
  const { user, isUserImageFetching, updateUserImage, deleteUserImage } = useAuth(
    (state) => state,
  );
  const { hovered, ref } = useHover();
  const { t } = useTranslation();
  const currentUser = user as IUser;

  const handleUpload = async (image: File): Promise<void> => {
    await updateUserImage(image, t);
  };

  const handleDeleteImage = async (): Promise<void> => {
    await deleteUserImage(t);
  };

  return (
    <Container ta="center" m={0} px={0} pos="relative" w={250} h={250} ref={ref}>
      <Image
        mx="auto"
        withPlaceholder
        radius="sm"
        src={currentUser.image}
        width={250}
        height={250}
      />
      {hovered && !isUserImageFetching && (
        <Overlay opacity={0.3} center>
          <FileButton onChange={handleUpload} accept={ALLOWED_IMAGE_FORMATS.join(',')}>
            {(props) => (
              <Button {...props} mr="xs">
                <BiUpload size="1.2rem" />
              </Button>
            )}
          </FileButton>
          <Button ml="xs" onClick={handleDeleteImage} disabled={!currentUser.image}>
            <RiDeleteBin6Line size="1.2rem" />
          </Button>
        </Overlay>
      )}
      <LoadingOverlay visible={isUserImageFetching} />
    </Container>
  );
};
