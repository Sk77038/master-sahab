
import { UserProfile } from '../../types';

const STORAGE_KEY = 'master_sahab_user';

export const authService = {
  getUser: (): UserProfile | null => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },
  
  saveUser: (user: UserProfile) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  isLoggedIn: () => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }
};
