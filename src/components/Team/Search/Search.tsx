import { FC, useCallback, useEffect, useState } from 'react';

import { createStyles, Paper, Text, TextInput } from '@mantine/core';
import { useClickOutside, useDebouncedValue } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { IoClose, IoSearch } from 'react-icons/io5';

import { SearchResult, LoaderContainer } from 'components';
import { debouceDelay } from 'constants/debounceDelay';
import { IUser } from 'store/slices/auth/types';
import { useAuth, useInviteMembers, useTeams } from 'store/store';

const useStyles = createStyles(() => ({
  wrapper: {
    position: 'relative',
    minWidth: '230px',
    width: '100%',
  },
  dropdown: {
    position: 'absolute',
    maxHeight: '200px',
    width: '95%',
    cursor: 'pointer',
    zIndex: 10,
    overflow: 'auto',

    '&>div:last-of-type': {
      marginBottom: '0px',
    },
  },
}));

export const Search: FC = () => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue] = useDebouncedValue(searchValue, debouceDelay);
  const { user } = useAuth((store) => store);
  const { membersInTeam } = useTeams((store) => store);

  const {
    searchMember,
    searchResults,
    isDropdownOpen,
    dropdownToggle,
    resultText,
    isSearching,
    addToMembersList,
    searchResultText,
  } = useInviteMembers((state) => state);

  const onSearch = useCallback((): void => {
    dropdownToggle(true);
    searchMember(user, debouncedSearchValue);
  }, [debouncedSearchValue, user, dropdownToggle, searchMember]);

  const handleClear = (): void => {
    setSearchValue('');
    dropdownToggle(false);
  };

  const searchRef = useClickOutside(handleClear);

  const handleAdd = (member: IUser): void => {
    addToMembersList(member, membersInTeam);
    handleClear();
  };

  useEffect(() => {
    if (debouncedSearchValue) {
      onSearch();
    }
  }, [debouncedSearchValue, onSearch]);

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
          {searchResultText && (
            <Text fz="sm" fw={500}>
              {t(searchResultText)}
            </Text>
          )}

          <LoaderContainer isFetching={isSearching}>
            {searchResults.map((playerForInvitation) => (
              <SearchResult
                key={playerForInvitation.id}
                currentMember={playerForInvitation}
                handleAdd={handleAdd}
              />
            ))}
            {resultText && <Text>{resultText}</Text>}
          </LoaderContainer>
        </Paper>
      )}
    </div>
  );
};
