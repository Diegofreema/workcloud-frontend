import { create } from 'zustand';

type State = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  token: number | string;
  generateToken: () => void;
  workspaceId: number | string;
  getWorkspaceId: (id: any) => void;
};

export const useToken = create<State>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  token: '',
  workspaceId: '',
  generateToken: () => {
    const token = Math.random() * 10000;
    set((state) => ({ ...state, token: token }));
  },
  getWorkspaceId: (id: any) => {
    set((state) => ({ ...state, workspaceId: id }));
  },
}));
