'use client';

import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { getLogsOptionsRequest, getLogsRequest } from '@/queries/logs';
import { LogEntry, LogsFilters, LogsOptionsResponse } from '@/types/logs';
import { PaginatedResponseMeta } from '@/types/pagination';

const DEFAULT_LIMIT = 10;

const createEmptyFilters = (): LogsFilters => ({
  q: '',
  endpoint: null,
  username: null,
  tabla: null,
});

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err instanceof AxiosError) {
    const message = err.response?.data?.message;

    if (typeof message === 'string') {
      return message;
    }

    if (Array.isArray(message)) {
      return message.join(' ');
    }
  }

  return fallback;
};

export const useLogsHook = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [options, setOptions] = useState<LogsOptionsResponse>({
    endpoints: [],
    usernames: [],
    tablas: [],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginatedResponseMeta>({
    page: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFiltersState] = useState<LogsFilters>(createEmptyFilters());

  const setFilters = (nextFilters: LogsFilters) => {
    setFiltersState(nextFilters);
  };

  const fetchOptions = useCallback(async () => {
    const response = await getLogsOptionsRequest();
    setOptions(response);
  }, []);

  const fetchLogs = useCallback(
    async (nextPage = 1) => {
      setLoading(true);
      setError('');

      try {
        const response = await getLogsRequest({
          page: nextPage,
          limit: DEFAULT_LIMIT,
          filters,
        });

        setLogs(response.data);
        setMeta(response.meta);
        setPage(response.meta.page);
        setSelectedLog((current) =>
          current
            ? response.data.find((item) => item.id === current.id) ?? null
            : null,
        );
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'No se pudieron obtener los logs.'));
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    void fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    void fetchLogs(1);
  }, [fetchLogs]);

  return {
    logs,
    options,
    selectedLog,
    setSelectedLog,
    error,
    loading,
    page,
    total: meta.total,
    limit: meta.limit,
    filters,
    setFilters,
    refetch: fetchLogs,
  };
};
