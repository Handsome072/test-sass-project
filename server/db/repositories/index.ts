// ✅ Imports actifs pour le test
import { TextRepository } from './textRepository.js';
import { CommentRepository } from './commentRepository.js';

// 🔧 DEMO - Imports désactivés (non nécessaires pour le test)
// import { AutomationDiscussionRepository } from './automationDiscussionRepository';
// import { AutomationRepository } from './automationRepository';
// import { CampaignRepository } from './campaignRepository';
// import { CustomAgentRepository } from './customAgentRepository';
// import { CustomAgentNotificationRepository } from './customAgentNotificationRepository';
// import { ImageGenerationRepository } from './imageGenerationRepository';
// import { OAuthTokenRepository } from './oauthTokenRepository';
// import { SessionRepository } from './sessionRepository';
// import { WorkspaceDocumentRepository } from './workspaceDocumentRepository';
// import { WorkspaceInvitationRepository } from './workspaceInvitationRepository';
// import { WorkspaceRepository } from './workspaceRepository';
// import { ReplyCommentRepository } from './replyCommentRepository.js';
// import { LeadRepository } from './leadRepository';
// import { InboxStatesRepository } from './inboxStatesRepository';

// Singleton instances - on les déclare comme undefined pour éviter l'initialisation au build
let textRepo: TextRepository | undefined;
let commentRepo: CommentRepository | undefined;

// ✅ Getters actifs pour le test
export function getTextRepository(): TextRepository {
  if (!textRepo) {
    textRepo = new TextRepository();
  }
  return textRepo;
}

export function getCommentRepository(): CommentRepository {
  if (!commentRepo) {
    commentRepo = new CommentRepository();
  }
  return commentRepo;
}

// Cleanup function for testing purposes
export function clearRepositories(): void {
  textRepo = undefined;
  commentRepo = undefined;
} 



