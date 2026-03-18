import api from '@/lib/axios';
import {
  LogsFilters,
  LogsOptionsResponse,
  PaginatedLogsResponse,
} from '@/types/logs';

interface GetLogsParams {
  page?: number;
  limit?: number;
  filters?: LogsFilters;
}

export const getLogsRequest = async ({
  page = 1,
  limit = 10,
  filters,
}: GetLogsParams = {}): Promise<PaginatedLogsResponse> => {
  const response = await api.get<PaginatedLogsResponse>('/logs', {
    params: {
      page,
      limit,
      ...(filters?.q.trim() ? { q: filters.q.trim() } : {}),
      ...(filters?.endpoint ? { endpoint: filters.endpoint } : {}),
      ...(filters?.username ? { username: filters.username } : {}),
      ...(filters?.tabla ? { tabla: filters.tabla } : {}),
    },
  });

  return response.data;
};

export const getLogsOptionsRequest = async (): Promise<LogsOptionsResponse> => {
  const response = await api.get<LogsOptionsResponse>('/logs/options');
  return response.data;
};
