import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from 'react';

import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';

import { Theme } from 'constants/theme';
import { isDarkTheme } from 'helpers';

interface IState {
  currentTheme: ColorScheme;
  toggleTheme: () => void;
}

const initialState: IState = {
  currentTheme: Theme.Dark,
  toggleTheme: () => {},
};

const ThemeContext = createContext<IState>(initialState);

export const useThemeContext = (): IState => useContext(ThemeContext);

export const ThemeContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'app-theme',
    defaultValue: Theme.Dark,
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = useCallback(
    () => (): void => setColorScheme(isDarkTheme(colorScheme) ? Theme.Light : Theme.Dark),
    [setColorScheme, colorScheme],
  );

  const state: IState = useMemo(
    () => ({
      currentTheme: colorScheme,
      toggleTheme: toggleColorScheme(),
    }),
    [colorScheme, toggleColorScheme],
  );

  return (
    <ThemeContext.Provider value={state}>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme }}>
          <ModalsProvider>{children}</ModalsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </ThemeContext.Provider>
  );
};
