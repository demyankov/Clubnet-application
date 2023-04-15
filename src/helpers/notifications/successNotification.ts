import { ReactNode } from 'react';

import { notifications } from '@mantine/notifications';

export const successNotification = (title: string, message: ReactNode): void => {
  notifications.show({
    title,
    message,
    color: 'teal',
    autoClose: 5000,
  });
};
