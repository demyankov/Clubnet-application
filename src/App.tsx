import { FC, useEffect, useState } from 'react';

import { Loader, MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import s from 'components/form.module.css';
import { HeaderMegaMenu } from 'components/Header';
import Dashboard from 'pages/Dashboard';
import Home from 'pages/Home';
import Login from 'pages/Login';
import NotFound from 'pages/NotFound';
import Profile from 'pages/Profile';
import Register from 'pages/Register';
import { setUser } from 'store/slices/userSlice';

const App: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
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

  return !isLoading ? (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <HeaderMegaMenu />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MantineProvider>
    </ColorSchemeProvider>
  ) : (
    <div className={s.loader}>
      <Loader size="xl" />
    </div>
  );
};

export default App;
