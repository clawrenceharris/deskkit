"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase/client";
import type {
  ManualActivityStatus,
  PresenceClientMessage,
  PresenceServerMessage,
  ResolvedActivityStatus,
} from "../domain/types";
import { setActivityStatusAction } from "@/actions/presence";

type PresenceContextValue = {
  /** Current user's resolved status */
  myStatus: ResolvedActivityStatus | null;
  /** Lookup status for any userId (falls back to offline) */
  getStatus: (userId: string) => ResolvedActivityStatus;
  /** Whether the WebSocket connection is live */
  isConnected: boolean;
  /** Set manual status for the current user */
  setStatus: (
    status: ManualActivityStatus,
    durationMinutes?: number | null,
  ) => Promise<void>;
  /** Subscribe to status updates for given user IDs */
  subscribe: (userIds: string[]) => void;
  /** Unsubscribe from status updates */
  unsubscribe: (userIds: string[]) => void;
};

const OFFLINE_STATUS: ResolvedActivityStatus = {
  status: "offline",
  isManual: false,
  expiresAt: null,
};

const PresenceContext = createContext<PresenceContextValue | undefined>(undefined);

const WS_URL =
  process.env.NEXT_PUBLIC_PRESENCE_WS_URL ?? "ws://localhost:3001";
const PING_INTERVAL_MS = 30_000;
const RECONNECT_DELAY_MS = 3_000;

type PresenceProviderProps = {
  children: ReactNode;
  userId: string | null;
};

export function PresenceProvider({ children, userId }: PresenceProviderProps) {
  const [statuses, setStatuses] = useState<Record<string, ResolvedActivityStatus>>({});
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const pendingSubscriptions = useRef<Set<string>>(new Set());
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pingTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const send = useCallback((message: PresenceClientMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  const applyStatusUpdate = useCallback(
    (userId: string, update: ResolvedActivityStatus) => {
      setStatuses((prev) => ({ ...prev, [userId]: update }));
    },
    [],
  );

  const subscribe = useCallback(
    (userIds: string[]) => {
      for (const id of userIds) {
        pendingSubscriptions.current.add(id);
      }
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        send({ type: "subscribe", userIds });
      }
    },
    [send],
  );

  const unsubscribe = useCallback(
    (userIds: string[]) => {
      for (const id of userIds) {
        pendingSubscriptions.current.delete(id);
      }
      send({ type: "unsubscribe", userIds });
    },
    [send],
  );

  const setStatus = useCallback(
    async (status: ManualActivityStatus, durationMinutes?: number | null) => {
      if (!userId) return;

      // Optimistic update via server action (works even if WS is down)
      const result = await setActivityStatusAction({ status, durationMinutes });
      if (result.success) {
        applyStatusUpdate(userId, result.data);
      }

      // Also send over WS for immediate broadcast
      send({ type: "set_status", status, durationMinutes });
    },
    [applyStatusUpdate, send, userId],
  );

  const getStatus = useCallback(
    (targetUserId: string): ResolvedActivityStatus => {
      return statuses[targetUserId] ?? OFFLINE_STATUS;
    },
    [statuses],
  );

  const handleServerMessage = useCallback(
    (message: PresenceServerMessage) => {
      switch (message.type) {
        case "auth_ok":
          setIsConnected(true);
          if (pendingSubscriptions.current.size > 0) {
            send({
              type: "subscribe",
              userIds: [...pendingSubscriptions.current],
            });
          }
          break;
        case "status_update":
          applyStatusUpdate(message.userId, {
            status: message.status,
            isManual: message.isManual,
            expiresAt: message.expiresAt,
          });
          break;
        case "status_batch":
          setStatuses((prev) => ({ ...prev, ...message.statuses }));
          break;
        case "auth_error":
          console.error("[presence] Auth error:", message.message);
          break;
      }
    },
    [applyStatusUpdate, send],
  );

  const connect = useCallback(async () => {
    if (!userId) return;

    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) return;

    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "auth", token } satisfies PresenceClientMessage));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data as string) as PresenceServerMessage;
        handleServerMessage(message);
      } catch (error) {
        console.error("[presence] Failed to parse message:", error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      wsRef.current = null;
      if (pingTimer.current) {
        clearInterval(pingTimer.current);
        pingTimer.current = null;
      }
      reconnectTimer.current = setTimeout(() => {
        void connect();
      }, RECONNECT_DELAY_MS);
    };

    ws.onerror = () => {
      ws.close();
    };

    pingTimer.current = setInterval(() => {
      send({ type: "ping" });
    }, PING_INTERVAL_MS);
  }, [handleServerMessage, send, userId]);

  useEffect(() => {
    void connect();

    return () => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }
      if (pingTimer.current) {
        clearInterval(pingTimer.current);
      }
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [connect]);

  const myStatus = userId ? (statuses[userId] ?? null) : null;

  const value = useMemo(
    (): PresenceContextValue => ({
      myStatus,
      getStatus,
      isConnected,
      setStatus,
      subscribe,
      unsubscribe,
    }),
    [getStatus, isConnected, myStatus, setStatus, subscribe, unsubscribe],
  );

  return (
    <PresenceContext.Provider value={value}>{children}</PresenceContext.Provider>
  );
}

export function usePresence() {
  const context = useContext(PresenceContext);
  if (!context) {
    throw new Error("usePresence must be used within a PresenceProvider");
  }
  return context;
}
