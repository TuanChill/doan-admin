import { ReactNode } from 'react';
import { create } from 'zustand';

type State = {
  /**
   * The loader is shown if `show()` has been called more times than `hide()` \
   * I.e. it will stop showing once `hide()` has been called as many times as `show()` (once all loading operations are complete)
   */
  isShowing: boolean;
  content: ReactNode;
  placement: 'right' | 'bottom' | 'top' | 'left';
};

type Actions = {
  show: () => void;
  hide: () => void;
  toggleDrawer: () => void;
  setDrawerContent: (data: ReactNode) => void;
  setPlacement: (data: 'right' | 'bottom' | 'top' | 'left') => void;
};

export const useDrawerStore = create<State & Actions>((set) => ({
  isShowing: false,
  content: null,
  showContent: false,
  placement: 'right',

  show: () =>
    set(() => ({
      isShowing: true,
    })),
  hide: () =>
    set(() => ({
      isShowing: false,
    })),
  toggleDrawer: () =>
    set((state) => ({
      isShowing: !state.isShowing,
    })),
  setDrawerContent: (data: ReactNode) => {
    set({
      content: data,
    });
  },
  setPlacement: (data: 'right' | 'bottom' | 'top' | 'left') => {
    set({
      placement: data,
    });
  },
}));
