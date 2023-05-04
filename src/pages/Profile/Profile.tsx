import { FC } from 'react';

import { Flex } from '@mantine/core';

import { ProfileImageUploader, ProfilePersonalDataForm } from 'components/profile';

const Profile: FC = () => {
  return (
    <Flex
      direction={{ base: 'column', sm: 'row' }}
      justify="center"
      align={{ base: 'center', sm: 'start' }}
      gap="md"
    >
      <ProfileImageUploader />
      <ProfilePersonalDataForm />
    </Flex>
  );
};

export default Profile;
