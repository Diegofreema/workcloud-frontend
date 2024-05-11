import { create } from 'zustand';

type State = {
  unread: number;
  getUnread: (value: number) => void;
};

export const useUnread = create<State>((set) => ({
  unread: 0,
  getUnread: (value: number) => set({ unread: value }),
}));
