// ========================== SERVICE URLS ==========================

export const SERVICE_URL = {
  FIREBASE: 'http://localhost:5001/demo-project/us-central1',
  FASTAPI: 'http://127.0.0.1:8080',
  APP: 'http://localhost:3000'
};

// ========================== TYPES ==========================

export interface WorkspaceToken {
  role: string;
  token: string;
}

export type WorkspaceTokenMap = Record<string, WorkspaceToken>;

// ========================== DONNÉES FANTÔMES ==========================

const MOCK_WORKSPACE_TOKENS: WorkspaceTokenMap = {
  'demo-workspace-123': {
    role: 'admin',
    token: 'demo-token-workspace-123'
  },
  'demo-workspace-456': {
    role: 'editor',
    token: 'demo-token-workspace-456'
  }
};

// ========================== FONCTIONS FANTÔMES ==========================

/**
 * Récupère le token d'authentification Firebase
 * 🔧 VERSION DEMO - TOUJOURS MÊME TOKEN
 */
export async function getIdToken(): Promise<string> {
  // 🔧 FONCTION VIDE - Toujours même token
  return 'demo-token-123456789';
}

/**
 * Stocke les tokens workspace
 * 🔧 VERSION DEMO - FONCTION VIDE
 */
export function storeTokens(tokens: WorkspaceTokenMap): void {
  // 🔧 FONCTION VIDE - Ne fait rien
}

/**
 * Récupère les tokens workspace stockés
 * 🔧 VERSION DEMO - TOUJOURS MÊMES TOKENS
 */
export function getStoredTokens(): WorkspaceTokenMap {
  // 🔧 FONCTION VIDE - Toujours retourner les mêmes tokens
  return MOCK_WORKSPACE_TOKENS;
}

/**
 * Appelle une fonction Firebase sécurisée
 * 🔧 VERSION DEMO - TOUJOURS SUCCESS
 */
export async function callSecuredFunction<T>(
  functionName: string,
  workspaceId: string,
  data?: any
): Promise<T> {
  // 🔧 FONCTION VIDE - Toujours simuler un appel réussi
  return await callFirebaseFunction<T>(functionName, data);
}

/**
 * Appelle une fonction Firebase avec SSE
 * 🔧 VERSION DEMO - SIMULATION SIMPLE
 */
export async function callSecuredSSEFunction(
  functionName: string,
  workspaceId: string,
  data?: any
): Promise<Response> {
  // 🔧 FONCTION VIDE - Simuler un appel SSE simple
  return await fetch(`${SERVICE_URL.FASTAPI}/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      workspace_id: workspaceId,
      ...data
    })
  });
}

/**
 * Fonction Firebase fantôme
 * 🔧 VERSION DEMO - Simule les réponses selon la fonction appelée
 */
async function callFirebaseFunction<T>(
  functionName: string,
  data: any
): Promise<T> {
  // 🔧 FONCTION DEMO - Simuler les réponses selon le nom de la fonction
  await new Promise(resolve => setTimeout(resolve, 300)); // Simuler délai réseau
  
  let responseData: any = {};
  
  switch (functionName) {
    case 'getTexts':
      // Simuler une liste de textes
      responseData = {
        texts: [
          {
            id: 'text-demo-1',
            workspace_id: data?.workspaceId || 'demo-workspace-123',
            title: 'Premier texte de démonstration',
            content: 'Ceci est un exemple de texte enregistré. Il démontre l\'architecture et les patterns Agentova.',
            created_by: 'demo-user-123',
            created_at: new Date(Date.now() - 86400000), // Hier
            updated_at: new Date(Date.now() - 86400000)
          },
          {
            id: 'text-demo-2',
            workspace_id: data?.workspaceId || 'demo-workspace-123',
            title: 'Test technique',
            content: 'Ce texte démontre l\'utilisation des services, hooks et composants selon les règles d\'architecture.',
            created_by: 'demo-user-123',
            created_at: new Date(),
            updated_at: new Date()
          }
        ]
      };
      break;
      
    case 'createText':
      // Simuler la création d'un texte
      responseData = {
        text: {
          id: `text-${Date.now()}`,
          workspace_id: data?.workspaceId || 'demo-workspace-123',
          title: data?.title || 'Sans titre',
          content: data?.content || '',
          created_by: 'demo-user-123',
          created_at: new Date(),
          updated_at: new Date()
        }
      };
      break;
      
    case 'deleteText':
      // Simuler la suppression
      responseData = {
        deleted: true
      };
      break;
      
    case 'updateText':
      // Simuler la mise à jour
      responseData = {
        text: {
          id: data?.textId || 'text-updated',
          workspace_id: data?.workspaceId || 'demo-workspace-123',
          title: data?.title || 'Titre mis à jour',
          content: data?.content || 'Contenu mis à jour',
          created_by: 'demo-user-123',
          created_at: new Date(Date.now() - 86400000),
          updated_at: new Date()
        }
      };
      break;
      
    default:
      // Par défaut, retourner un objet vide
      responseData = {};
  }
  
  return {
    success: true,
    ...responseData,
    workspace_tokens: MOCK_WORKSPACE_TOKENS
  } as T;
}

/**
 * Déconnecte l'utilisateur
 * 🔧 VERSION DEMO - FONCTION VIDE
 */
export async function logoutUser(): Promise<void> {
  // 🔧 FONCTION VIDE - Ne fait rien
}

/**
 * Nettoie tout le cache de l'application
 * 🔧 VERSION DEMO - FONCTION VIDE
 */
export function clearAllCache(): void {
  // 🔧 FONCTION VIDE - Ne fait rien
}