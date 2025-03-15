'use client';

import type { TokenData } from '@/types/token';
import ImportTokenModal from '@/components/modals/import-token-modal';
import TokenCard from '@/components/common/token-card';
import { useTokenStore } from '@/stores/use-token-store';
import { useLayoutStore } from '@/stores/use-layout-store';

export default function TokenManagementPage() {
  const { tokens, setTokens } = useTokenStore();
  const { isImportTokenModalOpen, setIsImportTokenModal } = useLayoutStore();

  const handleImportToken = (token: TokenData) => {
    setTokens([...tokens, token]);
    setIsImportTokenModal(false);
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tokens.map((token) => (
          <TokenCard key={token.id} token={token} />
        ))}
      </div>
      <ImportTokenModal
        isOpen={isImportTokenModalOpen}
        onClose={() => setIsImportTokenModal(false)}
        onImport={handleImportToken}
      />
    </div>
  );
}
