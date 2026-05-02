import { useState, useCallback, useRef } from "react";
import { api } from "@/lib/api";

type PollingState = "idle" | "polling" | "confirmed" | "failed" | "timeout";

interface UsePaymentPollingOptions {
  intervalMs?: number;
  maxAttempts?: number;
  onSuccess?: (orderNumber: string) => void;
  onTimeout?: (orderNumber: string, attempts: number) => void;
  onError?: (error: Error) => void;
}

export function usePaymentPolling(options: UsePaymentPollingOptions = {}) {
  const {
    intervalMs = 3000,
    maxAttempts = 30,
    onSuccess,
    onTimeout,
    onError,
  } = options;

  const [state, setState] = useState<PollingState>("idle");
  const [attempts, setAttempts] = useState(0);
  const [lastStatus, setLastStatus] = useState<string | null>(null);
  const abortRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    abortRef.current = true;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startPolling = useCallback(
    async (orderNumber: string, cartToken: string) => {
      stop();
      abortRef.current = false;
      setState("polling");
      setAttempts(0);
      setLastStatus(null);

      const poll = async (attempt: number) => {
        if (abortRef.current || attempt >= maxAttempts) {
          if (attempt >= maxAttempts) {
            setState("timeout");
            onTimeout?.(orderNumber, attempt);
          }
          return;
        }

        setAttempts(attempt + 1);

        try {
          const order = await api.getOrder(orderNumber, cartToken);
          setLastStatus(order.status);

          if (order.status === "paid") {
            setState("confirmed");
            stop();
            onSuccess?.(orderNumber);
            return;
          }

          if (order.status === "cancelled") {
            setState("failed");
            stop();
            onError?.(new Error("Order was cancelled"));
            return;
          }

          timeoutRef.current = setTimeout(() => poll(attempt + 1), intervalMs);
        } catch (error) {
          if (abortRef.current) return;

          if (attempt + 1 >= maxAttempts) {
            setState("timeout");
            onTimeout?.(orderNumber, attempt + 1);
            return;
          }

          timeoutRef.current = setTimeout(() => poll(attempt + 1), intervalMs);
        }
      };

      timeoutRef.current = setTimeout(() => poll(0), intervalMs);
    },
    [intervalMs, maxAttempts, onSuccess, onTimeout, onError, stop],
  );

  return {
    state,
    attempts,
    maxAttempts,
    lastStatus,
    isPolling: state === "polling",
    isConfirmed: state === "confirmed",
    isFailed: state === "failed",
    isTimeout: state === "timeout",
    startPolling,
    stop,
  };
}
