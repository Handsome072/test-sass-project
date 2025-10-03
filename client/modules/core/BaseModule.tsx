import React from 'react';
import { AIEmployee } from '@/data/ai-employees';

/**
 * Interface de base pour tous les modules
 * ✅ Respecte les patterns Agentova pour les modules
 */
export interface ModuleComponent extends React.FC<ModuleProps> {
  moduleId: string;
  displayName?: string;
}

export interface ModuleProps {
  employee: AIEmployee;
  onModuleChange?: (moduleId: string) => void;
}

/**
 * Créateur de module avec pattern HOC
 * ✅ Permet d'ajouter des métadonnées aux modules
 */
export function createModule(
  Component: React.FC<ModuleProps>,
  moduleId: string,
  displayName?: string
): ModuleComponent {
  const Module = Component as ModuleComponent;
  Module.moduleId = moduleId;
  Module.displayName = displayName || moduleId;
  return Module;
}

