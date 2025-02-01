export type ContractStatus = 'pending' | 'in_review' | 'completed';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface Contract {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  status: ContractStatus;
  created_at: string;
  updated_at: string;
}

export interface ContractReview {
  id: string;
  contract_id: string;
  summary: string;
  risk_level: RiskLevel;
  recommendations: string[];
  created_at: string;
}