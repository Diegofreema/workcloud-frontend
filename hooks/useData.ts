import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export type PartialUser = {
  id: string;
  name: string;
  email: string;
  streamToken?: string;
  avatar: string;
  avatarUrl?: string;
};
type UserType = {
  id: string;
  user: PartialUser | null;
  getUser: (user: PartialUser) => void;
  getValues: () => void;
  removeId: () => void;
  setId: (id: string) => void;
};

export const useData = create<UserType>((set) => ({
  user: null,
  id: '',
  getUser: (user: PartialUser) => {
    set((state) => ({ ...state, user: user }));
    const stringifyUser = JSON.stringify(user);
    SecureStore.setItem('user', stringifyUser);
  },
  removeId: async () => {
    set({ user: null, id: '' });
    await SecureStore.deleteItemAsync('id');
    await SecureStore.deleteItemAsync('user');
  },
  setId: (id: string) => {
    set((state) => ({ ...state, id: id }));
    SecureStore.setItem('id', id);
  },
  getValues: () => {
    const parsedUser = JSON.parse(SecureStore.getItem('user') || '{}');
    set((state) => ({ user: parsedUser, id: SecureStore.getItem('id') || '' }));
  },
}));
