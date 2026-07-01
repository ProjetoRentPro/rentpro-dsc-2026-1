import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { AuthContextData } from './AuthContextData';
import { TOKEN_KEY, USER_KEY, clearSession } from './session';
import { getUserById } from '../api/usersApi';
import type { User } from '../types/user';
import type { JwtPayload } from '../types/auth';

export const AuthContext = createContext({} as AuthContextData);

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );

  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? (JSON.parse(stored) as User) : null;
  });

  const [loading, setLoading] = useState(false);

  async function signIn(accessToken: string) {
    setLoading(true);

    try {
      const payload = jwtDecode<JwtPayload>(accessToken);
      const profile = await getUserById(payload.sub);

      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(profile));

      setToken(accessToken);
      setUser(profile);
    } finally {
      setLoading(false);
    }
  }

  function signOut() {
    clearSession();
    setToken(null);
    setUser(null);
  }

  const value: AuthContextData = {
    user,
    token,
    signIn,
    signOut,
    isAuthenticated: !!token,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
