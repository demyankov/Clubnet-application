import { FC, ReactElement, ReactNode } from 'react';

import { createStyles, Loader } from '@mantine/core';

type Props = {
  children: ReactNode;
  isFetching: boolean;
};

const useStyles = createStyles({
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
});

export const RenderContentContainer: FC<Props> = ({ children, isFetching = false }) => {
  const { classes } = useStyles();

  if (isFetching) {
    return (
      <div className={classes.loader}>
        <Loader size="xl" />
      </div>
    );
  }

  return children as ReactElement;
};
