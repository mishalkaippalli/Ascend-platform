
export enum BookStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PUBLISHED = 'published',
}

//  Tracks the status of preparing a book's content for the AI chatbot's RAG index.
export enum ChatbotIndexingStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  READY = 'ready',
  FAILED = 'failed',
}
