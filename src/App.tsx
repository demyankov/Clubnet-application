import { FC, useEffect } from 'react';

import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { Routes, Route } from 'react-router-dom';

import { mockData } from 'assets/mockData';
import {
  HeaderMegaMenu,
  FooterSocial,
  LoaderScreen,
  PrivateRoute,
  PublicRoute,
} from 'components';
import { Paths } from 'constants/paths';
import { Home, Register, Login, Dashboard, Profile, NotFound } from 'pages';
import { useStore } from 'store';

const App: FC = () => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'app-theme',
    defaultValue: 'dark',
    getInitialValueInEffect: true,
  });

  const { isFetching, getUser } = useStore((state) => state);

  const toggleColorScheme = (value?: ColorScheme): void =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useEffect(() => {
    getUser();
  }, [getUser]);

  if (isFetching) return <LoaderScreen />;

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <HeaderMegaMenu />
        <Routes>
          <Route index element={<Home />} />
          <Route
            path={Paths.register}
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path={Paths.login}
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path={Paths.dashboard}
            element={
              <PrivateRoute>
                <Dashboard data={mockData.data} />
              </PrivateRoute>
            }
          />
          <Route
            path={Paths.profile}
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path={Paths.notFound} element={<NotFound />} />
        </Routes>
        <FooterSocial />
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default App;
