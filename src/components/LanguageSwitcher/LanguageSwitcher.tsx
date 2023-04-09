import { FC, useState } from 'react';

import { createStyles, UnstyledButton, Menu, Image, Group, rem } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import ru from 'assets/russia.png';
import en from 'assets/united-kingdom.png';

type LangType = {
  label: string;
  image: string;
  lng: string;
};

const data: LangType[] = [
  { label: 'EN', image: en, lng: 'en' },
  { label: 'РУ', image: ru, lng: 'ru' },
];

const useStyles = createStyles((theme, { opened }: { opened: boolean }) => ({
  control: {
    width: rem(100),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.radius.md,
    border: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2]
    }`,
    transition: 'background-color 150ms ease',
    backgroundColor: (() => {
      if (theme.colorScheme === 'dark') {
        return opened ? theme.colors.dark[5] : theme.colors.dark[6];
      }

      return opened ? theme.colors.gray[0] : theme.white;
    })(),
    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
    },
  },

  label: {
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,
  },

  icon: {
    transition: 'transform 150ms ease',
    transform: opened ? 'rotate(180deg)' : 'rotate(0deg)',
  },
}));

export const LanguageSwitcher: FC = () => {
  const [opened, setOpened] = useState(false);
  const { classes } = useStyles({ opened });
  const [selected, setSelected] = useState(setLang());
  const { i18n } = useTranslation();

  function setLang(): LangType {
    const candidate = localStorage.getItem('i18nextLng');

    if (!candidate) return data[0];

    const index = data.map((lang) => lang.lng).indexOf(candidate);

    return data[index];
  }

  const items = data.map((item) => (
    <Menu.Item
      icon={<Image src={item.image} width={15} height={15} />}
      onClick={() => {
        setSelected(item);
        i18n.changeLanguage(item.lng);
      }}
      key={item.label}
    >
      {item.label}
    </Menu.Item>
  ));

  return (
    <Menu
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      radius="md"
      width="target"
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton className={classes.control}>
          <Group spacing="xs">
            <Image src={selected.image} width={15} height={15} />
            <span className={classes.label}>{selected.label}</span>
          </Group>
          <IconChevronDown size="1rem" className={classes.icon} stroke={1.5} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  );
};
