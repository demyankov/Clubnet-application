import { FC, ReactElement, ReactNode } from 'react';

import { createStyles, Text } from '@mantine/core';

type Props = {
  children: ReactNode;
  emptyTitle?: string | null;
  isEmpty?: boolean;
};

const useStyles = createStyles({
  empty: {
    display: 'flex',
  },
});

export const IsEmptyContainer: FC<Props> = ({ children, emptyTitle, isEmpty }) => {
  const { classes } = useStyles();

  if (isEmpty) {
    return (
      <div className={classes.empty}>
        <Text fw={600} fz={25}>
          {emptyTitle}
        </Text>
      </div>
    );
  }

  return children as ReactElement;
};
