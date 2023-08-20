import React, { FC, useCallback, useEffect, useState } from 'react';

import { Center, createStyles, Loader, Paper, Text, TextInput } from '@mantine/core';
import { useClickOutside, useDebouncedValue } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { IoClose, IoSearch } from 'react-icons/io5';

import { SearchClient } from 'components';
import { useSearch } from 'store/store';

const useStyles = createStyles((theme) => ({
  container: {
    width: '230px',
    [theme.fn.smallerThan(820)]: {
      width: '150px',
    },
    [theme.fn.smallerThan(400)]: {
      width: '100px',
    },
  },

  wrapper: {
    position: 'relative',
    minWidth: '230px',
    width: '100%',
    [theme.fn.smallerThan(820)]: {
      minWidth: '150px',
      width: '100%',
    },
    [theme.fn.smallerThan(400)]: {
      minWidth: '100px',
      width: '70%',
    },
  },
  dropdown: {
    position: 'absolute',
    maxWidth: '230px',
    width: '100%',
    cursor: 'pointer',
    [theme.fn.smallerThan(735)]: {
      right: 20,
    },
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
    <div ref={searchRef} className={classes.container}>
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
            <SearchClient key={client.id} client={client} />
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
