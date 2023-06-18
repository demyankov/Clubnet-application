import React, { FC, useCallback, useEffect, useState } from 'react';

import {
  Avatar,
  Center,
  createStyles,
  Group,
  Loader,
  Paper,
  Text,
  TextInput,
} from '@mantine/core';
import { useClickOutside, useDebouncedValue } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { IoClose, IoSearch } from 'react-icons/io5';

import { useSearch } from 'store/store';

const useStyles = createStyles(() => ({
  wrapper: {
    position: 'relative',
    minWidth: '230px',
    width: '100%',
  },
  dropdown: {
    position: 'absolute',
    maxWidth: '230px',
    width: '100%',
  },
}));

export const HeaderSearch: FC = () => {
  const { t } = useTranslation();
  const { classes } = useStyles();

  const {
    handleSearch,
    searchResults,
    isDropdownOpen,
    dropdownToggle,
    resultText,
    isSearching,
  } = useSearch((state) => state);

  const [searchValue, setSearchValue] = useState('');
  const [debounced] = useDebouncedValue(searchValue, 500);

  const onSearch = useCallback((): void => {
    dropdownToggle(true);
    handleSearch(debounced);
  }, [debounced, dropdownToggle, handleSearch]);

  const handleClear = (): void => {
    setSearchValue('');
    dropdownToggle(false);
  };

  const searchRef = useClickOutside(handleClear);

  useEffect(() => {
    if (debounced) {
      onSearch();
    }
  }, [debounced, onSearch]);

  return (
    <div ref={searchRef}>
      <TextInput
        className={classes.wrapper}
        onChange={(e) => setSearchValue(e.currentTarget.value)}
        placeholder={t('search.searchPlaceholder') as string}
        value={searchValue}
        autoComplete="off"
        icon={<IoSearch size="0.8rem" />}
        rightSection={searchValue.length >= 1 && <IoClose onClick={handleClear} />}
      />

      {isDropdownOpen && (
        <Paper shadow="xs" p="md" mt="xs" className={classes.dropdown}>
          {searchResults.map((client) => (
            <Group mb="md" key={client.id} spacing="sm">
              <Avatar size={40} src={client?.image} radius={40} />

              <div>
                <Text fz="sm" fw={500}>
                  {client?.nickName}
                </Text>

                <Text fz="xs" c="dimmed">
                  {client?.name}
                </Text>
              </div>
            </Group>
          ))}

          {resultText && <Text>{resultText}</Text>}

          {isSearching && (
            <Center>
              <Loader variant="dots" />
            </Center>
          )}
        </Paper>
      )}
    </div>
  );
};
