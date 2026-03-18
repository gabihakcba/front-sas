import { PaginatedResponseMeta } from '@/types/pagination';

export interface LogScopeSummary {
  role: string;
  scopeType: string;
  scopeId: number | null;
}

export interface LogCuentaSummary {
  userId: number;
  username: string;
  roles: string[];
  scopes: LogScopeSummary[];
}

export interface LogMiembroSummary {
  memberId: number | null;
}

export interface LogActionSummary {
  id: number;
  tabla: string;
  createdAt: string;
}

export interface LogEntry {
  id: number;
  endpoint: string;
  timestamp: string;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
  cuenta: LogCuentaSummary | null;
  miembro: LogMiembroSummary | null;
  Action: LogActionSummary[];
}

export interface PaginatedLogsResponse {
  data: LogEntry[];
  meta: PaginatedResponseMeta;
}

export interface LogsFilters {
  q: string;
  endpoint: string | null;
  username: string | null;
  tabla: string | null;
}

export interface LogsOptionsResponse {
  endpoints: string[];
  usernames: string[];
  tablas: string[];
}
