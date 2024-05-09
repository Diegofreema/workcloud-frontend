import { create } from 'zustand';

type OrganizationModalState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useOrganizationModal = create<OrganizationModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
