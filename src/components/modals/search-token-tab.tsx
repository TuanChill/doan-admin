'use client';

import { Search, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import type { TokenSearchResult } from '@/types/token';
import { Input } from '@/components/common/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/common/button';

interface SearchTokenTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: TokenSearchResult[];
  setSearchResults: (results: TokenSearchResult[]) => void;
  onNext: () => void;
}

export default function SearchTokenTab({
  searchQuery,
  setSearchQuery,
  searchResults,
  setSearchResults,
  onNext,
}: SearchTokenTabProps) {
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const toggleTokenSelection = (id: string) => {
    setSearchResults(
      searchResults.map((token) =>
        token.id === id ? { ...token, selected: !token.selected } : token
      )
    );
  };

  const hasSelectedTokens = searchResults.some((token) => token.selected);

  return (
    <div className="p-4">
      <div className="relative mb-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="border-gray-700 bg-gray-800 pl-10 pr-10 text-white"
        />
        {searchQuery && (
          <button
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={clearSearch}
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      <div className="custom-scrollbar mb-4 max-h-72 space-y-2 overflow-y-auto">
        {searchResults.map((token) => (
          <div
            key={token.id}
            className="flex cursor-pointer items-center space-x-3 rounded-md p-2 hover:bg-gray-800"
            onClick={() => toggleTokenSelection(token.id)}
          >
            <Checkbox
              checked={token.selected || false}
              onCheckedChange={() => toggleTokenSelection(token.id)}
              className="border-gray-600"
            />
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white">
              <Avatar className="size-8">
                <AvatarImage src={''} />
                <AvatarFallback>
                  {token.symbol.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-1">
              <div className="text-subhead-sm">{token.name}</div>
              <div className="text-body-sm text-dark-gray-30">
                {token.symbol}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={onNext} disabled={!hasSelectedTokens} className="w-full">
        Next
      </Button>
    </div>
  );
}
