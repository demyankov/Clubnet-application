import { FC, ReactNode } from 'react';

import { createStyles } from '@mantine/core';

const useStyles = createStyles(() => ({
  authForm: {
    paddingTop: '2.5rem',
    maxWidth: '26.25rem',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

export const FormComponent: FC<{ children: ReactNode }> = ({ children }) => {
  const { classes } = useStyles();

  return <div className={classes.authForm}>{children}</div>;
};
