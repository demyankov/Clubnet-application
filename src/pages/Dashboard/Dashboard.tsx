import { FC } from 'react';

import {
  createStyles,
  Table,
  Progress,
  Anchor,
  Text,
  Group,
  ScrollArea,
  rem,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';

const useStyles = createStyles((theme) => ({
  progressBar: {
    '&:not(:first-of-type)': {
      borderLeft: `${rem(3)} solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
      }`,
    },
  },

  inner: {
    minWidth: 800,
    maxWidth: rem(960),
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

const data = [
  {
    title: 'Foundation',
    author: 'Isaac Asimov',
    year: 1951,
    reviews: {
      positive: 2223,
      negative: 259,
    },
  },
  {
    title: 'Frankenstein',
    author: 'Mary Shelley',
    year: 1818,
    reviews: {
      positive: 5677,
      negative: 1265,
    },
  },
  {
    title: 'Solaris',
    author: 'Stanislaw Lem',
    year: 1961,
    reviews: {
      positive: 3487,
      negative: 1845,
    },
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    year: 1965,
    reviews: {
      positive: 8576,
      negative: 663,
    },
  },
  {
    title: 'The Left Hand of Darkness',
    author: 'Ursula K. Le Guin',
    year: 1969,
    reviews: {
      positive: 6631,
      negative: 993,
    },
  },
  {
    title: 'A Scanner Darkly',
    author: 'Philip K Dick',
    year: 1977,
    reviews: {
      positive: 8124,
      negative: 1847,
    },
  },
];

const Dashboard: FC = () => {
  const { classes, theme } = useStyles();
  const { t } = useTranslation();

  const rows = data.map((row) => {
    const totalReviews = row.reviews.negative + row.reviews.positive;
    const positiveReviews = (row.reviews.positive / totalReviews) * 100;
    const negativeReviews = (row.reviews.negative / totalReviews) * 100;

    return (
      <tr key={row.title}>
        <td>
          <Anchor component="button" fz="sm">
            {row.title}
          </Anchor>
        </td>
        <td>{row.year}</td>
        <td>
          <Anchor component="button" fz="sm">
            {row.author}
          </Anchor>
        </td>
        <td>{Intl.NumberFormat().format(totalReviews)}</td>
        <td>
          <Group position="apart">
            <Text fz="xs" c="teal" weight={700}>
              {positiveReviews.toFixed(0)}%
            </Text>
            <Text fz="xs" c="red" weight={700}>
              {negativeReviews.toFixed(0)}%
            </Text>
          </Group>
          <Progress
            classNames={{ bar: classes.progressBar }}
            sections={[
              {
                value: positiveReviews,
                color:
                  theme.colorScheme === 'dark'
                    ? theme.colors.teal[9]
                    : theme.colors.teal[6],
              },
              {
                value: negativeReviews,
                color:
                  theme.colorScheme === 'dark'
                    ? theme.colors.red[9]
                    : theme.colors.red[6],
              },
            ]}
          />
        </td>
      </tr>
    );
  });

  return (
    <ScrollArea>
      <Table className={classes.inner} verticalSpacing="xs">
        <thead>
          <tr>
            <th>{t('dashboard.title')}</th>
            <th>{t('dashboard.year')}</th>
            <th>{t('dashboard.author')}</th>
            <th>{t('dashboard.reviews')}</th>
            <th>{t('dashboard.dist')}</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
};

export default Dashboard;
