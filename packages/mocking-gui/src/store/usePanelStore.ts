import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LOCAL_STORAGE_KEY } from '@constants/key';

import type { PanelPosition, PanelSize } from '@mocking-gui-types/panel';

interface PanelStoreState {
  apiSearchKeyword: string;
  apiMethodFilter: string;
  isActiveOnly: boolean;
  panelPosition: PanelPosition;
  panelSize: PanelSize;
}

interface PanelStoreAction {
  setApiSearchQuery: (query: string) => void;
  setApiMethodFilter: (method: string) => void;
  toggleActiveOnly: () => void;
  setPanelPosition: (position: PanelPosition) => void;
  setPanelSize: (size: PanelSize) => void;
}

const initialState: PanelStoreState = {
  apiSearchKeyword: '',
  apiMethodFilter: 'ALL',
  isActiveOnly: false,
  panelPosition: 'bottom-left',
  panelSize: 'medium',
};

export const usePanelStore = create<PanelStoreState & PanelStoreAction>()(
  persist(
    (set, _get) => ({
      ...initialState,

      setApiSearchQuery: (query: string) => {
        set({ apiSearchKeyword: query });
      },
      setApiMethodFilter: (method: string) => {
        set({ apiMethodFilter: method });
      },
      toggleActiveOnly: () => {
        set(state => ({ isActiveOnly: !state.isActiveOnly }));
      },
      setPanelPosition: (position: PanelPosition) => {
        set({ panelPosition: position });
      },
      setPanelSize: (size: PanelSize) => {
        set({ panelSize: size });
      },
    }),
    {
      name: LOCAL_STORAGE_KEY.MOCKING_GUI_PANEL,
      partialize: state => ({
        apiSearchKeyword: state.apiSearchKeyword,
        apiMethodFilter: state.apiMethodFilter,
        isActiveOnly: state.isActiveOnly,
        panelPosition: state.panelPosition,
        panelSize: state.panelSize,
      }),
    },
  ),
);
