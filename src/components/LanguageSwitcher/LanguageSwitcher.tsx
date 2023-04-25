import { FC, useState, FunctionComponent, SVGProps } from 'react';

import { createStyles, UnstyledButton, Menu, Group, rem } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as EnIcon } from 'assets/en.svg';
import { ReactComponent as RuIcon } from 'assets/ru.svg';

interface ILanguage {
  label: string;
  image: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined }>;
  value: string;
}

enum Language {
  En = 'en',
  Ru = 'ru',
}

const data: ILanguage[] = [
  { label: 'EN', image: EnIcon, value: Language.En },
  { label: 'РУ', image: RuIcon, value: Language.Ru },
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

  function setLang(): ILanguage {
    const candidate = localStorage.getItem('i18nextLng');

    if (!candidate) return data[0];

    const index = data.map((lang) => lang.value).indexOf(candidate);

    return data[index];
  }

  const items = data.map((item) => (
    <Menu.Item
      icon={<item.image />}
      onClick={() => {
        setSelected(item);
        i18n.changeLanguage(item.value);
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
            <selected.image />
            <span className={classes.label}>{selected.label}</span>
          </Group>
          <IconChevronDown size="1rem" className={classes.icon} stroke={1.5} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  );
};
