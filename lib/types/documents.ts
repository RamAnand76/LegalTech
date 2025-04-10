export interface Document {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    content: string;
    document_type: string;
    jurisdiction: string | null;
    effective_date: string | null;
    created_at: string;
    updated_at: string;
  }
  
  export type DocumentType = 'Contract' | 'NDA' | 'Agreement' | 'Policy' | 'Other';