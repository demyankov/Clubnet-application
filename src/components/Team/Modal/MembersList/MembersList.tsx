import { FC } from 'react';

import { Avatar, Box, CloseButton, createStyles, Group, Text } from '@mantine/core';
import { t } from 'i18next';

import { isDarkTheme } from 'helpers';
import { useInviteMembers } from 'store/store';

const useStyles = createStyles((theme) => ({
  wrapper: {
    backgroundColor: isDarkTheme(theme.colorScheme) ? theme.colors.dark[6] : 'none',
    padding: theme.spacing.md,
    border: '1px solid',
    borderColor: isDarkTheme(theme.colorScheme)
      ? theme.colors.dark[4]
      : theme.colors.gray[4],
    borderRadius: '4px',
    height: '16rem',
    overflow: 'auto',
  },

  message: {
    color: isDarkTheme(theme.colorScheme) ? theme.colors.gray[7] : theme.colors.gray[5],
  },
}));

export const MembersList: FC = () => {
  const { membersList, inviteListText, deleteFromMembersList } = useInviteMembers();
  const { classes } = useStyles();

  return (
    <Box className={classes.wrapper}>
      {inviteListText && <Text className={classes.message}>{t(inviteListText)}</Text>}
      {membersList.map(({ id, nickName, name, image }) => (
        <Group mb="md" key={id} spacing="sm" position="apart">
          <Group spacing="sm">
            <Avatar size={40} src={image} radius={40} />
            <div>
              <Text fz="sm" fw={500}>
                {nickName}
              </Text>

              <Text fz="xs" c="dimmed">
                {name}
              </Text>
            </div>
          </Group>
          <CloseButton onClick={() => deleteFromMembersList(id)} />
        </Group>
      ))}
    </Box>
  );
};
