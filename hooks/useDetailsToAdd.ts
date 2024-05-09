import { create } from 'zustand';

type Props = {
  workspaceId: any;
  role: any;
  orgId: any;
  getData: (role: any, workspaceId: any, orgId: any) => void;
};

export const useDetailsToAdd = create<Props>((set) => ({
  workspaceId: '',
  role: '',
  orgId: '',
  getData: (role: any, workspaceId: any, orgId: any) =>
    set({ role: role, workspaceId: workspaceId, orgId: orgId }),
}));
