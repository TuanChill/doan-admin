import { TokenData } from '@/types/token';
import { create } from 'zustand';
// State và Actions
type State = {
  tokens: TokenData[];
};

type Actions = {
  setTokens: (tokens: TokenData[]) => void;
};

// Default value for state
const defaultStates: State = {
  tokens: [],
};

// create store using zustands
export const useTokenStore = create<State & Actions>()((set) => ({
  ...defaultStates,
  setTokens: (tokens: TokenData[]) => {
    set({
      tokens: tokens,
    });
  },
}));
