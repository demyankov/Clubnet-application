import { FC, ReactElement, ReactNode } from 'react';

import { createStyles, Loader, Title } from '@mantine/core';

type Props = {
  children: ReactNode;
  isFetching?: boolean;
  emptyTitle?: string | null;
  isEmpty?: boolean;
};

const useStyles = createStyles({
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  empty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 432px)',
    height: '100%',
    position: 'relative',
    margin: '50px 0 20px 0',
    width: '100%',
  },
});

export const RenderContentContainer: FC<Props> = ({
  children,
  isFetching = false,
  emptyTitle,
  isEmpty,
}) => {
  const { classes } = useStyles();

  if (isFetching) {
    return (
      <div className={classes.loader}>
        <Loader size="xl" />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={classes.empty}>
        <Title order={1}>{emptyTitle}</Title>
      </div>
    );
  }

  return children as ReactElement;
};
