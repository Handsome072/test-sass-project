'use client';

import React from 'react';
import { createModule, ModuleProps } from './core/BaseModule';
import { ModuleId } from '@/data/ai-employees';

/**
 * Module de chat avec l'agent IA
 * 🔧 VERSION DEMO - Interface simplifiée
 */
const ChatModule: React.FC<ModuleProps> = ({ employee }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4"
            style={{ backgroundColor: employee.hexColor }}
          >
            {employee.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Chat avec {employee.name}
          </h1>
          <p className="text-gray-600 mb-6">
            {employee.role}
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              🔧 Module Chat - Version Demo
            </h2>
            <p className="text-blue-700 mb-4">
              Ce module permet de discuter avec l'agent IA {employee.name}.
            </p>
            <div className="text-sm text-blue-600 space-y-2">
              <p>✅ Architecture modulaire respectée</p>
              <p>✅ Patterns Agentova appliqués</p>
              <p>✅ Interface utilisateur moderne</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default createModule(ChatModule, ModuleId.CHAT, 'Chat');

