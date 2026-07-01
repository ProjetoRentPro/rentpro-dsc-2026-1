import type { User } from '../types/user';

export interface AuthContextData {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn(accessToken: string): Promise<void>;
  signOut(): void;
}
