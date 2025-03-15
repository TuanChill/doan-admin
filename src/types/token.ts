export interface TokenData {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  networkAddress: string;
  balance: string;
}

export interface TokenSearchResult {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  selected?: boolean;
}

export interface CustomTokenData {
  contractAddress: string;
  symbol: string;
  decimal?: string;
}
