export type ReportSeverity = 'High' | 'Medium' | 'Low';
export type ReportStatus = 'Pending Review' | 'Under Investigation' | 'Resolved';

export interface CorruptionReport {
  id: string;
  user_id: string;
  title: string;
  content: string;
  severity: ReportSeverity;
  status: ReportStatus;
  created_at: string;
  updated_at: string;
}