/* eslint-disable no-unused-vars */
import { create } from 'zustand';
// State và Actions
type State = {
  currentTab: string;
  isImportTokenModalOpen: boolean;
};

type Actions = {
  setCurrentTab: (value: string) => void;
  setIsImportTokenModal: (value: boolean) => void;
};

// Default value for state
const defaultStates: State = {
  currentTab: '',
  isImportTokenModalOpen: false,
};

// create store using zustands
export const useLayoutStore = create<State & Actions>()((set) => ({
  ...defaultStates,
  setCurrentTab: (value: string) => {
    set({ currentTab: value });
  },
  setIsImportTokenModal: (value: boolean) => {
    set({ isImportTokenModalOpen: value });
  },
}));
