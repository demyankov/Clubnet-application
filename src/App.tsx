import { FC, useEffect, useState } from 'react';

import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import { mockData } from 'assets/mockData';
import { HeaderMegaMenu, FooterSocial, LoaderScreen } from 'components';
import { Paths } from 'constants/paths';
import { Home, Register, Login, Dashboard, Profile, NotFound } from 'pages';
import { setUser } from 'store/slices/userSlice';

const App: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'app-theme',
    defaultValue: 'dark',
    getInitialValueInEffect: true,
  });

  const dispatch = useDispatch();
  const toggleColorScheme = (value?: ColorScheme): void =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useEffect(() => {
    setIsLoading(true);
    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(
          setUser({
            email: user.email,
            id: user.uid,
            token: await user.getIdToken(),
          }),
        );
        setIsLoading(false);
      } else {
        dispatch(
          setUser({
            email: null,
            id: null,
            token: null,
          }),
        );
        setIsLoading(false);
      }
    });
  }, [dispatch]);

  return isLoading ? (
    <LoaderScreen />
  ) : (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <HeaderMegaMenu />
        <Routes>
          <Route index element={<Home />} />
          <Route path={Paths.register} element={<Register />} />
          <Route path={Paths.login} element={<Login />} />
          <Route path={Paths.dashboard} element={<Dashboard data={mockData.data} />} />
          <Route path={Paths.profile} element={<Profile />} />
          <Route path={Paths.notFound} element={<NotFound />} />
        </Routes>
        <FooterSocial />
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default App;
