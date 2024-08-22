import { create } from 'zustand';
type InfoType = {
  workspaceId: string;
  workerId: string;
  newWorkspaceId: string;
  requestId: string | number;
};
type Store = {
  infoIds: InfoType;
  getInfoIds: (info: InfoType) => void;
  removeInfoIds: () => void;
};

export const useInfos = create<Store>((set) => ({
  infoIds: {
    workspaceId: '',
    workerId: '',
    newWorkspaceId: '',
    requestId: '',
  },
  getInfoIds: ({
    newWorkspaceId,
    requestId,
    workerId,
    workspaceId,
  }: InfoType) => {
    set({ infoIds: { workspaceId, workerId, newWorkspaceId, requestId } });
  },
  removeInfoIds: () => {
    set({
      infoIds: {
        workspaceId: '',
        workerId: '',
        newWorkspaceId: '',
        requestId: '',
      },
    });
  },
}));
