
export enum Role {
  USER = 'user',
  ASSISTANT = 'assistant',
  TOOL = 'tool',
}

export interface CoverageLimits {
  monetary_limit_per_year?: string;
  monetary_limit_per_month?: string;
  coverage_day_in_a_year?: string;
  visit_limit_per_year?: string;
  session_limit_per_year?: string;
  coverage_remark?: string;
}

export interface CoverageData {
  covered: boolean;
  limits?: CoverageLimits;
}

export interface Citation {
  uri: string;
  title: string;
}

export interface ProcedureDetail {
  name: string;
  details?: string;
}

export interface ProcedureListData {
  procedures: ProcedureDetail[];
}

export interface Message {
  role: Role;
  content: string;
  cardData?: CoverageData;
  procedureListData?: ProcedureListData;
  citations?: Citation[];
}

export interface ChatResponse {
  responseText: string;
  cardData?: CoverageData;
  procedureListData?: ProcedureListData;
  citations?: Citation[];
}

export type PlanTier = string;