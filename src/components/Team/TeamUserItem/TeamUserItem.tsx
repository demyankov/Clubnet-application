import { FC } from 'react';

import { createStyles, Group, Image, Text, UnstyledButton } from '@mantine/core';
import { IconCrown } from '@tabler/icons-react';

import { isDarkTheme } from 'helpers';
import { useRole } from 'hooks';
import { IUser } from 'store/slices/auth/types';

const useStyles = createStyles((theme) => ({
  user: {
    display: 'block',
    width: '100%',
    color: isDarkTheme(theme.colorScheme) ? theme.colors.dark[0] : theme.black,

    '&:hover': {
      backgroundColor: isDarkTheme(theme.colorScheme)
        ? theme.colors.dark[8]
        : theme.colors.gray[0],
    },
  },
}));

type Props = { member: IUser };

export const TeamUserItem: FC<Props> = ({ member: { nickName, role, image, name } }) => {
  const { classes } = useStyles();

  const { isCaptain } = useRole(role);

  return (
    <UnstyledButton className={classes.user} p={13}>
      <Group>
        <Image width={40} height={40} radius="50%" src={image} withPlaceholder />

        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {nickName}
          </Text>
          <Text color="dimmed" size="xs">
            {name}
          </Text>
        </div>

        {isCaptain && <IconCrown color="orange" size={25} />}
      </Group>
    </UnstyledButton>
  );
};
