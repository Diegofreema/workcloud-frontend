import { create } from 'zustand';

type State = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  id: number;
  getId: (id: number) => void;
};

export const useDeletePost = create<State>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  id: 0,
  getId: (id: number) => set({ id: id }),
}));
