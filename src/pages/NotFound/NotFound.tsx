import { FC } from 'react';

import {
  createStyles,
  Container,
  Title,
  Text,
  Button,
  SimpleGrid,
  rem,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ReactComponent as NotFoundImg } from 'assets/images/shared/404.svg';
import { Paths } from 'constants/paths';

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: rem(80),
    paddingBottom: rem(80),
  },

  title: {
    fontWeight: 900,
    fontSize: rem(34),
    marginBottom: theme.spacing.md,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(32),
    },
  },

  control: {
    [theme.fn.smallerThan('sm')]: {
      width: '100%',
    },
  },

  mobileImage: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  desktopImage: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },
}));

const NotFound: FC = () => {
  const { classes } = useStyles();
  const { t } = useTranslation();

  return (
    <Container className={classes.root}>
      <SimpleGrid
        spacing={80}
        cols={2}
        breakpoints={[{ maxWidth: 'sm', cols: 1, spacing: 40 }]}
      >
        <NotFoundImg className={classes.mobileImage} />
        <div>
          <Title className={classes.title}>{t('notFound.title')}</Title>
          <Text color="dimmed" size="lg">
            {t('notFound.info')}
          </Text>
          <Button
            variant="outline"
            size="md"
            mt="xl"
            className={classes.control}
            component={Link}
            to={Paths.home}
          >
            {t('notFound.back')}
          </Button>
        </div>
        <NotFoundImg className={classes.desktopImage} />
      </SimpleGrid>
    </Container>
  );
};

export default NotFound;
