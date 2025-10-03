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

// ========================== CACHE EN MÉMOIRE POUR MODE DEMO ==========================

// Cache pour stocker les textes et commentaires créés en mode DEMO
let inMemoryTexts: any[] = [];
let inMemoryComments: any[] = [];

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
      // Initialiser le cache si vide (première fois)
      if (inMemoryTexts.length === 0) {
        inMemoryTexts = [
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
        ];
      }
      // Retourner les textes du cache
      responseData = {
        texts: [...inMemoryTexts]
      };
      break;
      
    case 'createText':
      // Créer et ajouter le texte au cache
      const newText = {
        id: `text-${Date.now()}`,
        workspace_id: data?.workspaceId || 'demo-workspace-123',
        title: data?.title || 'Sans titre',
        content: data?.content || '',
        created_by: 'demo-user-123',
        created_at: new Date(),
        updated_at: new Date()
      };
      inMemoryTexts.unshift(newText); // Ajouter au début
      responseData = {
        text: newText
      };
      break;
      
    case 'deleteText':
      // Supprimer du cache
      inMemoryTexts = inMemoryTexts.filter(t => t.id !== data?.textId);
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
      
    // =============== COMMENTAIRES (PARTIE 2) ===============
      
    case 'getComments':
      // Initialiser le cache si vide (première fois)
      if (inMemoryComments.length === 0) {
        inMemoryComments = [
          {
            id: 'comment-demo-1',
            workspace_id: data?.workspaceId || 'demo-workspace-123',
            text_id: 'text-demo-1',
            content: 'Excellent article ! Très instructif.',
            author: 'Alice Martin',
            created_by: 'demo-user-123',
            created_at: new Date(Date.now() - 7200000), // Il y a 2h
            updated_at: new Date(Date.now() - 7200000)
          },
          {
            id: 'comment-demo-2',
            workspace_id: data?.workspaceId || 'demo-workspace-123',
            text_id: 'text-demo-1',
            content: 'Merci pour ces explications claires !',
            author: 'Bob Dupont',
            created_by: 'demo-user-123',
            created_at: new Date(Date.now() - 3600000), // Il y a 1h
            updated_at: new Date(Date.now() - 3600000)
          },
          {
            id: 'comment-demo-3',
            workspace_id: data?.workspaceId || 'demo-workspace-123',
            text_id: 'text-demo-2',
            content: 'Très bon exemple d\'architecture !',
            author: 'Claire Bernard',
            created_by: 'demo-user-123',
            created_at: new Date(Date.now() - 1800000), // Il y a 30min
            updated_at: new Date(Date.now() - 1800000)
          }
        ];
      }
      
      // Filtrer par text_id si fourni
      responseData = {
        comments: data?.text_id 
          ? inMemoryComments.filter(c => c.text_id === data.text_id)
          : [...inMemoryComments]
      };
      break;
      
    case 'createComment':
      // Créer et ajouter le commentaire au cache
      const newComment = {
        id: `comment-${Date.now()}`,
        workspace_id: data?.workspaceId || 'demo-workspace-123',
        text_id: data?.text_id || 'text-demo-1',
        content: data?.content || '',
        author: data?.author || 'Anonyme',
        created_by: 'demo-user-123',
        created_at: new Date(),
        updated_at: new Date()
      };
      inMemoryComments.unshift(newComment); // Ajouter au début
      responseData = {
        comment: newComment
      };
      break;
      
    case 'deleteComment':
      // Supprimer du cache
      inMemoryComments = inMemoryComments.filter(c => c.id !== data?.commentId);
      responseData = {
        deleted: true
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