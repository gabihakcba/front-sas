'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  ConsejoRealtimeState,
  ConsejoRealtimeTemarioUpdate,
} from '@/types/consejos';

const EMPTY_STATE: ConsejoRealtimeState = {
  speakers: [],
  raisedHands: [],
  moderatorMemberId: null,
};

interface UseConsejoRealtimeParams {
  consejoId: number;
  token: string | null;
  enabled: boolean;
}

const getSocketBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useConsejoRealtime({
  consejoId,
  token,
  enabled,
}: UseConsejoRealtimeParams) {
  const socketRef = useRef<Socket | null>(null);
  const [state, setState] = useState<ConsejoRealtimeState>(EMPTY_STATE);
  const [lastTemarioUpdate, setLastTemarioUpdate] =
    useState<ConsejoRealtimeTemarioUpdate | null>(null);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!enabled || !token || !Number.isFinite(consejoId) || consejoId <= 0) {
      return;
    }

    const socket: Socket = io(`${getSocketBaseUrl()}/consejos`, {
      transports: ['polling', 'websocket'],
      withCredentials: true,
      auth: {
        token,
        consejoId,
      },
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setError('');
      socket.emit('consejo:state:get');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('consejo:state', (nextState: ConsejoRealtimeState) => {
      setState(nextState);
    });

    socket.on('consejo:temario:updated', (payload: ConsejoRealtimeTemarioUpdate) => {
      setLastTemarioUpdate(payload);
    });

    socket.on('connect_error', (socketError: Error) => {
      setError(socketError.message || 'No se pudo conectar al tiempo real del consejo.');
    });

    socket.on('exception', (payload: { message?: string | string[] }) => {
      const message = Array.isArray(payload?.message)
        ? payload.message.join(' ')
        : payload?.message;
      setError(message || 'Ocurrio un error en la conexion en tiempo real.');
    });

    return () => {
      socketRef.current = null;
      socket.disconnect();
    };
  }, [consejoId, enabled, token]);

  const emit = (event: string, payload?: Record<string, unknown>) => {
    socketRef.current?.emit(event, payload);
  };

  return {
    state: enabled ? state : EMPTY_STATE,
    lastTemarioUpdate: enabled ? lastTemarioUpdate : null,
    error: enabled ? error : '',
    isConnected: enabled ? isConnected : false,
    setError,
    emit,
  };
}
