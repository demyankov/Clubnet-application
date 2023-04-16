import { ReactNode } from 'react';

import { notifications } from '@mantine/notifications';

export const errorNotification = (title: string, message: ReactNode): void => {
  notifications.show({
    title,
    message,
    color: 'red',
  });
};
