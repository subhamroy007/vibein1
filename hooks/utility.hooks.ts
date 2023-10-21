import { useCallback, useEffect, useRef, useState } from "react";
import { ThunkState } from "../types/store.types";

export function usePhotoFetch(autoRetry?: boolean) {
  const [photoLoadingState, setPhotoLoadingState] =
    useState<ThunkState>("idle");

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (photoLoadingState === "failed" && autoRetry) {
      timeoutRef.current = setTimeout(() => setPhotoLoadingState("idle"), 2000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [photoLoadingState, autoRetry]);

  const photoLoadCallback = useCallback(
    () => setPhotoLoadingState("success"),
    []
  );

  const photoLoadErrorCallback = useCallback(
    () => setPhotoLoadingState("failed"),
    []
  );

  const photoLoadStartCallback = useCallback(
    () => setPhotoLoadingState("loading"),
    []
  );

  return {
    photoLoadCallback,
    photoLoadErrorCallback,
    photoLoadStartCallback,
    photoLoadingState,
  };
}
