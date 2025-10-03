'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

/**
 * Context pour gérer les paramètres du chat
 * 🔧 VERSION DEMO - Context minimal pour l'architecture
 */

interface ChatParamsContextType {
  selectedAgentId: string | null;
  setSelectedAgentId: (id: string | null) => void;
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
}

const ChatParamsContext = createContext<ChatParamsContextType | undefined>(undefined);

export function ChatParamsProvider({ children }: { children: React.ReactNode }) {
  const [selectedAgentId, setSelectedAgentIdState] = useState<string | null>(null);
  const [sessionId, setSessionIdState] = useState<string | null>(null);

  // ✅ Handlers stabilisés avec useCallback
  const setSelectedAgentId = useCallback((id: string | null) => {
    setSelectedAgentIdState(id);
  }, []);

  const setSessionId = useCallback((id: string | null) => {
    setSessionIdState(id);
  }, []);

  // ✅ Valeur stabilisée avec useMemo
  const contextValue = useMemo(() => ({
    selectedAgentId,
    setSelectedAgentId,
    sessionId,
    setSessionId
  }), [selectedAgentId, setSelectedAgentId, sessionId, setSessionId]);

  return (
    <ChatParamsContext.Provider value={contextValue}>
      {children}
    </ChatParamsContext.Provider>
  );
}

export function useChatParams(): ChatParamsContextType {
  const context = useContext(ChatParamsContext);
  if (!context) {
    throw new Error('useChatParams must be used within a ChatParamsProvider');
  }
  return context;
}

