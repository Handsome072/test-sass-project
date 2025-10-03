'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Layout protégé pour le dashboard
 * 🔧 VERSION DEMO - Vérification d'authentification simplifiée
 */
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAuth();

  useEffect(() => {
    // En mode DEMO, toujours considérer comme authentifié
    // Dans un vrai projet, rediriger vers /login si non authentifié
    if (!isInitializing && !isAuthenticated) {
      console.log('🔧 [DEMO] Non authentifié - En production, redirection vers /login');
      // router.push('/login'); // Désactivé en mode DEMO
    }
  }, [isAuthenticated, isInitializing, router]);

  // Afficher un loader pendant la vérification
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

