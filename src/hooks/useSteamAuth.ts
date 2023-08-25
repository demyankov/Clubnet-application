import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAuth } from 'store/store';

export const useSteamAuth = (
  steamId: Nullable<string>,
  customToken: Nullable<string>,
): void => {
  const navigate = useNavigate();

  const { appSingInWithCustomToken, addSteamIdForUser } = useAuth(
    (state) => state.signIn,
  );

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (steamId) {
      addSteamIdForUser(userId, steamId, navigate);
    }

    if (customToken) {
      appSingInWithCustomToken(userId, customToken, navigate);
    }
  }, [customToken, steamId, addSteamIdForUser, appSingInWithCustomToken, navigate]);
};
