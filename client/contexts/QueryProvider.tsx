'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

/**
 * Provider React Query pour l'application
 * ✅ Respecte les patterns Agentova pour la gestion de cache
 */

// Créer le QueryClient en dehors du composant pour éviter les re-créations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,                    // Toujours refetch
      refetchOnMount: true,           // Refetch au montage
      retry: 1,                        // Réessayer une fois en cas d'échec
      refetchOnWindowFocus: false,    // Ne pas refetch au focus (mode DEMO)
    },
    mutations: {
      retry: 1,
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools uniquement en développement */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

