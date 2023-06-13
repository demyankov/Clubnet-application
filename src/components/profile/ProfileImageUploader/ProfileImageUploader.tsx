import { FC } from 'react';

import { Avatar, Box, LoadingOverlay, FileButton, Overlay, Button } from '@mantine/core';
import { useHover } from '@mantine/hooks';
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
  const currentUser = user as IUser;

  const handleUpload = async (image: File): Promise<void> => {
    await updateUserImage(image);
  };

  const handleDeleteImage = async (): Promise<void> => {
    await deleteUserImage();
  };

  return (
    <Box pos="relative" ref={ref}>
      <Avatar src={currentUser.image} size={200} radius="100%" alt="no avatar" />
      {hovered && !isUserImageFetching && (
        <Overlay opacity={0.5} center radius="100%">
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
      <LoadingOverlay visible={isUserImageFetching} radius="100%" />
    </Box>
  );
};
